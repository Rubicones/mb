"use client";

import { useRef, useState, useEffect } from "react";
import SkillsSceneMobile from "./SkillsSceneMobile";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

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
            imgPaths: [
                "/blender.png",
                "/cinema4D.png",
                "/Substance3Dpainter.png",
            ],
        },
        "2D": {
            title: "2D DESIGNER",
            description:
                "My education was closely related to 2D design, but later I significantly advanced and expanded my skills in this field.",
            tags: "design creation / animation / special effects",
            imgPaths: [
                "/photoshop.png",
                "/PremierePro.png",
                "/After.png",
                "/Illustrator.png",
            ],
        },
        handcraft: {
            title: "HANDIMAN",
            description:
                "Despite my current focus on digital media, I've always been drawn to tangible, three-dimensional forms of self-expression. I believe that my experience with different materials and techniques has made me a more multifaceted artist and broadened my creative perspective.",
            tags: "blacksmith / woodwork / construction",
            imgPaths: [],
        },
    };
    //blender, cinema4d, substance
    useEffect(() => {
        const updateSize = () => {
            const width = window.innerWidth;
            if (width >= 1024) {
                // lg breakpoint
                setCanvasSize(450);
            } else if (width >= 768) {
                // md breakpoint
                setCanvasSize(370);
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
            className={`bg-neutral-800 border-2 border-[#C8B936] grow relative w-full h-full md:min-h-[200px] gap-6 md:mx-2 p-5 md:p-8 flex flex-col md:flex-row justify-start items-center md:justify-between md:items-start rounded-4xl transition-all duration-300 group`}
        >
            <div className=' md:w-[250px] lg:w-auto w-auto  flex justify-center items-center'>
                <SkillsSceneMobile
                    hoverContainerRef={skillsRef}
                    size={canvasSize}
                    path={path}
                />
            </div>
            <div className={`w-full flex flex-col justify-between gap-4`}>
                <h3
                    className={`text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extralight text-white capitalize break-normal`}
                >
                    {skillsData[title as keyof typeof skillsData].title}
                </h3>

                <p className='text-xl lg:text-2xl xl:text-3xl text-white mt-0 sm:mt-4'>
                    {skillsData[title as keyof typeof skillsData].description}
                </p>
                <div className='text-md md:text-lg lg:text-xl xl:text-2xl text-neutral-500 font-light md:w-fit w-full text-left mx-2'>
                    {skillsData[title as keyof typeof skillsData].tags}
                </div>
                <div className='w-full h-full flex md:min-h-[180px] grow text-black text-2xl flex-col justify-end lg:justify-between gap-2 uppercase font-bold items-start lg:items-end mt-auto lg:flex-row flex-wrap'>
                    <div className='flex gap-4 items-center mt-4 flex-wrap'>
                        {skillsData[
                            title as keyof typeof skillsData
                        ].imgPaths.map((imgPath: string, i: number) => (
                            <Image
                                width={55}
                                height={55}
                                src={imgPath}
                                alt={imgPath}
                                key={i}
                            />
                        ))}
                    </div>
                    <div className='flex items-center justify-end gap-2 text-white text-sm md:text-lg lg:text-2xl text-right'>
                        <span>Jump to portfolio</span>
                        <ArrowRight className='w-6 h-6' />
                    </div>
                </div>
            </div>
        </a>
    );
}
