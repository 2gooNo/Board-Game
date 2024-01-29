"use client";

import React, { useState, useEffect } from "react";
import "./BoardGame.css";

export default function BoardGame() {
  const [playerTwoPosition, setPlayerTwoPosition] = useState(0);
  const [playerOnePosition, setPlayerOnePosition] = useState(0);
  const [playerTwoName, setPlayerTwoName] = useState();
  const [playerOneName, setPlayerOneName] = useState();
  const [effectiveCell, setEffectiveCell] = useState([]);
  const [turn, setTurn] = useState("1");
  const [diceNumber, setDiceNumber] = useState(1);
  const [diceNumber2, setDiceNumber2] = useState(1);

  function effectSell() {
    const effectiveCellArray = [];
    for (let i = 0; i < 10; i++) {
      const randomNumber = Math.floor(Math.random() * 100) + 1;
      effectiveCellArray.push(randomNumber);
    }
    setEffectiveCell(effectiveCellArray);
  }

  useEffect(() => {
    const rawPlayerNames = localStorage.getItem("names");
    const namesArray = rawPlayerNames.split(",");
    setPlayerOneName(namesArray[0]);
    setPlayerTwoName(namesArray[1]);
    effectSell();
  }, []);
  console.log(effectiveCell);

  function PlayerOneRoll() {
    // console.log(turn);
    // if (turn === "2") {
    //   return;
    // }
    const randomNumber = Math.floor(Math.random() * 6) + 1;
    setPlayerOnePosition((prev) => prev + randomNumber);
    setTurn("2");
  }
  function PlayerTwoRoll() {
    // if (turn === "1") {
    //   return;
    // }
    const randomNumber = Math.floor(Math.random() * 6) + 1;
    setPlayerTwoPosition((prev) => prev + randomNumber);
    setTurn("1");
  }

  if (playerTwoPosition == 100 || playerTwoPosition > 100) {
    return (
      <div className="flex flex-col justify-center items-center bg-black">
        <div>
          <h1 className="text-[50px] text-white">Player 2 Won</h1>
        </div>
        <div>
          <button onClick={() => location.reload()}>Replay</button>
        </div>
      </div>
    );
  } else if (playerOnePosition == 100 || playerOnePosition > 100) {
    return (
      <div className="flex flex-col justify-center items-center bg-black">
        <div>
          <h1 className="text-[50px] text-white">Player 1 Won</h1>
        </div>
        <div>
          <button onClick={() => location.reload()}>Replay</button>
        </div>
      </div>
    );
  }

  effectiveCell.map((number) => {
    if (number == playerOnePosition) {
      setPlayerOnePosition(playerOnePosition - 3);
    }
  });

  return (
    <div className="w-screen h-screen bg-black text-white flex flex-row items-center justify-center">
      <div className="border-r-[1px]  w-[50%] h-screen  pl-[100px] ">
        <div className="h-screen justify-center flex flex-col gap-[10px]">
          <h1>{playerOneName}</h1>
          <div className="board">
            <div className="board-row">
              {new Array(100).fill("").map((_, index) => (
                <div
                  className="board-cell"
                  style={{
                    backgroundColor: CellColor(
                      index,
                      effectiveCell,
                      playerOnePosition
                    ),
                    // index === playerOnePosition ? "green" : "transparent",
                  }}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          </div>
          <button
            disabled={turn === "2"}
            className="roll-button"
            onClick={() => PlayerOneRoll()}
          >
            Roll Dice
          </button>
          <div className="dice">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              className="side"
              style={{
                backgroundColor: i + 1 === diceNumber ? "green" : "transparent",
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>
        </div>
      </div>
      <div className="w-[50%] h-screen  pr-[100px] ">
        <div className="items-end h-screen justify-center flex flex-col gap-[10px]">
          <h1>{playerTwoName}</h1>
          <div className="board">
            <div className="board-row">
              {new Array(100).fill("").map((_, index) => (
                <div
                  className="board-cell"
                  style={{
                    backgroundColor:
                      index === playerTwoPosition ? "green" : "transparent",
                  }}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          </div>
          <button
            disabled={turn === "1"}
            className="roll-button"
            onClick={() => PlayerTwoRoll()}
          >
            Roll Dice
          </button>
          <div className="dice">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              className="side"
              style={{
                backgroundColor: i + 1 === diceNumber2 ? "purple" : "transparent",
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}
function CellColor(index, effectiveCell, playerOnePosition) {
  if (index == playerOnePosition) {
    return "green";
  } else if (effectiveCell.includes(index)) {
    return "red";
  }
}
