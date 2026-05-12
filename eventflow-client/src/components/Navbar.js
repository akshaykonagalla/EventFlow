import React from "react";

const Navbar = () => {

  return (

    <div style={styles.navbar}>

      <h2>🚀 EventFlow</h2>

      <p>Real-Time Messaging Platform</p>
    </div>
  );
};

const styles = {

  navbar: {
    background: "#111827",
    color: "#fff",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
  },
};

export default Navbar;