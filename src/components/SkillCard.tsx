"use client";

import { useRef } from "react";
import Spline from "@splinetool/react-spline";
import { Application } from "@splinetool/runtime";

export default function SkillCard({ sceneLink }: { sceneLink: string }) {
    const skillsRef = useRef(null);

    const onLoad = (splineApp: Application) => {
        if (skillsRef.current) {
            (skillsRef.current as HTMLElement).addEventListener(
                "mouseenter",
                () => {
                    splineApp.emitEvent("mouseHover", "Rectangle");
                }
            );
            (skillsRef.current as HTMLElement).addEventListener(
                "mouseleave",
                () => {
                    splineApp.emitEventReverse("mouseHover", "Rectangle");
                }
            );
        }
    };

    return (
        <div
            className='w-full h-full flex justify-center items-center flex-col gap-4 my-5 px-2'
            ref={skillsRef}
        >
            <div className='w-full mx-2 p-5 flex flex-col justify-between border border-neutral-400 rounded-2xl min-h-[600px] bg-neutral-200 transition-all duration-300 group hover:bg-white hover:border-neutral-300'>
                <div className='w-[250px] h-[250px] flex justify-center self-center'>
                    <Spline onLoad={onLoad} scene={sceneLink} />
                </div>
            </div>
        </div>
    );
}
