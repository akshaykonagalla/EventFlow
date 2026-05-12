const express =
  require("express");

const router =
  express.Router();

const Message =
  require("../models/Message");

/*
|--------------------------------------------------------------------------
| GET ANALYTICS
|--------------------------------------------------------------------------
*/

router.get(
  "/",

  async (req, res) => {

    try {

      /*
      |--------------------------------------------------------------------------
      | TOTAL MESSAGES
      |--------------------------------------------------------------------------
      */

      const totalMessages =
        await Message.countDocuments();

      /*
      |--------------------------------------------------------------------------
      | ACTIVE ROOMS
      |--------------------------------------------------------------------------
      */

      const rooms =
        await Message.distinct(
          "room"
        );

      /*
      |--------------------------------------------------------------------------
      | FILE UPLOADS
      |--------------------------------------------------------------------------
      */

      const uploads =
        await Message.countDocuments({

          file: {
            $exists: true,
          },
        });

      /*
      |--------------------------------------------------------------------------
      | ROOM STATS
      |--------------------------------------------------------------------------
      */

      const roomStats =
        await Message.aggregate([

          {
            $group: {

              _id: "$room",

              messages: {
                $sum: 1,
              },
            },
          },
        ]);

      res.json({

        totalMessages,

        activeRooms:
          rooms.length,

        uploads,

        roomStats,
      });

    } catch (error) {

      console.error(
        error
      );

      res.status(500).json({

        message:
          "Analytics Error",
      });
    }
  }
);

module.exports =
  router;