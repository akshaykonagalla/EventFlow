import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  socket,
} from "../services/socket";

const Whiteboard = ({
  room,
}) => {

  const canvasRef =
    useRef(null);

  const contextRef =
    useRef(null);

  const [
    drawing,
    setDrawing,
  ] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | INITIALIZE CANVAS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    const canvas =
      canvasRef.current;

    canvas.width = 900;

    canvas.height = 500;

    const context =
      canvas.getContext("2d");

    context.lineCap =
      "round";

    context.strokeStyle =
      "#ffffff";

    context.lineWidth = 3;

    contextRef.current =
      context;

  }, []);

  /*
  |--------------------------------------------------------------------------
  | SOCKET DRAW EVENT
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    socket.on(
      "draw",

      ({
        offsetX,
        offsetY,
        type,
      }) => {

        const context =
          contextRef.current;

        if (
          type ===
          "begin"
        ) {

          context.beginPath();

          context.moveTo(
            offsetX,
            offsetY
          );

        } else if (
          type ===
          "draw"
        ) {

          context.lineTo(
            offsetX,
            offsetY
          );

          context.stroke();
        }
      }
    );

    /*
    |--------------------------------------------------------------------------
    | CLEAR BOARD
    |--------------------------------------------------------------------------
    */

    socket.on(
      "clear_board",

      () => {

        const canvas =
          canvasRef.current;

        const context =
          contextRef.current;

        context.clearRect(
          0,
          0,
          canvas.width,
          canvas.height
        );
      }
    );

    return () => {

      socket.off("draw");

      socket.off(
        "clear_board"
      );
    };

  }, []);

  /*
  |--------------------------------------------------------------------------
  | START DRAW
  |--------------------------------------------------------------------------
  */

  const startDrawing =
    ({
      nativeEvent,
    }) => {

      const {
        offsetX,
        offsetY,
      } = nativeEvent;

      contextRef.current.beginPath();

      contextRef.current.moveTo(
        offsetX,
        offsetY
      );

      socket.emit(
        "draw",

        {
          room,
          offsetX,
          offsetY,
          type:
            "begin",
        }
      );

      setDrawing(true);
    };

  /*
  |--------------------------------------------------------------------------
  | DRAW
  |--------------------------------------------------------------------------
  */

  const draw =
    ({
      nativeEvent,
    }) => {

      if (!drawing)
        return;

      const {
        offsetX,
        offsetY,
      } = nativeEvent;

      contextRef.current.lineTo(
        offsetX,
        offsetY
      );

      contextRef.current.stroke();

      socket.emit(
        "draw",

        {
          room,
          offsetX,
          offsetY,
          type:
            "draw",
        }
      );
    };

  /*
  |--------------------------------------------------------------------------
  | STOP DRAW
  |--------------------------------------------------------------------------
  */

  const stopDrawing =
    () => {

      contextRef.current.closePath();

      setDrawing(false);
    };

  /*
  |--------------------------------------------------------------------------
  | CLEAR WHITEBOARD
  |--------------------------------------------------------------------------
  */

  const clearBoard =
    () => {

      const canvas =
        canvasRef.current;

      const context =
        contextRef.current;

      context.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      socket.emit(
        "clear_board",

        room
      );
    };

  return (

    <div
      style={{
        marginTop: "20px",
        background:
          "#111827",
        padding: "20px",
        borderRadius:
          "12px",
      }}
    >

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          marginBottom:
            "15px",
        }}
      >

        <h2
          style={{
            color: "#fff",
          }}
        >
          🖍️ Collaborative Whiteboard
        </h2>

        <button
          onClick={
            clearBoard
          }

          style={{
            padding:
              "10px 20px",
            background:
              "#ef4444",
            color:
              "#fff",
            border:
              "none",
            borderRadius:
              "8px",
            cursor:
              "pointer",
          }}
        >
          Clear Board
        </button>
      </div>

      <canvas
        ref={canvasRef}

        onMouseDown={
          startDrawing
        }

        onMouseMove={
          draw
        }

        onMouseUp={
          stopDrawing
        }

        onMouseLeave={
          stopDrawing
        }

        style={{
          border:
            "2px solid #374151",
          borderRadius:
            "12px",
          background:
            "#1f2937",
          cursor:
            "crosshair",
          width: "100%",
        }}
      />
    </div>
  );
};

export default Whiteboard;