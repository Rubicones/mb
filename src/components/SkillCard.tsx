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

    // Helper function to extract program name from image path
    const getProgramName = (imgPath: string) => {
        const name = imgPath.replace("/", "").replace(".png", "");
        // Add spaces before capital letters and numbers for better readability
        return name
            .replace(/([A-Z])/g, " $1")
            .replace(/([0-9])/g, " $1")
            .trim();
    };
    useEffect(() => {
        const updateSize = () => {
            const width = window.innerWidth;
            if (width >= 1600) {
                setCanvasSize(450);
            } else if (width >= 1280) {
                setCanvasSize(380);
            } else if (width >= 1024) {
                setCanvasSize(350);
            } else if (width >= 768) {
                // lg breakpoint
                setCanvasSize(360);
            } else if (width >= 768) {
                // md breakpoint
                setCanvasSize(330);
            } else {
                // mobile
                setCanvasSize(300);
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
            className={`bg-neutral-800 outline-0  hover:outline-2 outline-[#C8B936] grow relative w-full lg:w-auto  gap-6 md:mx-2 p-5 md:p-8 flex flex-col justify-start items-center rounded-4xl transition-all duration-300 group`}
        >
            <h3
                className={`text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extralight text-white capitalize break-normal`}
            >
                {skillsData[title as keyof typeof skillsData].title}
            </h3>
            <div className=' md:w-[250px] lg:w-auto w-auto  flex justify-center items-center'>
                <SkillsSceneMobile
                    hoverContainerRef={skillsRef}
                    size={
                        window.innerWidth > 1024
                            ? window.innerWidth > 1600
                                ? 1600 / 4
                                : window.innerWidth / 4
                            : window.innerWidth / 2
                    }
                    path={path}
                />
            </div>
            <div className={`w-full flex flex-col justify-between gap-4`}>
                {/* <p className='text-xl lg:text-2xl xl:text-3xl text-white mt-0 sm:mt-4'>
                    {skillsData[title as keyof typeof skillsData].description}
                </p> */}
                <div className='text-md md:text-lg lg:text-xl xl:text-2xl text-neutral-500 font-light md:w-fit w-full text-left mx-2 mt-auto'>
                    {skillsData[title as keyof typeof skillsData].tags}
                </div>
                <div className='w-full h-full flex grow text-black text-2xl flex-col justify-end lg:justify-between gap-2 uppercase font-bold items-start lg:items-end mt-auto lg:flex-row flex-wrap'>
                    <div className='flex gap-4 items-center mt-4 flex-wrap'>
                        {skillsData[
                            title as keyof typeof skillsData
                        ].imgPaths.map((imgPath: string, i: number) => (
                            <div
                                className='skill-icon-wrapper relative'
                                key={i}
                                data-program-name={getProgramName(imgPath)}
                            >
                                <div className='skill-icon-inner rounded-xl p-1 border-2 border-transparent'>
                                    <Image
                                        width={50}
                                        height={50}
                                        src={imgPath}
                                        alt={imgPath}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* <div className='flex items-center justify-end gap-2 text-white text-sm md:text-lg lg:text-2xl text-right'>
                        <span>Jump to portfolio</span>
                        <ArrowRight className='w-6 h-6' />
                    </div> */}
                </div>
            </div>
        </a>
    );
}
