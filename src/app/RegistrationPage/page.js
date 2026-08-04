"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import style from "./RegistrationPage.module.css";

export default function Information() {
  const [names, setNames] = useState({ Player1: "", Player2: "" });

  const router = useRouter();

  const ready = names.Player1.trim() !== "" && names.Player2.trim() !== "";

  function saveNames() {
    if (!ready) return;
    localStorage.setItem("names", [names.Player1.trim(), names.Player2.trim()]);
    router.push("/Board-game");
  }

  return (
    <main className="table-shell">
      <div className={`layer ${style.wrap}`}>
        <div className={`card ${style.card}`}>
          <div className="card-inner-rule" />

          <span className="eyebrow">Тоглогчид</span>
          <h1 className={`display gold-text ${style.title}`}>Нэрээ оруулна уу</h1>
          <div className="rule-orn">✦</div>
          <p className={style.sub}>Хоёулаа нэрээ бичсэний дараа тоглоом эхэлнэ.</p>

          <div className={style.players}>
            <div className={style.playerBox} style={{ "--accent": "var(--p1)" }}>
              <div className={style.playerHead}>
                <span className={style.pawn} />
                <span className={style.playerLabel}>Player 1</span>
              </div>
              <input
                value={names.Player1}
                onChange={(e) =>
                  setNames((prev) => ({ ...prev, Player1: e.target.value }))
                }
                className={style.input}
                placeholder="Жишээ: Бат"
                maxLength={14}
              />
            </div>

            <div className={style.playerBox} style={{ "--accent": "var(--p2)" }}>
              <div className={style.playerHead}>
                <span className={style.pawn} />
                <span className={style.playerLabel}>Player 2</span>
              </div>
              <input
                value={names.Player2}
                onChange={(e) =>
                  setNames((prev) => ({ ...prev, Player2: e.target.value }))
                }
                className={style.input}
                placeholder="Жишээ: Тугсаа"
                maxLength={14}
              />
            </div>
          </div>

          <div className={style.actions}>
            <button
              onClick={saveNames}
              disabled={!ready}
              className={`btn-game display ${style.start}`}
            >
              🎲 Тоглоом эхлэх
            </button>
            <span className={style.hint}>
              {ready ? "Амжилт хүсье!" : "Хоёр тоглогчийн нэрийг бөглөнө үү"}
            </span>
            <Link href="/" className={style.back}>
              ← Нүүр хуудас
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
