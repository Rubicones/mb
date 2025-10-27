"use client";

import Header from "../components/Header";
import SplineModel from "../components/SplineModel";
import SkillCard from "@/components/SkillCard";
import SkillsSceneDesktop from "@/components/SkillsSceneDesktop";
import { useState } from "react";
import { div } from "three/tsl";

export default function Home() {
    const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
    const scrollText =
        "MOTION DESIGNER / 3D DESIGNER / 2D DESIGNER / TRADITIONAL ARTIST / HANDIMAN / ";

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
                <SplineModel />
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
            <div className=' relative w-full max-w-[1920px] flex flex-col items-center justify-between px-6'>
                <span className='text-8xl text-left font-bold self-start text-black mb-8 mt-20 '>
                    Skills
                </span>
                <div className='w-full flex flex-col gap-4 justify-around lg:flex-nowrap flex-wrap mb-32'>
                    <SkillCard title='3D' path='/models/3D_skill_1.glb' />
                    <SkillCard title='2D' path='/models/2D_MODEL_2.glb' />
                    <SkillCard title='handcraft' path='/models/tools3.glb' />
                </div>
            </div>
            {/* <div className='md:flex hidden relative w-screen h-[1100px] flex-col items-center justify-between px-6 bg-black'>
                <span className='text-8xl text-left font-extralight self-start text-white mb-8 mt-8 '>
                    WHO AM I?
                </span>
                <div className='relative w-full h-full flex gap-4 justify-around mb-32 mt-8'>
                    <div className='w-[60%] h-full relative'>
                        <div className='absolute top-10 left-0 -rotate-12 aspect-square'>
                            <SkillsSceneDesktop
                                size={600}
                                skillName='3D'
                                hoverFunction={(value) =>
                                    setHoveredSkill(value)
                                }
                                path='/models/2D_MODEL_2.glb'
                            />
                        </div>
                        <div className='absolute bottom-[40%] right-[20%] rotate-20'>
                            <SkillsSceneDesktop
                                size={600}
                                skillName='2D'
                                hoverFunction={(value) =>
                                    setHoveredSkill(value)
                                }
                                path='/models/3D_skill_1.glb'
                            />
                        </div>
                        <div className='absolute bottom-10 left-[25%] -rotate-8'>
                            <SkillsSceneDesktop
                                size={600}
                                skillName='handcraft'
                                hoverFunction={(value) =>
                                    setHoveredSkill(value)
                                }
                                path='/models/tools3.glb'

                            />
                        </div>
                    </div>
                    <div className='w-[40%] h-full relative rounded-2xl bg-neutral-800 border-2 border-neutral-700 p-8 flex justify-center items-center'>
                        {hoveredSkill ? 
                            <div className='w-full h-full flex flex-col'>
                                <span className='text-5xl lg:text-6xl xl:text-7xl font-bold text-neutral-600'>
                                    {(() => {
                                        switch (hoveredSkill) {
                                            case "3D":
                                                return "3D DESIGNER";
                                            case "2D":
                                                return "2D DESIGNER";
                                            case "handcraft":
                                                return "HANDIMAN";
                                        }
                                    })()}
                                </span>
                                <div className='text-2xl text-[#C8B936] w-full mt-2'>
                                    {(() => {
                                        switch (hoveredSkill) {
                                            case "3D":
                                                return "3D modeling / Texturing / Animation / Render";
                                            case "2D":
                                                return "design creation / animation / special effects";
                                            case "handcraft":
                                                return "blacksmith / woodwork / construction";
                                        }
                                    })()}
                                </div>
                                <span className='mt-6 text-xl lg:text-2xl xl:text-3xl font-semibold text-white'>
                                    {(() => {
                                        switch (hoveredSkill) {
                                            case "3D":
                                                return "I taught myself 3D design out of pure curiosity and eventually made it my profession.";
                                            case "2D":
                                                return "My education was closely related to 2D design, but later I significantly advanced and expanded my skills in this field.";
                                            case "handcraft":
                                                return "Despite my current focus on digital media, I've always been drawn to tangible, three-dimensional forms of self-expression. I believe that , my experience with different materials and techniques has made me a more multifaceted artist and broadened my creative perspective";
                                        }
                                    })()}
                                </span>
                            </div>
                         : (
                            <span className='text-5xl font-bold text-neutral-500'>
                                Hover over a skill to see more
                            </span>
                        )}
                    </div>
                </div>
            </div> */}
        </div>
    );
}
