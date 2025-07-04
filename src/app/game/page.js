"server";

import React, { useState, useEffect } from "react";
import "@/app/styles/game.css";
import io from "socket.io-client";

let socket;

export default function GamePage() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState(true); //true = x ; false = o

  useEffect(() => {
    const socketInitializer = async () => {
      await fetch("/api/socket");
      socket = io();

      socket.on("connect", () => {
        console.log("connected");
      });

      socket.on("receive-move", (newBoard, newTurn) => {
        setBoard(newBoard);
        setTurn(newTurn);
      });
    };

    socketInitializer();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const check = (board) => {
    const patterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // แถว -
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // คอลัมน์ |
      [0, 4, 8],
      [2, 4, 6], // แนวทแยง \
    ];
    for (let pattern of patterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        console.log("win");
        return board[a];
      }
    }

    if (board.every((x) => x !== null)) {
      console.log("draw");
      return "draw";
    }

    return null;
  };

  const handleClick = (index) => {
    if (show === null) {
      if (board[index]) return;

      const tmpbox = [...board];
      tmpbox[index] = turn ? "X" : "O";
      setBoard(tmpbox); //client
      const newTurn = !turn;
      setTurn(newTurn);
      if (socket) {
        socket.emit("send-move", tmpbox, newTurn);
      }
    }
  };

  const show = check(board);
  const reset = () => {
    //reset
    setBoard(Array(9).fill(null));
    window.location.replace("/");
  };

  useEffect(() => {
    if (show !== null) {
      document.getElementById("overlay").classList.remove("overlayplay");
      setTimeout(() => {
        document.getElementById("overlay").classList.add("overlayplay");
      }, 1500);
    }
    if (show !== null) {
      document.getElementById("overlay").classList.remove("overlayplay");
    }
    else {
      document.getElementById("overlay").classList.add("overlayplay");
      // setWin(true);
    }
  });

  return (
    <>
      <div className="bg-gray-500 p-[2em] h-[100vh]">
        <div className="pt-10 text-center w-auto text-4xl py-5">TEST GAME</div>
        <div className="flex flex-row justify-around">
          <div>turn : {turn ? <b>X</b> : <b>O</b>}</div>
        </div>
        <div className="b-red-500 w-[100%] h-[80vh] flex flex-col items-center pt-5 p-8">
          <div
            id="overlay"
            className="ttt overlayplay bg-white border w-[250px] h-[250px] flex flex-col items-center justify-center fixed top-60"
          >
            <p>
              {" "}
              {show === "draw" ? "you draw" : show + " is win"}{" "}
            </p>
          </div>
          <div className="bg-white w-75 h-75 grid grid-cols-3 grid-rows-3 p-0 border-3">
            {board.map((b, index) => (
              <div
                id="board"
                key={index}
                className="ttt box flex items-center justify-center text-4xl"
                onClick={() => handleClick(index)}
              >
                {b}
              </div>
            ))}
          </div>
          <div>
            <button
              className="btn_reset border-2 rounded-[23px] m-10 py-5 px-10 bg-green-500 hover:bg-green-700 font-bold"
              onClick={() => reset()}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </>
  );
}