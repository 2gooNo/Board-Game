"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";


export default function information() {
    const [names,setNames] = useState()

    const router = useRouter();

    function saveNames(){
        localStorage.setItem("names",[names.Player1,names.Player2])
        router.push("/Board-game")
    }

    return(
        <div className="flex gap-[10px] flex-col justify-center items-center">
            <div>
                <h1>Please enter you're name</h1>
            </div>
            <div className="flex gap-[5px]">
                <input             onChange={(e) =>
              setNames((prev) => ({ ...prev, Player1: e.target.value }))
            } className="border-[1px] border-black border-solid rounded-[5px]" placeholder="Player 1"></input>
                <input  onChange={(e) =>
              setNames((prev) => ({ ...prev, Player2: e.target.value }))
            } className="border-[1px] border-black border-solid rounded-[5px]" placeholder="Player 2"></input>
            </div>
            <button onClick={() => saveNames()} className="active:bg-slate-400 border-[1px] border-black border-solid rounded-[5px]">Let's play</button>
        </div>
    )
}
