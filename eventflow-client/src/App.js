import React, {
  useState,
} from "react";

import Chat from "./pages/Chat";

import Login from "./pages/Login";

import Register from "./pages/Register";

import Dashboard
from "./pages/Dashboard";

import { socket }
from "./services/socket";

/*
|--------------------------------------------------------------------------
| TOASTIFY
|--------------------------------------------------------------------------
*/

import {
  ToastContainer,
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

function App() {

  const [isAuth, setIsAuth] =
    useState(
      !!localStorage.getItem("token")
    );

  const [
    showRegister,
    setShowRegister,
  ] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | DASHBOARD VIEW
  |--------------------------------------------------------------------------
  */

  const [
    showDashboard,
    setShowDashboard,
  ] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | LOGOUT
  |--------------------------------------------------------------------------
  */

  const logout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "username"
    );

    localStorage.removeItem(
      "room"
    );

    socket.disconnect();

    setIsAuth(false);
  };

  /*
  |--------------------------------------------------------------------------
  | AUTH SCREENS
  |--------------------------------------------------------------------------
  */

  if (!isAuth) {

    return (

      <>
        <ToastContainer />

        {showRegister ? (

          <Register
            setShowRegister={
              setShowRegister
            }
          />

        ) : (

          <div>

            <Login
              setIsAuth={
                setIsAuth
              }
            />

            <div
              style={{
                textAlign:
                  "center",

                marginTop:
                  "-100px",
              }}
            >

              <button
                onClick={() =>
                  setShowRegister(
                    true
                  )
                }
                style={{
                  padding:
                    "10px 20px",

                  border:
                    "none",

                  borderRadius:
                    "8px",

                  background:
                    "#10b981",

                  color:
                    "#fff",

                  cursor:
                    "pointer",
                }}
              >
                Create Account
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | DASHBOARD SCREEN
  |--------------------------------------------------------------------------
  */

  if (showDashboard) {

    return (

      <>
        <ToastContainer />

        <button
          onClick={() =>
            setShowDashboard(
              false
            )
          }
          style={{
            position:
              "absolute",

            top: 20,

            left: 20,

            padding:
              "10px 20px",

            border:
              "none",

            borderRadius:
              "8px",

            background:
              "#3b82f6",

            color:
              "#fff",

            cursor:
              "pointer",

            zIndex: 1000,
          }}
        >
          Back To Chat
        </button>

        <Dashboard />
      </>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | MAIN APP
  |--------------------------------------------------------------------------
  */

  return (

    <>
      <ToastContainer />

      <div>

        {/* LOGOUT */}

        <button
          onClick={logout}
          style={{
            position:
              "absolute",

            top: 20,

            right: 20,

            padding:
              "10px 20px",

            border:
              "none",

            borderRadius:
              "8px",

            background:
              "#ef4444",

            color:
              "#fff",

            cursor:
              "pointer",

            zIndex: 1000,
          }}
        >
          Logout
        </button>

        {/* DASHBOARD */}

        <button
          onClick={() =>
            setShowDashboard(
              true
            )
          }
          style={{
            position:
              "absolute",

            top: 20,

            right: 140,

            padding:
              "10px 20px",

            border:
              "none",

            borderRadius:
              "8px",

            background:
              "#8b5cf6",

            color:
              "#fff",

            cursor:
              "pointer",

            zIndex: 1000,
          }}
        >
          📊 Dashboard
        </button>

        {/* CHAT */}

        <Chat />
      </div>
    </>
  );
}

export default App;