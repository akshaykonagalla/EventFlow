import { io } from "socket.io-client";

/*
|--------------------------------------------------------------------------
| SOCKET INSTANCE
|--------------------------------------------------------------------------
*/

export const socket = io(
  "http://localhost:5002",
  {
    autoConnect: false,
  }
);

/*
|--------------------------------------------------------------------------
| CONNECT SOCKET
|--------------------------------------------------------------------------
*/

export const connectSocket = () => {

  const token =
    localStorage.getItem("token");

  socket.auth = {
    token,
  };

  socket.connect();
};