"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import "./BoardGame.css";

const TILE_COLORS = [
  "var(--tile-1)",
  "var(--tile-2)",
  "var(--tile-3)",
  "var(--tile-4)",
  "var(--tile-5)",
];

// classic snake layout: bottom-left is cell 1, every second row runs backwards
const BOARD_ORDER = (() => {
  const order = [];
  for (let row = 9; row >= 0; row--) {
    const cells = Array.from({ length: 10 }, (_, col) => row * 10 + col);
    if (row % 2 === 1) cells.reverse();
    order.push(...cells);
  }
  return order;
})();

const DICE_PIPS = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

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
    for (let i = 0; i <= 5; i++) {
      const randomNumber = Math.floor(Math.random() * 100) + 1;
      effectiveCellArray.push(randomNumber);
    }
    setEffectiveCell(effectiveCellArray);
  }

  useEffect(() => {
    const rawPlayerNames = localStorage.getItem("names");
    const namesArray = (rawPlayerNames || "Player 1,Player 2").split(",");
    setPlayerOneName(namesArray[0] || "Player 1");
    setPlayerTwoName(namesArray[1] || "Player 2");
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

  const winner =
    playerOnePosition >= 100
      ? { name: playerOneName, label: "Player 1", color: "var(--p1)" }
      : playerTwoPosition >= 100
      ? { name: playerTwoName, label: "Player 2", color: "var(--p2)" }
      : null;

  if (winner) {
    return (
      <main className="table-shell">
        <div className="layer win-wrap">
          <div className="card win-card">
            <div className="card-inner-rule" />
            <span className="trophy">🏆</span>
            <span className="eyebrow">{winner.label} ялалт байгууллаа</span>
            <h1 className="display gold-text win-title">{winner.name} ялсан!</h1>
            <div className="rule-orn">✦</div>
            <p className="win-sub">
              100 нүдийг эхэлж туулж, ширээний эзэн боллоо. Дахин тоглох уу?
            </p>
            <div className="win-actions">
              <button
                onClick={() => location.reload()}
                className="btn-game display"
              >
                🎲 Дахин тоглох
              </button>
              <Link href="/">
                <button className="btn-game display">🏠 Нүүр хуудас</button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const activeColor = turn.player ? "var(--p1)" : "var(--p2)";
  const activeName = turn.player ? playerOneName : playerTwoName;

  return (
    <main className="table-shell">
      <div className="layer game-page">
        <header className="game-head">
          <div className="brand">
            <img src="/logo.png" alt="Board Game" />
            <span className="brand-sub">Race to 100</span>
          </div>

          <div className="turn-badge" style={{ "--accent": activeColor }}>
            <span className="turn-dot" />
            <span className="turn-text">
              {turn.loading ? (
                <>Хөдөлж байна…</>
              ) : (
                <>
                  Ээлж: <b>{activeName}</b>
                </>
              )}
            </span>
          </div>
        </header>

        <div className="game-grid">
          <section className="board-frame">
            <div className="board">
              {BOARD_ORDER.map((index) => {
                const isP1 = index === playerOnePosition;
                const isP2 = index === playerTwoPosition;
                const isTrap = effectiveCell.includes(index);
                const isFinish = index === 99;
                const hasPawn = isP1 || isP2;

                return (
                  <div
                    key={index}
                    className={`board-cell${isTrap ? " trap" : ""}${
                      isFinish ? " finish" : ""
                    }`}
                    style={{ "--tile": TILE_COLORS[index % TILE_COLORS.length] }}
                  >
                    {index + 1}

                    {!hasPawn && isTrap && <span className="cell-mark">⚡</span>}
                    {!hasPawn && isFinish && <span className="cell-mark">🏁</span>}

                    {hasPawn && (
                      <div className="pawns">
                        {isP1 && (
                          <span
                            className={`pawn${isP2 ? " small" : ""}`}
                            style={{ "--pawn": "var(--p1)" }}
                            title={playerOneName}
                          />
                        )}
                        {isP2 && (
                          <span
                            className={`pawn${isP1 ? " small" : ""}`}
                            style={{ "--pawn": "var(--p2)" }}
                            title={playerTwoName}
                          />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <aside className="sidebar">
            <div className="panel">
              <h2 className="panel-title">Оноо</h2>

              <div
                className={`player-card${turn.player ? " active" : ""}`}
                style={{ "--accent": "var(--p1)" }}
              >
                <div className="player-row">
                  <span className="player-chip" />
                  <span className="player-name">{playerOneName}</span>
                  <span className="player-pos">
                    {Math.min(playerOnePosition + 1, 100)} / 100
                  </span>
                </div>
                <div className="bar">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${Math.min(playerOnePosition, 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div
                className={`player-card${!turn.player ? " active" : ""}`}
                style={{ "--accent": "var(--p2)" }}
              >
                <div className="player-row">
                  <span className="player-chip" />
                  <span className="player-name">{playerTwoName}</span>
                  <span className="player-pos">
                    {Math.min(playerTwoPosition + 1, 100)} / 100
                  </span>
                </div>
                <div className="bar">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${Math.min(playerTwoPosition, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="panel dice-panel">
              <h2 className="panel-title">Шоо</h2>
              <div className={`die${turn.loading ? " rolling" : ""}`}>
                {Array.from({ length: 9 }, (_, i) => (
                  <span
                    key={i}
                    className={`pip${
                      DICE_PIPS[diceNumber].includes(i) ? " on" : ""
                    }`}
                  />
                ))}
              </div>
              <button
                className="btn-game display roll-button"
                onClick={PlayersRoll}
                disabled={turn.loading}
              >
                {turn.loading ? "Хүлээнэ үү…" : "Шоо шидэх"}
              </button>
              <span className="roll-note">
                Сүүлд буусан тоо: <b>{diceNumber}</b>
              </span>
            </div>

            <div className="panel">
              <h2 className="panel-title">Тайлбар</h2>
              <div className="legend-row">
                <span className="legend-swatch" style={{ "--sw": "var(--p1)" }} />
                {playerOneName}
              </div>
              <div className="legend-row">
                <span className="legend-swatch" style={{ "--sw": "var(--p2)" }} />
                {playerTwoName}
              </div>
              <div className="legend-row">
                <span
                  className="legend-swatch"
                  style={{ "--sw": "linear-gradient(160deg, #6d0d16, #c1121f)" }}
                />
                ⚡ Урхи — 3 нүд ухрана
              </div>
              <div className="legend-row">
                <span
                  className="legend-swatch"
                  style={{ "--sw": "linear-gradient(135deg, #f6e3a6, #b08c34)" }}
                />
                🏁 Төгсгөл — 100 дахь нүд
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
