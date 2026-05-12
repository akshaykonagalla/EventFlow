import React from "react";

const MessageBubble = ({
  msg,
  currentUser,
}) => {

  const isOwnMessage =
    msg.author === currentUser;

  return (

    <div
      style={{
        textAlign:
          isOwnMessage
            ? "right"
            : "left",

        marginBottom:
          "15px",
      }}
    >

      <div
        style={{
          display:
            "inline-block",

          background:
            isOwnMessage
              ? "#2563eb"
              : "#374151",

          padding:
            "10px",

          borderRadius:
            "10px",

          color:
            "#fff",

          maxWidth:
            "300px",
        }}
      >

        <strong>
          {msg.author}
        </strong>

        <br />

        {msg.message && (

          <p>
            {msg.message}
          </p>
        )}

        {msg.file && (

          <img
            src={msg.file}

            alt="upload"

            style={{
              width:
                "100%",

              borderRadius:
                "8px",

              marginTop:
                "10px",
            }}
          />
        )}

        <small>
          {msg.time}
        </small>
      </div>
    </div>
  );
};

export default MessageBubble;