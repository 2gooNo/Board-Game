"use client";

import React, { useState, useEffect } from "react";
import "./BoardGame.css";

export default function BoardGame() {
  const [playerTwoPosition, setPlayerTwoPosition] = useState(0);
  const [playerOnePosition, setPlayerOnePosition] = useState(0);
  const [playerTwoName, setPlayerTwoName] = useState();
  const [playerOneName, setPlayerOneName] = useState();
  const [effectiveCell, setEffectiveCell] = useState([]);
  const [turn, setTurn] = useState(true);
  const [diceNumber, setDiceNumber] = useState(1);
  const [diceNumber2, setDiceNumber2] = useState(1);

  function effectSell() {
    const effectiveCellArray = [];
    for (let i = 0; i < 5; i++) {
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

  function RandomNumber() {
    return Math.floor(Math.random() * 6) + 1;
  }

  function PlayerOneRoll() {
    const randomNumber = RandomNumber();
    if (turn == true) {
      setPlayerOnePosition((prev) => prev + randomNumber);
    } else {
      setPlayerTwoPosition((prev) => prev + randomNumber);
    }
    setDiceNumber(randomNumber);
    setTurn(!turn);
  }
  // function PlayerTwoRoll() {
  //   const randomNumber = RandomNumber();
  //   setPlayerTwoPosition((prev) => prev + randomNumber);
  //   setDiceNumber2(randomNumber);
  //   setTurn("1");
  // }

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
    effectiveCell.map((number) => {
      if (number == playerOnePosition || number == playerTwoPosition) {
        if (turn == true) {
          setPlayerOnePosition((prev) => prev - 3);
        } else {
          setPlayerTwoPosition((prev) => prev - 3);
        }
      }
    });
  }, [turn]);

  return (
    
    <div className="body">
      <div className="w-auto flex flex-col  h-screen  pl-[100px]">
        <div className="h-screen justify-center justify-center items-center flex flex-col gap-[10px]">
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
        
          <button className="roll-button" onClick={() => PlayerOneRoll()}>
            Roll Dice
          </button>
          <div className="dice">
            {Array.from({ length: 6 }, (_, i) => (
              <div
                className="side"
                style={{
                  backgroundColor:
                    i + 1 === diceNumber ? "#9F9149" : "transparent",
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
