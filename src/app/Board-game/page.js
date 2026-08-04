"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import "./BoardGame.css";

/* ---------------- board geometry ---------------- */

const VIEW_W = 1120;
const VIEW_H = 810;

const ROWS = 5;
const X_START = 150;
const X_END = 970;
const Y_START = 105;
const ROW_GAP = 158;
const TURN_R = ROW_GAP / 2;
const WAVE = 34;

// dense centreline of the winding track
function buildCentreline() {
  const pts = [];

  for (let row = 0; row < ROWS; row++) {
    const dir = row % 2 === 0 ? 1 : -1;
    const y = Y_START + row * ROW_GAP;
    const from = dir === 1 ? X_START : X_END;
    const to = dir === 1 ? X_END : X_START;

    // wavy straight-away — the sin(pi*t) factor keeps both ends flat
    const steps = 140;
    for (let s = row === 0 ? 0 : 1; s <= steps; s++) {
      const t = s / steps;
      pts.push({
        x: from + (to - from) * t,
        y: y + WAVE * Math.sin(2 * Math.PI * t) * Math.sin(Math.PI * t),
      });
    }

    // half-circle U-turn into the next row
    if (row < ROWS - 1) {
      const cy = y + TURN_R;
      const turnSteps = 70;
      for (let s = 1; s <= turnSteps; s++) {
        const a = -Math.PI / 2 + (Math.PI * s) / turnSteps;
        pts.push({
          x: to + dir * TURN_R * Math.cos(a),
          y: cy + TURN_R * Math.sin(a),
        });
      }
    }
  }

  return pts;
}

// walk the centreline and drop `count` evenly spaced tiles with their tilt
function spaceAlong(pts, count) {
  const cum = [0];
  for (let i = 1; i < pts.length; i++) {
    cum.push(
      cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y)
    );
  }
  const total = cum[cum.length - 1];

  const out = [];
  let j = 0;
  for (let k = 0; k < count; k++) {
    const target = (total * k) / (count - 1);
    while (j < cum.length - 2 && cum[j + 1] < target) j++;

    const p0 = pts[j];
    const p1 = pts[j + 1];
    const seg = cum[j + 1] - cum[j] || 1;
    const f = (target - cum[j]) / seg;

    out.push({
      x: p0.x + (p1.x - p0.x) * f,
      y: p0.y + (p1.y - p0.y) * f,
      angle: (Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180) / Math.PI,
    });
  }
  return out;
}

const TILE_COLORS = [
  "#b79ce0",
  "#9ed36a",
  "#f2a64c",
  "#f4afc2",
  "#ee6c57",
  "#3fae84",
  "#a9dceb",
  "#f5d24c",
];

const TILE_W = 46;
const TILE_H = 40;

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

  const { trackPath, tiles } = useMemo(() => {
    const centre = buildCentreline();
    return {
      trackPath: centre.map((p, i) => `${i ? "L" : "M"}${p.x} ${p.y}`).join(" "),
      tiles: spaceAlong(centre, 100),
    };
  }, []);

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
      ? { name: playerOneName, label: "Player 1" }
      : playerTwoPosition >= 100
      ? { name: playerTwoName, label: "Player 2" }
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

  const sameCell = playerOnePosition === playerTwoPosition;
  const pawnSpots = [
    { pos: playerOnePosition, color: "#e4572e", name: playerOneName, side: -1 },
    { pos: playerTwoPosition, color: "#3a86ff", name: playerTwoName, side: 1 },
  ];

  const startTile = tiles[0];
  const endTile = tiles[tiles.length - 1];

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
            <svg
              className="board-svg"
              viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
              role="img"
              aria-label="Тоглоомын зам"
            >
              <defs>
                <filter id="tileShadow" x="-40%" y="-40%" width="180%" height="180%">
                  <feDropShadow
                    dx="0"
                    dy="3"
                    stdDeviation="3"
                    floodColor="#000"
                    floodOpacity="0.45"
                  />
                </filter>
                <filter id="pawnShadow" x="-60%" y="-60%" width="220%" height="220%">
                  <feDropShadow
                    dx="0"
                    dy="4"
                    stdDeviation="4"
                    floodColor="#000"
                    floodOpacity="0.6"
                  />
                </filter>
              </defs>

              {/* the road under the tiles */}
              <path className="track-shadow" d={trackPath} />
              <path className="track-line" d={trackPath} />

              {/* START / FINISH markers */}
              <g className="marker">
                <rect
                  x={startTile.x - 145}
                  y={startTile.y - 27}
                  width={116}
                  height={54}
                  rx={16}
                  fill="#ee6c57"
                />
                <text x={startTile.x - 87} y={startTile.y + 1}>
                  START
                </text>
              </g>
              <g className="marker">
                <rect
                  x={endTile.x + 32}
                  y={endTile.y - 27}
                  width={124}
                  height={54}
                  rx={16}
                  fill="#f2a64c"
                />
                <text x={endTile.x + 94} y={endTile.y + 1}>
                  FINISH
                </text>
              </g>

              {/* the 100 tiles */}
              {tiles.map((tile, index) => {
                const isTrap = effectiveCell.includes(index);
                const isFinish = index === 99;
                const fill = isTrap
                  ? "#c1121f"
                  : isFinish
                  ? "#f6e3a6"
                  : TILE_COLORS[index % TILE_COLORS.length];

                return (
                  <g key={index} className="tile">
                    <g transform={`translate(${tile.x} ${tile.y}) rotate(${tile.angle})`}>
                      <rect
                        x={-TILE_W / 2}
                        y={-TILE_H / 2}
                        width={TILE_W}
                        height={TILE_H}
                        rx={11}
                        fill={fill}
                        filter="url(#tileShadow)"
                      />
                    </g>
                    <text
                      x={tile.x}
                      y={tile.y + 1}
                      className={isTrap ? "tile-num on-dark" : "tile-num"}
                    >
                      {index + 1}
                    </text>
                  </g>
                );
              })}

              {/* pawns */}
              {pawnSpots.map((p) => {
                const tile = tiles[Math.min(p.pos, 99)];
                const rad = (tile.angle * Math.PI) / 180;
                const off = sameCell ? 13 : 0;
                const cx = tile.x - Math.sin(rad) * off * p.side;
                const cy = tile.y + Math.cos(rad) * off * p.side;

                return (
                  <g
                    key={p.color}
                    className="board-pawn"
                    transform={`translate(${cx} ${cy})`}
                  >
                    <title>{p.name}</title>
                    <circle
                      r={sameCell ? 12 : 16}
                      fill={p.color}
                      stroke="#fff"
                      strokeWidth={3.5}
                      filter="url(#pawnShadow)"
                    />
                    <circle
                      cx={-4}
                      cy={-5}
                      r={sameCell ? 3.5 : 4.5}
                      fill="rgba(255,255,255,0.55)"
                    />
                  </g>
                );
              })}
            </svg>
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
                    style={{ width: `${Math.min(playerOnePosition, 100)}%` }}
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
                    style={{ width: `${Math.min(playerTwoPosition, 100)}%` }}
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
                <span className="legend-swatch round" style={{ "--sw": "#e4572e" }} />
                {playerOneName}
              </div>
              <div className="legend-row">
                <span className="legend-swatch round" style={{ "--sw": "#3a86ff" }} />
                {playerTwoName}
              </div>
              <div className="legend-row">
                <span className="legend-swatch" style={{ "--sw": "#c1121f" }} />
                Улаан нүд — урхи, 3 нүд ухрана
              </div>
              <div className="legend-row">
                <span className="legend-swatch" style={{ "--sw": "#f6e3a6" }} />
                🏁 100 дахь нүд — төгсгөл
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
