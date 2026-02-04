import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Header from "../components/Header";
import SkillCard from "@/components/SkillCard";
import TitleScene from "@/components/TitleScene";
import HighlightsSection from "@/components/HighlightsSection";
import Footer from "@/components/Footer";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import ScrollingTicker from "@/components/ScrollingTicker";
import WhoamiImages from "@/components/WhoamiImages";

export const metadata: Metadata = {
    title: "Matvei Brumberg - Motion & 3D Designer",
    description:
        "Explore the latest motion design, 3D art, and handcrafted work by Matvei Brumberg, a Tel Aviv-based multidisciplinary designer.",
    alternates: {
        canonical: siteConfig.siteUrl,
    },
    openGraph: {
        title: "Matvei Brumberg — Motion & 3D Designer",
        description:
            "Dive into Matvei Brumberg's portfolio blending motion, 3D, 2D design, and craft artistry.",
    },
    twitter: {
        title: "Matvei Brumberg — Motion & 3D Designer",
        description:
            "Dive into Matvei Brumberg's portfolio blending motion, 3D, 2D design, and craft artistry.",
    },
};

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
                                <span className='text-[#F7DB25]'>3D</span> and
                                <span className='text-[#F7DB25]'>
                                    {" "}
                                    motion designer
                                </span>{" "}
                                with a background in
                                <span className='text-[#F7DB25]'>
                                    {" "}
                                    craft
                                </span>{" "}
                                and visual arts, blending form, texture, and
                                movement into expressive,
                                <span className='text-[#F7DB25]'>
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
                                <ChevronRightIcon className='w-6 h-6' strokeWidth={3} />
                            </Link>
                        </div>
                        <WhoamiImages/>
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
                        className='mt-6 mb-32 md:w-min w-full text-nowrap hover:scale-105 text-2xl md:text-3xl px-10 py-1 rounded-full text-black bg-[#F7DB25] hover:bg-[#BBAD31] transition-all duration-300 font-light flex items-center lg:justify-between justify-center gap-2 cursor-pointer'
                    >
                        <span className='-translate-y-[3px] text-center '>
                            Jump&nbsp;to&nbsp;portfolio
                        </span>
                        <ChevronRightIcon className='w-7 h-7 ml-2 translate-y-px' strokeWidth={2} />
                    </Link>
                    </div>
                </div>
            </div>
            <HighlightsSection />
            <Footer />
        </div>
    );
}
