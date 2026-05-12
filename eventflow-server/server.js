require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

const { Server } =
  require("socket.io");

const {
  createAdapter,
} = require(
  "@socket.io/redis-adapter"
);

const {
  createClient,
} = require("redis");

const connectDB =
  require("./config/db");

const Message =
  require("./models/Message");

const authRoutes =
  require(
    "./routes/authRoutes"
  );

const analyticsRoutes =
  require(
    "./routes/analyticsRoutes"
  );

const app = express();

/*
|--------------------------------------------------------------------------
| MULTER STORAGE
|--------------------------------------------------------------------------
*/

const storage =
  multer.diskStorage({

    destination:
      (req, file, cb) => {

        cb(
          null,
          "uploads/"
        );
      },

    filename:
      (req, file, cb) => {

        cb(
          null,

          Date.now() +
          path.extname(
            file.originalname
          )
        );
      },
  });

const upload =
  multer({
    storage,
  });

/*
|--------------------------------------------------------------------------
| MIDDLEWARE
|--------------------------------------------------------------------------
*/

app.use(cors());

app.use(express.json());

app.use(
  "/uploads",
  express.static("uploads")
);

/*
|--------------------------------------------------------------------------
| DATABASE
|--------------------------------------------------------------------------
*/

connectDB();

/*
|--------------------------------------------------------------------------
| SERVER
|--------------------------------------------------------------------------
*/

const server =
  http.createServer(app);

/*
|--------------------------------------------------------------------------
| SOCKET.IO
|--------------------------------------------------------------------------
*/

const io = new Server(server, {

  cors: {

    origin:
      "http://localhost:3000",

    methods: [
      "GET",
      "POST",
    ],
  },
});

/*
|--------------------------------------------------------------------------
| REDIS
|--------------------------------------------------------------------------
*/

async function setupRedis() {

  const pubClient =
    createClient({
      url:
        "redis://redis:6379",
    });

  const subClient =
    pubClient.duplicate();

  await pubClient.connect();

  await subClient.connect();

  io.adapter(
    createAdapter(
      pubClient,
      subClient
    )
  );

  console.log(
    "🚀 Redis Adapter Connected"
  );
}

setupRedis();

/*
|--------------------------------------------------------------------------
| SOCKET AUTH
|--------------------------------------------------------------------------
*/

io.use((socket, next) => {

  try {

    const token =
      socket.handshake.auth
        .token;

    if (!token) {

      return next(
        new Error(
          "Authentication Error"
        )
      );
    }

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    socket.user = decoded;

    next();

  } catch (error) {

    next(
      new Error(
        "Authentication Error"
      )
    );
  }
});

/*
|--------------------------------------------------------------------------
| ROOM USERS
|--------------------------------------------------------------------------
*/

const roomUsers = {};

/*
|--------------------------------------------------------------------------
| SOCKET CONNECTION
|--------------------------------------------------------------------------
*/

io.on(
  "connection",

  (socket) => {

    console.log(
      `✅ User Connected: ${socket.id}`
    );

    /*
    |--------------------------------------------------------------------------
    | JOIN ROOM
    |--------------------------------------------------------------------------
    */

    socket.on(
      "join_room",

      async ({
        room,
        username,
      }) => {

        try {

          socket.join(room);

          socket.room =
            room;

          socket.username =
            username;

          if (
            !roomUsers[room]
          ) {

            roomUsers[
              room
            ] = [];
          }

          roomUsers[
            room
          ].push(username);

          roomUsers[
            room
          ] = [
            ...new Set(
              roomUsers[room]
            ),
          ];

          io.to(room).emit(
            "online_users",

            roomUsers[room]
          );

          const previousMessages =
            await Message.find({
              room,
            }).sort({
              createdAt: 1,
            });

          socket.emit(
            "previous_messages",

            previousMessages
          );

        } catch (error) {

          console.error(
            error
          );
        }
      }
    );

    /*
    |--------------------------------------------------------------------------
    | SEND MESSAGE
    |--------------------------------------------------------------------------
    */

    socket.on(
      "send_message",

      async (data) => {

        try {

          const newMessage =
            new Message(data);

          const savedMessage =
            await newMessage.save();

          io.to(
            data.room
          ).emit(
            "receive_message",

            savedMessage
          );

        } catch (error) {

          console.error(
            error
          );
        }
      }
    );

    /*
    |--------------------------------------------------------------------------
    | TYPING
    |--------------------------------------------------------------------------
    */

    socket.on(
      "typing",

      (data) => {

        socket.to(
          data.room
        ).emit(
          "show_typing",

          data.username
        );
      }
    );

    /*
    |--------------------------------------------------------------------------
    | VIDEO / VOICE OFFER
    |--------------------------------------------------------------------------
    */

    socket.on(
      "voice_offer",

      (data) => {

        socket.to(
          data.room
        ).emit(
          "voice_offer",

          data
        );
      }
    );

    /*
    |--------------------------------------------------------------------------
    | VIDEO / VOICE ANSWER
    |--------------------------------------------------------------------------
    */

    socket.on(
      "voice_answer",

      (data) => {

        socket.to(
          data.room
        ).emit(
          "voice_answer",

          data
        );
      }
    );

    /*
    |--------------------------------------------------------------------------
    | ICE CANDIDATES
    |--------------------------------------------------------------------------
    */

    socket.on(
      "voice_candidate",

      (data) => {

        socket.to(
          data.room
        ).emit(
          "voice_candidate",

          data
        );
      }
    );

    /*
    |--------------------------------------------------------------------------
    | WHITEBOARD DRAW
    |--------------------------------------------------------------------------
    */

    socket.on(
      "draw",

      (data) => {

        socket.to(
          data.room
        ).emit(
          "draw",

          data
        );
      }
    );

    /*
    |--------------------------------------------------------------------------
    | CLEAR WHITEBOARD
    |--------------------------------------------------------------------------
    */

    socket.on(
      "clear_board",

      (room) => {

        socket.to(room).emit(
          "clear_board"
        );
      }
    );

    /*
    |--------------------------------------------------------------------------
    | DISCONNECT
    |--------------------------------------------------------------------------
    */

    socket.on(
      "disconnect",

      () => {

        const room =
          socket.room;

        const username =
          socket.username;

        if (
          roomUsers[room]
        ) {

          roomUsers[
            room
          ] =
            roomUsers[
              room
            ].filter(
              (user) =>
                user !==
                username
            );

          io.to(room).emit(
            "online_users",

            roomUsers[room]
          );
        }

        console.log(
          `❌ User Disconnected: ${socket.id}`
        );
      }
    );
  }
);

/*
|--------------------------------------------------------------------------
| FILE UPLOAD
|--------------------------------------------------------------------------
*/

app.post(
  "/api/upload",

  upload.single("file"),

  (req, res) => {

    try {

      res.json({

        fileUrl:
          `http://localhost:5002/uploads/${req.file.filename}`,
      });

    } catch (error) {

      console.error(
        error
      );

      res.status(500).json({

        message:
          "Upload failed",
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| ROUTES
|--------------------------------------------------------------------------
*/

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/analytics",
  analyticsRoutes
);

/*
|--------------------------------------------------------------------------
| TEST ROUTE
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {

  res.send(
    "🚀 EventFlow API Running"
  );
});

/*
|--------------------------------------------------------------------------
| START SERVER
|--------------------------------------------------------------------------
*/

const PORT =
  process.env.PORT || 5002;

server.listen(
  PORT,

  () => {

    console.log(
      `🔥 Server running on port ${PORT}`
    );
  }
);