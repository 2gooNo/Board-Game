"use client";

import style from "./HomePage.module.css";
import Link from "next/link";

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

// a miniature of the winding board path, used as the divider
const MINI_TILES = (() => {
  const pts = [];
  for (let s = 0; s <= 300; s++) {
    const t = s / 300;
    pts.push({
      x: 34 + 552 * t,
      y: 46 + 22 * Math.sin(2 * Math.PI * t) * Math.sin(Math.PI * t),
    });
  }

  const count = 15;
  const out = [];
  for (let k = 0; k < count; k++) {
    const i = Math.round((k / (count - 1)) * (pts.length - 2));
    const p0 = pts[i];
    const p1 = pts[i + 1];
    out.push({
      x: p0.x,
      y: p0.y,
      angle: (Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180) / Math.PI,
    });
  }
  return out;
})();

export default function HomePage() {
  return (
    <main className="table-shell">
      <span className={`${style.floater} ${style.f1}`}>🎲</span>
      <span className={`${style.floater} ${style.f2}`}>♟️</span>
      <span className={`${style.floater} ${style.f3}`}>🏁</span>
      <span className={`${style.floater} ${style.f4}`}>🎲</span>

      <div className={`layer ${style.wrap}`}>
        <div className={style.stage}>
          <div className={style.logoHalo}>
            <img src="/logo.png" alt="Board Game" className={style.logo} />
          </div>

          <svg className={style.miniTrack} viewBox="0 0 620 92" aria-hidden="true">
            {MINI_TILES.map((tile, i) => (
              <g
                key={i}
                transform={`translate(${tile.x} ${tile.y}) rotate(${tile.angle})`}
              >
                <rect
                  x={-16}
                  y={-14}
                  width={32}
                  height={28}
                  rx={8}
                  fill={TILE_COLORS[i % TILE_COLORS.length]}
                  stroke="#2b2118"
                  strokeWidth={2}
                />
              </g>
            ))}
          </svg>

          <p className={style.tagline}>
            Хоёр тоглогч шоо шидэн 100 нүд рүү уралдана. Урхинд оровол гурван
            нүд ухарна — эхэлж төгсгөлд хүрсэн нь ялна.
          </p>

          <Link href="/RegistrationPage">
            <button className={`btn-game display ${style.play}`}>
              🎲 Play
            </button>
          </Link>

          <div className={style.chips}>
            <div className={style.chip} style={{ "--accent": "#f5d24c" }}>
              <span className={style.chipIcon}>🏁</span> 100 нүд
            </div>
            <div className={style.chip} style={{ "--accent": "#3a86ff" }}>
              <span className={style.chipIcon}>👥</span> 2 тоглогч
            </div>
            <div className={style.chip} style={{ "--accent": "#ee6c57" }}>
              <span className={style.chipIcon}>⚡</span> 6 нууц урхи
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
