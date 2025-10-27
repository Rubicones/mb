"use client";

import { useRef, useState, useEffect } from "react";
import SkillsSceneMobile from "./SkillsSceneMobile";
import { ArrowRight } from "lucide-react";

export default function SkillCard({
    title,
    path,
}: {
    title: string;
    path: string;
}) {
    const skillsRef = useRef<HTMLAnchorElement>(null);
    const [canvasSize, setCanvasSize] = useState(300);

    const skillsData = {
        "3D": {
            title: "3D DESIGNER",
            description:
                "I taught myself 3D design out of pure curiosity and eventually made it my profession.",
            tags: "3D modeling / texturing / animation / render",
        },
        "2D": {
            title: "2D DESIGNER",
            description:
                "My education was closely related to 2D design, but later I significantly advanced and expanded my skills in this field.",
            tags: "design creation / animation / special effects",
        },
        handcraft: {
            title: "HANDIMAN",
            description:
                "Despite my current focus on digital media, I've always been drawn to tangible, three-dimensional forms of self-expression. I believe that my experience with different materials and techniques has made me a more multifaceted artist and broadened my creative perspective.",
            tags: "blacksmith / woodwork / construction",
        },
    };

    useEffect(() => {
        const updateSize = () => {
            const width = window.innerWidth;
            if (width >= 1024) {
                // lg breakpoint
                setCanvasSize(450);
            } else if (width >= 768) {
                // md breakpoint
                setCanvasSize(400);
            } else {
                // mobile
                setCanvasSize(350);
            }
        };

        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    return (
        <a
            href={"/portfolio#" + title}
            ref={skillsRef}
            className={`${
                title === "3D"
                    ? "mouse:bg-red-200/20 touch:bg-red-200/50 hover:bg-red-200/50"
                    : title === "2D"
                    ? "mouse:bg-blue-200/20 touch:bg-blue-200/50 hover:bg-blue-200/50"
                    : "mouse:bg-green-200/20 touch:bg-green-200/50 hover:bg-green-200/50"
            } grow relative w-full h-full md:min-h-[300px] gap-6 md:mx-2 p-8 flex flex-col md:flex-row justify-start items-center md:justify-between md:items-start rounded-4xl transition-all duration-300 group`}
        >
            <SkillsSceneMobile
                hoverContainerRef={skillsRef}
                size={canvasSize}
                path={path}
            />
            <div
                className={`w-full flex flex-col justify-between gap-4`}
                style={{
                    height: canvasSize > 350 ? canvasSize + "px" : "auto",
                }}
            >
                <h3
                    className={`text-6xl lg:text-7xl xl:text-8xl font-bold text-neutral-700 capitalize break-normal`}
                >
                    {skillsData[title as keyof typeof skillsData].title}
                </h3>
                <div className='text-sm md:text-sm lg:text-md xl:text-xl text-white font-light py-1 px-2 rounded-full bg-neutral-500 md:w-fit w-full text-center mx-2'>
                    {skillsData[title as keyof typeof skillsData].tags}
                </div>
                <p className='text-xl lg:text-2xl xl:text-3xl text-neutral-500 mt-4'>
                    {skillsData[title as keyof typeof skillsData].description}
                </p>
                <div className='w-full h-full text-black text-2xl flex justify-end gap-2 uppercase font-bold items-end mt-auto'>
                    Jump to portfolio
                    <ArrowRight className='w-6 h-6' />
                </div>
            </div>
        </a>
    );
}
