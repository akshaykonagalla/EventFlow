import React, {
  useState,
} from "react";

import axios from "axios";

const Register = ({
  setShowRegister,
}) => {

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleRegister =
    async () => {

      try {

        await axios.post(
          "http://localhost:5002/api/auth/register",
          {
            username,
            password,
          }
        );

        alert(
          "✅ Registration Successful"
        );

        setShowRegister(false);

      } catch (error) {

        alert(
          "❌ Registration Failed"
        );
      }
    };

  return (

    <div style={styles.container}>

      <div style={styles.card}>

        <h1>📝 Register</h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          style={styles.input}
        />

        <button
          onClick={handleRegister}
          style={styles.button}
        >
          Register
        </button>
      </div>
    </div>
  );
};

const styles = {

  container: {
    background: "#0f172a",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    background: "#111827",
    padding: "40px",
    borderRadius: "12px",
    width: "350px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    color: "#fff",
  },

  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #374151",
    background: "#1f2937",
    color: "#fff",
  },

  button: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#10b981",
    color: "#fff",
    cursor: "pointer",
  },
};

export default Register;