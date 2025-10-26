import Header from "../components/Header";
import SplineModel from "../components/SplineModel";
import SkillCard from "@/components/SkillCard";

export default function Home() {
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
            <div className='relative w-full max-w-[1920px] flex flex-col items-center justify-between px-6'>
                <span className='text-8xl text-left font-bold self-start text-black mb-8 mt-20 '>
                    Skills
                </span>
                <div className='w-full flex flex-col gap-4 justify-around lg:flex-nowrap flex-wrap mb-32'>
                    <SkillCard title="3D" />
                    <SkillCard title="2D" />
                    <SkillCard title="handcraft" />
                </div>
            </div>
        </div>
    );
}
