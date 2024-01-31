"use client";

import { useRouter } from "next/navigation";
import style from "./HomePage.module.css";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();
  return (
    <div>
      <div className={style.body}>
        <img src="logo.png" className={style.logo}></img>
        <div className={style.name}>Board game</div>
        <div className={style.column}>
          <Link href={"/RegistrationPage"}>
            <button className={style.play}>Play</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
