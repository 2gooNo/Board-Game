"use client";

import React, { useState, useEffect, useRef } from "react";
import "./BoardGame.css";

export default function BoardGame() {
  const [playerTwoPosition, setPlayerTwoPosition] = useState(0);
  const [playerOnePosition, setPlayerOnePosition] = useState(0);
  const [playerTwoName, setPlayerTwoName] = useState();
  const [playerOneName, setPlayerOneName] = useState();
  const [effectiveCell, setEffectiveCell] = useState([]);
  // 1
  const [turn, setTurn] = useState({ player: true, loading: false });
  const [diceNumber, setDiceNumber] = useState(1);

  function effectSell() {
    const effectiveCellArray = [];
    for (let i = 0; i <=5; i++) {
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

  function RandomNumber() {
    return Math.floor(Math.random() * 6) + 1;
  }

  function PlayersRoll() {
    const randomNumber = RandomNumber();
    if (turn.loading === true) {
      return;
    }
    setTurn({ ...turn, loading: true });

    setDiceNumber(randomNumber);
    moverForward(randomNumber);
  }

  const moverForward = (step) => {
    let temp = 0;

    const forwardInterval = setInterval(() => {
      if (temp === step) {
        setTurn({ player: !turn.player, loading: false });
        return clearInterval(forwardInterval);
      }

      temp++;

      if (turn.player == true) {
        setPlayerOnePosition((prev) => prev + 1);
      } else {
        setPlayerTwoPosition((prev) => prev + 1);
      }
    }, 600);
  };
  const moverBackward = (step, whichPlayer) => {
    let temp = 0;

    const backwardInterval = setInterval(() => {
      if (temp === step) {
        setTurn({ ...turn, loading: false });
        return clearInterval(backwardInterval);
      }

      temp++;

      if (whichPlayer === "one") {
        setPlayerOnePosition((prev) => (prev - 1 < 0 ? 0 : prev - 1));
      } else {
        setPlayerTwoPosition((prev) => (prev - 1 < 0 ? 0 : prev - 1));
      }
    }, 300);
  };

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
  useEffect(() => {
    if (!turn.loading) {
      effectiveCell.map((number) => {
        if (number == playerOnePosition) {
          setTurn({ ...turn, loading: true });
          moverBackward(3, "one");
        }
        if (number == playerTwoPosition) {
          setTurn({ ...turn, loading: true });
          moverBackward(3, "two");
        }
      });
    }
  }, [turn]);

  return (
    <div className="body">
      <div className="absolute top-[100px] left-[100px] flex flex-col">
        <div className="gap-[10px] flex flex-row items-center ">
          <div className="tutorial"></div>
          <h1 className="tutorial-text">Both Players</h1>
        </div>
        <div className="gap-[10px] flex flex-row items-center ">
          <div
            style={{ backgroundColor: "#c67d51" }}
            className="tutorial"
          ></div>
          <h1 className="tutorial-text">{playerOneName}</h1>
        </div>
        <div className="gap-[10px] flex flex-row items-center ">
          <div
            style={{ backgroundColor: "#a7715d" }}
            className="tutorial"
          ></div>
          <h1 className="tutorial-text">{playerTwoName}</h1>
        </div>
        <div className="gap-[10px] flex flex-row items-center ">
          <div
            style={{ backgroundColor: "#C9582F" }}
            className="tutorial"
          ></div>
          <h1 className="tutorial-text">Fall 3 times</h1>
        </div>
      </div>
      <div className="w-auto flex flex-col  h-screen  pl-[100px]">
        <div className="h-screen justify-center justify-center items-center flex flex-col gap-[10px]">
          <div className="board">
            <div className="board-row">
              {new Array(100).fill("").map((_, index) => (
                <div
                  className="board-cell"
                  style={{
                    backgroundColor: CellColor(
                      index,
                      effectiveCell,
                      playerOnePosition,
                      playerTwoPosition
                    ),
                  }}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          </div>

          <button className="roll-button" onClick={PlayersRoll}>
            Roll Dice
          </button>
          <div className="dice">
            {Array.from({ length: 6 }, (_, i) => (
              <div
                className="side"
                style={{
                  backgroundColor: i + 1 === diceNumber ? "#9F9149" : "#d1c6a9",
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
function CellColor(index, effectiveCell, playerOnePosition, playerTwoPosition) {
  if (index == playerOnePosition && index == playerTwoPosition) {
    return "#4B1A08";
    // dwhtsal
  } else if (index == playerOnePosition) {
    return "#c67d51";
    //player1
  } else if (index == playerTwoPosition) {
    return "#a7715d";
    //player2
  } else if (effectiveCell.includes(index)) {
    return "#C9582F";
  }
}
