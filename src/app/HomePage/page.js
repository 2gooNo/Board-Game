"use client"

import { useRouter } from "next/navigation"


export default function HomePage() {
    const router = useRouter()
    return(
        <div className="flex flex-col justify-center items-center">
            <div>
                <button onClick={() => router.push("/InformationPage")}>Play</button>
                {/* <button></button> */}
            </div>
        </div>
    )
}
