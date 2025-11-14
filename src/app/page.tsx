"use client";

// import type { Metadata } from "next";
// import { siteConfig } from "@/config/site";
import Header from "../components/Header";
import SkillCard from "@/components/SkillCard";
import TitleScene from "@/components/TitleScene";
import Image from "next/image";
import { useState } from "react";
import HighlightsSection from "@/components/HighlightsSection";
import Footer from "@/components/Footer";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import ScrollingTicker from "@/components/ScrollingTicker";

// export const metadata: Metadata = {
//     title: "Motion & 3D Designer",
//     description:
//         "Explore the latest motion design, 3D art, and handcrafted work by Matvei Brumberg, a Tel Aviv-based multidisciplinary designer.",
//     alternates: {
//         canonical: siteConfig.siteUrl,
//     },
//     openGraph: {
//         title: "Matvei Brumberg — Motion & 3D Designer",
//         description:
//             "Dive into Matvei Brumberg's portfolio blending motion, 3D, 2D design, and craft artistry.",
//     },
//     twitter: {
//         title: "Matvei Brumberg — Motion & 3D Designer",
//         description:
//             "Dive into Matvei Brumberg's portfolio blending motion, 3D, 2D design, and craft artistry.",
//     },
// };

const BIRTHDATE = new Date(2002, 10, 24);

const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
};

export default function Home() {
    const scrollText =
        "MOTION DESIGNER / 3D DESIGNER / 2D DESIGNER / TRADITIONAL ARTIST / HANDIMAN / ";

    const [activeImage, setActiveImage] = useState<number | null>(null);

    return (
        <div className='w-full h-full flex flex-col items-center bg-neutral-900 overflow-hidden'>
            <div className='w-screen h-full flex flex-col items-center bg-white relative'>
                <Header />
                <ScrollingTicker
                    direction='right'
                    text={scrollText}
                    className='mt-16'
                />
                <TitleScene />
                <ScrollingTicker direction='left' text={scrollText} />
            </div>

            <div className=' relative w-full flex flex-col items-center justify-between md:px-6 bg-neutral-900'>
                <div className='relative w-full max-w-[1600px] flex flex-col items-center px-6 bg-neutral-900'>
                    <span className='text-6xl md:text-8xl text-left font-light self-start text-white mb-8 mt-20 '>
                        WHO I AM
                    </span>
                    <div className='w-full flex justify-between md:flex-row flex-col flex-wrap gap-12'>
                        <div className='uppercase text-3xl lg:text-4xl xl:text-5xl font-extralight text-justify flex flex-col gap-8 justify-between w-full md:w-1/2 '>
                            <span className='text-neutral-300'>
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
                            <Link
                                href='/about'
                                className='w-min flex items-center gap-4 cursor-pointer hover:scale-105 bg-white text-center text-xl lg:text-2xl font-bold uppercase text-black rounded-3xl px-4 lg:px-6 py-2 transition-all duration-500 hover:bg-neutral-800 hover:text-white'
                            >
                                More&nbsp;about&nbsp;me
                                <ChevronRightIcon className='w-6 h-6' />
                            </Link>
                        </div>
                        <div className='w-full md:w-1/3 min-h-[250px] md:min-h-[400px] flex flex-col items-center justify-center relative mr-10 '>
                            <Image
                                src='/whoami3.png'
                                width={200}
                                height={250}
                                className={`absolute object-cover rounded-2xl top-[5px] md:top-[10px] left-[calc(50%-75px+5px)] md:left-[calc(50%-100px+10px)] rotate-12 transition-all duration-300 cursor-pointer hover:scale-125 hover:z-50 ${
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
                                className={`absolute object-cover rounded-2xl top-[40px] md:top-[70px] left-[calc(50%-75px-40px)] md:left-[calc(50%-100px-70px)] -rotate-10 transition-all duration-300 cursor-pointer hover:scale-125 hover:z-50 ${
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
                                src='/whoami4.jpg'
                                width={200}
                                height={250}
                                className={`absolute object-cover rounded-2xl top-[80px] md:top-[140px] left-[calc(50%-75px+60px)] md:left-[calc(50%-100px+110px)] rotate-5 transition-all duration-300 cursor-pointer hover:scale-125 hover:z-50 ${
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
                    <div className='w-full flex justify-start gap-4 mt-10 text-lg lg:text-xl flex-wrap'>
                        <div className='grow flex gap-1 text-nowrap'>
                            <span className='text-neutral-500 font-light'>
                                Age:
                            </span>
                            <span className='text-white'>{calculateAge(BIRTHDATE)}</span>
                        </div>
                        <div className='flex gap-1 text-nowrap'>
                            <span className='text-neutral-500 font-light'>
                                Location:
                            </span>
                            <span className='text-white'>Tel-Aviv</span>
                        </div>
                        <div className='flex gap-1 text-nowrap'>
                            <span className='text-neutral-500 font-light'>
                                Status:
                            </span>
                            <span className='text-white'>Open for work</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='relative w-full flex flex-col items-center justify-between md:px-6 bg-neutral-900 pt-20'>
                <div className='relative w-full max-w-[1600px] flex flex-col items-center justify-between px-6 bg-neutral-900'>
                    <span className='text-6xl md:text-8xl text-left font-light self-start text-white mb-8 mt-20 '>
                        WHAT I DO
                    </span>
                    <div className='w-full h-full flex flex-row  gap-4 justify-around lg:flex-nowrap flex-wrap '>
                        <SkillCard title='3D' path='/models/3D_skill_1.glb' />
                        <SkillCard title='2D' path='/models/2D_MODEL_2.glb' />
                        <SkillCard
                            title='handcraft'
                            path='/models/Tool_new.glb'
                        />
                    </div>
                    <div className="w-full flex justify-end px-[6px]">
                    <Link
                        href='/portfolio'
                        target='_blank'
                        className='mt-6 mb-32 md:w-min w-full text-nowrap hover:scale-105 text-2xl md:text-3xl px-10 py-1 rounded-full text-black bg-[#C8B936] hover:bg-[#BBAD31] transition-all duration-300 font-light flex items-center lg:justify-between justify-center gap-2 cursor-pointer'
                    >
                        <span className='-translate-y-[2px] text-center '>
                            Jump&nbsp;to&nbsp;portfolio
                        </span>
                        <ChevronRightIcon className='w-7 h-7 ml-2' />
                    </Link>
                    </div>
                </div>
            </div>
            <HighlightsSection />
            <Footer />
        </div>
    );
}
