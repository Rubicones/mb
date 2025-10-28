"use client";

import Header from "../components/Header";
import SkillCard from "@/components/SkillCard";
import TitleScene from "@/components/TitleScene";
import Image from "next/image";
import { useState } from "react";
import HighlightsSection from "@/components/HighlightsSection";

export default function Home() {
    const scrollText =
        "MOTION DESIGNER / 3D DESIGNER / 2D DESIGNER / TRADITIONAL ARTIST / HANDIMAN / ";

    const [activeImage, setActiveImage] = useState<number | null>(null);

    return (
        <div className='w-full h-full flex flex-col items-center bg-white z-20 overflow-hidden'>
            <div className='w-screen h-full flex flex-col items-center bg-white'>
                <Header />
                <div className='w-screen bg-[#C8B936] h-12 text-xl flex items-center overflow-hidden'>
                    <div className='flex animate-scroll-right'>
                        <span className='whitespace-nowrap text-black font-semibold'>
                            {scrollText.repeat(10)}
                        </span>
                        <span className='whitespace-nowrap text-black font-semibold'>
                            {scrollText.repeat(10)}
                        </span>
                    </div>
                </div>
                <TitleScene />
                <div className='w-screen bg-[#C8B936] h-12 text-xl flex items-center overflow-hidden'>
                    <div className='flex animate-scroll-left'>
                        <span className='whitespace-nowrap text-black font-semibold'>
                            {scrollText.repeat(10)}
                        </span>
                        <span className='whitespace-nowrap text-black font-semibold'>
                            {scrollText.repeat(10)}
                        </span>
                    </div>
                </div>
            </div>

            <div className=' relative w-full flex flex-col items-center justify-between md:px-6 bg-neutral-900'>
                <div className='relative w-full max-w-[1600px] flex flex-col items-center px-6 bg-neutral-900'>
                    <span className='text-6xl md:text-8xl text-left font-light self-start text-white mb-8 mt-20 '>
                        WHO I AM
                    </span>
                    <div className='w-full flex justify-between md:flex-row flex-col flex-wrap gap-12'>
                        <div className='uppercase text-4xl lg:text-5xl xl:text-6xl font-extralight text-justify w-full md:w-1/2 '>
                            <span>
                                I&apos;m a{" "}
                                <span className='text-[#C8B936]'>3D</span> and
                                <span className='text-[#C8B936]'>
                                    {" "}
                                    motion designer
                                </span>{" "}
                                with a background in
                                <span className='text-[#C8B936]'>
                                    {" "}
                                    craft
                                </span>{" "}
                                and visual arts, blending form, texture, and
                                movement into expressive,
                                <span className='text-[#C8B936]'>
                                    {" "}
                                    modern design
                                </span>
                                .
                            </span>
                        </div>
                        <div className='w-full md:w-1/3 min-h-[250px] md:min-h-[400px] flex flex-col items-center justify-center relative mr-10 '>
                            <Image
                                src='/whoami1.png'
                                width={200}
                                height={250}
                                className={`absolute top-[5px] md:top-[10px] left-[calc(50%-75px+5px)] md:left-[calc(50%-100px+10px)] rotate-12 transition-all duration-300 cursor-pointer hover:scale-125 hover:z-50 ${
                                    activeImage === 1
                                        ? "scale-125 z-50"
                                        : "z-10"
                                } w-[120px] h-[150px] md:w-[150px] md:h-[187.5px] lg:w-[200px] lg:h-[250px]`}
                                alt=''
                                onClick={() =>
                                    setActiveImage(activeImage === 1 ? null : 1)
                                }
                            />
                            <Image
                                src='/whoami2.png'
                                width={200}
                                height={250}
                                className={`absolute top-[40px] md:top-[70px] left-[calc(50%-75px-40px)] md:left-[calc(50%-100px-70px)] -rotate-10 transition-all duration-300 cursor-pointer hover:scale-125 hover:z-50 ${
                                    activeImage === 2
                                        ? "scale-125 z-50"
                                        : "z-20"
                                } w-[120px] h-[150px] md:w-[150px] md:h-[187.5px] lg:w-[200px] lg:h-[250px]`}
                                alt=''
                                onClick={() =>
                                    setActiveImage(activeImage === 2 ? null : 2)
                                }
                            />
                            <Image
                                src='/whoami3.png'
                                width={200}
                                height={250}
                                className={`absolute top-[80px] md:top-[140px] left-[calc(50%-75px+60px)] md:left-[calc(50%-100px+110px)] rotate-5 transition-all duration-300 cursor-pointer hover:scale-125 hover:z-50 ${
                                    activeImage === 3
                                        ? "scale-125 z-50"
                                        : "z-30"
                                } w-[120px] h-[150px] md:w-[150px] md:h-[187.5px] lg:w-[200px] lg:h-[250px]`}
                                alt=''
                                onClick={() =>
                                    setActiveImage(activeImage === 3 ? null : 3)
                                }
                            />
                        </div>
                    </div>
                    <div className='w-full flex justify-start gap-4 mt-10 text-lg md:text-2xl flex-wrap'>
                        <div className='grow flex gap-1 text-nowrap'>
                            <span className='text-neutral-500 font-light'>
                                Age:
                            </span>
                            <span className='text-white'>22</span>
                        </div>
                        <div className='flex gap-1 text-nowrap'>
                            <span className='text-neutral-500 font-light'>
                                Location:
                            </span>
                            <span className='text-white'>Tel-Aviv</span>
                        </div>
                        <div className='flex gap-1 text-nowrap'>
                            <span className='text-neutral-500 font-light'>
                                Smth:
                            </span>
                            <span className='text-white'>Here</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='relative w-full flex flex-col items-center justify-between md:px-6 bg-neutral-900 pt-20'>
                <div className='relative w-full max-w-[1600px] flex flex-col items-center justify-between px-6 bg-neutral-900'>
                    <span className='text-5xl md:text-8xl text-left font-light self-start text-white mb-8 mt-20 '>
                        WHAT I CAN DO
                    </span>
                    <div className='w-full h-full flex flex-col gap-4 justify-around lg:flex-nowrap flex-wrap mb-32'>
                        <SkillCard title='3D' path='/models/3D_skill_1.glb' />
                        <SkillCard title='2D' path='/models/2D_MODEL_2.glb' />
                        <SkillCard
                            title='handcraft'
                            path='/models/tools3.glb'
                        />
                    </div>
                </div>
            </div>
            <HighlightsSection/>
        </div>
    );
}
