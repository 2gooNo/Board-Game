"use client";

import style from "./HomePage.module.css";
import Link from "next/link";

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

          <div className="rule-orn">✦</div>

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
            <div className={style.chip}>
              <span className={style.chipIcon}>🏁</span> 100 нүд
            </div>
            <div className={style.chip}>
              <span className={style.chipIcon}>👥</span> 2 тоглогч
            </div>
            <div className={style.chip}>
              <span className={style.chipIcon}>⚡</span> 6 нууц урхи
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
