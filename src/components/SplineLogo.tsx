"use client";

import Spline from "@splinetool/react-spline";
import Link from "next/link";
import { useRef } from "react";

export default function SplineLogo() {
    const spline = useRef(null);
    const onLoad = (splineApp: any) => {
        spline.current = splineApp;
        splineApp.emitEvent("mouseHover", "hit_box");

        setTimeout(() => {
            splineApp.emitEventReverse("mouseHover", "hit_box");
        }, 1500);
    };
    return (
        <Link href='/'>
            <Spline
                scene='https://prod.spline.design/PU2XQKzQ6p08SZ8L/scene.splinecode'
                className=' absolute top-[14px] left-0 w-[90px] h-[90px] z-100 canvas-container'
                style={{ width: "100vh", height: "100vh" }}
                onLoad={onLoad}
            />
        </Link>
    );
}
