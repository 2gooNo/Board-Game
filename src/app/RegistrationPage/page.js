"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import style from "./RegistrationPage.module.css";

export default function information() {
  const [names, setNames] = useState();

  const router = useRouter();

  function saveNames() {
    localStorage.setItem("names", [names.Player1, names.Player2]);
    router.push("/Board-game");
  }

  return (
    <div className={style.body}>
      <h1 className={style.enterName}>Enter you'r name</h1>
      <div className="flex gap-[5px]">
        <input
          onChange={(e) =>
            setNames((prev) => ({ ...prev, Player1: e.target.value }))
          }
          className={style.playerName}
          placeholder="Player 1"
        ></input>
        <input
          onChange={(e) =>
            setNames((prev) => ({ ...prev, Player2: e.target.value }))
          }
          className={style.playerName}
          placeholder="Player 2"
        ></input>
      </div>
      <button onClick={() => saveNames()} className={style.play}>Let's play</button>
    </div>
  );
}
