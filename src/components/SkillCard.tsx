"use client";

import { useRef, useState, useEffect } from "react";
import SkillsScene from "./SkillsScene";

export default function SkillCard({ title }: { title: string }) {
    const skillsRef = useRef<HTMLDivElement>(null);
    const [canvasSize, setCanvasSize] = useState(300);

    useEffect(() => {
        const updateSize = () => {
            const width = window.innerWidth;
            if (width >= 1024) {
                // lg breakpoint
                setCanvasSize(450);
            } else if (width >= 768) {
                // md breakpoint
                setCanvasSize(350);
            } else {
                // mobile
                setCanvasSize(300);
            }
        };

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    return (
        <div
            ref={skillsRef}
            className={`${title === "3D" ? "bg-red-200/20 hover:bg-red-200/50" : title === "2D" ? "bg-blue-200/20 hover:bg-blue-200/50" : "bg-green-200/20 hover:bg-green-200/50"} grow relative h-full md:min-h-[500px] gap-6 md:mx-2 p-8 flex flex-col md:flex-row justify-start items-center md:justify-between md:items-start rounded-4xl transition-all duration-300 group`}
        >
            <SkillsScene 
                hoverContainerRef={skillsRef} 
                size={canvasSize}
            />
            <div className="w-full h-full flex flex-col gap-4">
                <h3 className={`text-6xl font-bold text-black capitalize`}>{title}</h3>
                <p className="text-sm text-gray-500">Skill Description</p>
            </div>
        </div>
    );
}
