import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import axios from "axios";

import {
  motion,
} from "framer-motion";

import {
  Video,
  Mic,
  MicOff,
  Monitor,
  PhoneOff,
  Upload,
  Send,
  LayoutDashboard,
} from "lucide-react";

import {
  socket,
  connectSocket,
} from "../services/socket";

import Navbar from "../components/Navbar";

import MessageBubble from "../components/MessageBubble";

import Whiteboard
from "../components/Whiteboard";

import {
  toast,
} from "react-toastify";

/*
|--------------------------------------------------------------------------
| RTC CONFIG
|--------------------------------------------------------------------------
*/

const servers = {
  iceServers: [
    {
      urls:
        "stun:stun.l.google.com:19302",
    },
  ],
};

const Chat = () => {

  const [username] =
    useState(
      localStorage.getItem(
        "username"
      ) || ""
    );

  const [room, setRoom] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [messages, setMessages] =
    useState([]);

  const [
    onlineUsers,
    setOnlineUsers,
  ] = useState([]);

  const [
    typingUser,
    setTypingUser,
  ] = useState("");

  const [
    selectedFile,
    setSelectedFile,
  ] = useState(null);

  const [
    sharingScreen,
    setSharingScreen,
  ] = useState(false);

  const [
    cameraOn,
    setCameraOn,
  ] = useState(true);

  const [
    muted,
    setMuted,
  ] = useState(false);

  const [
    isCalling,
    setIsCalling,
  ] = useState(false);

  const [
    callDuration,
    setCallDuration,
  ] = useState(0);

  const peerConnection =
    useRef(null);

  const localStream =
    useRef(null);

  const localVideo =
    useRef(null);

  const remoteVideo =
    useRef(null);

  const remoteAudio =
    useRef(null);

  const messagesEndRef =
    useRef(null);

  /*
  |--------------------------------------------------------------------------
  | AUTO SCROLL
  |--------------------------------------------------------------------------
  */

  const scrollToBottom = () => {

    messagesEndRef.current?.
      scrollIntoView({
        behavior:
          "smooth",
      });
  };

  useEffect(() => {

    scrollToBottom();

  }, [messages]);

  /*
  |--------------------------------------------------------------------------
  | TIMER
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    let timer;

    if (isCalling) {

      timer =
        setInterval(() => {

          setCallDuration(
            (prev) => prev + 1
          );

        }, 1000);
    }

    return () => {

      clearInterval(timer);
    };

  }, [isCalling]);

  /*
  |--------------------------------------------------------------------------
  | SOCKET
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    connectSocket();

    const savedRoom =
      localStorage.getItem(
        "room"
      );

    const savedUsername =
      localStorage.getItem(
        "username"
      );

    if (
      savedRoom &&
      savedUsername
    ) {

      setRoom(savedRoom);

      socket.emit(
        "join_room",
        {
          room:
            savedRoom,

          username:
            savedUsername,
        }
      );
    }

    socket.on(
      "previous_messages",

      (data) => {

        setMessages(data);
      }
    );

    socket.on(
      "receive_message",

      (data) => {

        setMessages(
          (prev) => [
            ...prev,
            data,
          ]
        );
      }
    );

    socket.on(
      "online_users",

      (users) => {

        setOnlineUsers(users);
      }
    );

    socket.on(
      "show_typing",

      (username) => {

        setTypingUser(
          `${username} is typing...`
        );

        setTimeout(() => {

          setTypingUser("");

        }, 1500);
      }
    );

    return () => {

      socket.disconnect();
    };

  }, []);

  /*
  |--------------------------------------------------------------------------
  | FORMAT TIME
  |--------------------------------------------------------------------------
  */

  const formatTime =
    (seconds) => {

      const mins =
        Math.floor(
          seconds / 60
        );

      const secs =
        seconds % 60;

      return `${mins}:${
        secs < 10
          ? "0"
          : ""
      }${secs}`;
    };

  /*
  |--------------------------------------------------------------------------
  | JOIN ROOM
  |--------------------------------------------------------------------------
  */

  const joinRoom = () => {

    if (!room) return;

    socket.emit(
      "join_room",

      {
        room,
        username,
      }
    );

    localStorage.setItem(
      "room",
      room
    );

    toast.success(
      `Joined ${room}`
    );
  };

  /*
  |--------------------------------------------------------------------------
  | SEND MESSAGE
  |--------------------------------------------------------------------------
  */

  const sendMessage = () => {

    if (!message) return;

    socket.emit(
      "send_message",

      {
        room,
        author:
          username,
        message,
      }
    );

    setMessage("");
  };

  /*
  |--------------------------------------------------------------------------
  | FILE UPLOAD
  |--------------------------------------------------------------------------
  */

  const uploadFile =
    async () => {

      if (!selectedFile)
        return;

      const formData =
        new FormData();

      formData.append(
        "file",
        selectedFile
      );

      const response =
        await axios.post(
          "http://localhost:5002/api/upload",
          formData
        );

      socket.emit(
        "send_message",

        {
          room,
          author:
            username,
          file:
            response.data.fileUrl,
        }
      );

      setSelectedFile(null);

      toast.success(
        "File Uploaded"
      );
    };

  return (

    <div style={styles.page}>

      <Navbar />

      <div style={styles.layout}>

        {/* SIDEBAR */}

        <motion.div
          initial={{
            opacity: 0,
            x: -40,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          className="glass glow"
          style={styles.sidebar}
        >

          <h1 style={styles.logo}>
            ⚡ EventFlow
          </h1>

          <p style={styles.subtext}>
            Real-Time Collaboration
          </p>

          <div
            style={{
              marginTop: "30px",
            }}
          >

            <h3
              style={{
                marginBottom:
                  "16px",
              }}
            >
              💬 Rooms
            </h3>

            {[
              "general",
              "developers",
              "design",
              "random",
            ].map((r) => (

              <motion.div
                whileHover={{
                  scale: 1.03,
                }}
                key={r}
                style={
                  styles.roomItem
                }
                onClick={() =>
                  setRoom(r)
                }
              >
                # {r}
              </motion.div>
            ))}
          </div>

          {/* USERS */}

          <div
            style={{
              marginTop: "40px",
            }}
          >

            <h3
              style={{
                marginBottom:
                  "16px",
              }}
            >
              🟢 Online Users
            </h3>

            {onlineUsers.map(
              (
                user,
                index
              ) => (

                <div
                  key={index}
                  style={
                    styles.userCard
                  }
                >

                  <span>
                    👤 {user}
                  </span>

                  <span
                    style={{
                      color:
                        "#10b981",
                    }}
                  >
                    ●
                  </span>
                </div>
              )
            )}
          </div>
        </motion.div>

        {/* MAIN */}

        <div style={styles.main}>

          {/* TOP BAR */}

          <motion.div
            initial={{
              opacity: 0,
              y: -20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="glass"
            style={styles.topBar}
          >

            <div>
              🟢 Live Workspace
            </div>

            <div>
              ⏱️ {
                formatTime(
                  callDuration
                )
              }
            </div>

            <div>
              👥 {
                onlineUsers.length
              } Active
            </div>
          </motion.div>

          {/* VIDEO */}

          <div
            style={
              styles.videoSection
            }
          >

            <motion.video
              whileHover={{
                scale: 1.02,
              }}
              ref={localVideo}
              autoPlay
              muted
              playsInline
              className="glass"
              style={styles.video}
            />

            <motion.video
              whileHover={{
                scale: 1.02,
              }}
              ref={remoteVideo}
              autoPlay
              playsInline
              className="glass"
              style={styles.video}
            />
          </div>

          {/* CONTROLS */}

          <div style={styles.controls}>

            <button
              className="modern-btn"
              style={
                styles.controlBtn
              }
            >
              <Video size={18} />
            </button>

            <button
              className="modern-btn"
              style={
                styles.controlBtn
              }
            >
              {muted ? (
                <MicOff size={18} />
              ) : (
                <Mic size={18} />
              )}
            </button>

            <button
              className="modern-btn"
              style={
                styles.controlBtn
              }
            >
              <Monitor size={18} />
            </button>

            <button
              className="modern-btn"
              style={{
                ...styles.controlBtn,
                background:
                  "#ef4444",
              }}
            >
              <PhoneOff
                size={18}
              />
            </button>

            <button
              className="modern-btn"
              style={{
                ...styles.controlBtn,
                background:
                  "#8b5cf6",
              }}
            >
              <LayoutDashboard
                size={18}
              />
            </button>
          </div>

          {/* CHAT */}

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="glass"
            style={
              styles.chatContainer
            }
          >

            <div
              style={
                styles.messagesContainer
              }
            >

              {messages.map(
                (
                  msg,
                  index
                ) => (

                  <MessageBubble
                    key={index}
                    msg={msg}
                    currentUser={
                      username
                    }
                  />
                )
              )}

              <div
                ref={
                  messagesEndRef
                }
              />
            </div>

            {typingUser && (

              <p
                style={{
                  color:
                    "#94a3b8",
                  marginBottom:
                    "12px",
                }}
              >
                {typingUser}
              </p>
            )}

            {/* INPUT */}

            <div
              style={
                styles.inputSection
              }
            >

              <input
                className="modern-input"
                type="text"
                placeholder="Enter room..."
                value={room}
                onChange={(e) =>
                  setRoom(
                    e.target.value
                  )
                }
                style={
                  styles.input
                }
              />

              <button
                onClick={
                  joinRoom
                }
                className="modern-btn"
                style={
                  styles.joinBtn
                }
              >
                Join
              </button>
            </div>

            <div
              style={
                styles.inputSection
              }
            >

              <input
                className="modern-input"
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => {

                  setMessage(
                    e.target.value
                  );

                  socket.emit(
                    "typing",

                    {
                      room,
                      username,
                    }
                  );
                }}
                style={
                  styles.input
                }
              />

              <input
                type="file"
                onChange={(e) =>
                  setSelectedFile(
                    e.target.files[0]
                  )
                }
                style={{
                  color:
                    "#fff",
                }}
              />

              <button
                onClick={
                  uploadFile
                }
                className="modern-btn"
                style={
                  styles.uploadBtn
                }
              >
                <Upload
                  size={18}
                />
              </button>

              <button
                onClick={
                  sendMessage
                }
                className="modern-btn"
                style={
                  styles.sendBtn
                }
              >
                <Send
                  size={18}
                />
              </button>
            </div>
          </motion.div>

          {/* WHITEBOARD */}

          <Whiteboard room={room} />

        </div>
      </div>

      <audio
        ref={remoteAudio}
        autoPlay
      />
    </div>
  );
};

/*
|--------------------------------------------------------------------------
| STYLES
|--------------------------------------------------------------------------
*/

const styles = {

  page: {

    display: "flex",

    height: "100vh",

    width: "100vw",

    background:
      "linear-gradient(135deg,#020617,#071021,#0f172a)",

    color: "#fff",

    overflow: "hidden",
  },

  layout: {

    display:
      "flex",

    gap:
      "20px",
  },

  sidebar: {

    width: "260px",

    padding: "24px",

    display: "flex",

    flexDirection: "column",

    justifyContent: "space-between",

    background:
      "rgba(255,255,255,0.04)",

    backdropFilter: "blur(16px)",

    borderRight:
      "1px solid rgba(255,255,255,0.06)",
  },

  logo: {

    fontSize:
      "32px",

    fontWeight:
      "800",

    background:
      "linear-gradient(to right, #8b5cf6, #06b6d4)",

    WebkitBackgroundClip:
      "text",

    WebkitTextFillColor:
      "transparent",
  },

  subtext: {

    marginTop:
      "10px",

    color:
      "#94a3b8",
  },

  roomItem: {

    padding:
      "14px 18px",

    background:
      "rgba(255,255,255,0.04)",

    borderRadius:
      "14px",

    marginBottom:
      "12px",

    cursor:
      "pointer",

    border:
      "1px solid rgba(255,255,255,0.06)",
  },

  userCard: {

    display:
      "flex",

    justifyContent:
      "space-between",

    padding:
      "12px",

    borderRadius:
      "12px",

    background:
      "rgba(255,255,255,0.03)",

    marginBottom:
      "10px",
  },

  main: {

    flex: 1,

    display: "flex",

    flexDirection: "column",

    padding: "20px",

    gap: "20px",

    overflow: "hidden",
  },

  topBar: {

    padding:
      "18px 24px",

    borderRadius:
      "20px",

    marginBottom:
      "20px",

    display:
      "flex",

    justifyContent:
      "space-between",
  },

  videoSection: {

    display: "grid",

    gridTemplateColumns:
      "repeat(2, 1fr)",

    gap: "20px",
  },

  video: {

    width: "100%",

    height: "220px",

    borderRadius: "24px",

    background: "#000",

    objectFit: "cover",

    border:
      "1px solid rgba(139,92,246,0.2)",
  },

  controls: {

    display: "flex",

    gap: "12px",

    marginBottom: "20px",
  },

  controlBtn: {

    width:
      "52px",

    height:
      "52px",

    borderRadius:
      "50%",

    border:
      "none",

    background:
      "#1e293b",

    color:
      "#fff",

    display:
      "flex",

    alignItems:
      "center",

    justifyContent:
      "center",

    cursor:
      "pointer",
  },

  chatContainer: {

    flex: 1,

    display: "flex",

    flexDirection: "column",

    padding: "24px",

    borderRadius: "24px",

    background:
      "rgba(255,255,255,0.04)",

    backdropFilter: "blur(18px)",

    border:
      "1px solid rgba(255,255,255,0.08)",

    overflow: "hidden",
  },

  messagesContainer: {

    flex: 1,

    overflowY:
      "auto",

    marginBottom:
      "20px",
  },

  inputSection: {

    display: "flex",

    gap: "12px",

    alignItems: "center",

    marginTop: "16px",
  },

  input: {

    flex: 1,

    height: "56px",

    borderRadius: "18px",

    border:
      "1px solid rgba(255,255,255,0.08)",

    background:
      "rgba(255,255,255,0.04)",

    padding: "0 20px",

    color: "#fff",

    outline: "none",
  },

  joinBtn: {

    padding:
      "14px 22px",

    borderRadius:
      "14px",

    background:
      "#8b5cf6",

    color:
      "#fff",

    border:
      "none",
  },

  uploadBtn: {

    width:
      "52px",

    borderRadius:
      "14px",

    border:
      "none",

    background:
      "#0ea5e9",

    color:
      "#fff",
  },

  sendBtn: {

    width:
      "52px",

    borderRadius:
      "14px",

    border:
      "none",

    background:
      "#10b981",

    color:
      "#fff",
  },
};

export default Chat;