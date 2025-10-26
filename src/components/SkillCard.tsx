"use client";

import { useRef } from "react";
import SkillsScene from "./SkillsScene";

export default function SkillCard() {
    const skillsRef = useRef<HTMLDivElement>(null);

    return (
        <div className='grow h-full flex justify-center items-center flex-col gap-4 my-5 px-2'>
            <div 
                ref={skillsRef}
                className='relative w-full mx-2 p-5 flex flex-col justify-between border border-neutral-400 rounded-4xl min-h-[600px] bg-neutral-200 transition-all duration-300 group hover:bg-white hover:border-neutral-300'
            >
                <div className='absolute -top-20 flex justify-center self-center'>
                    <SkillsScene hoverContainerRef={skillsRef}/>
                </div>
            </div>
        </div>
    );
}
