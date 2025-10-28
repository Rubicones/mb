import Header from "../components/Header";
import SkillCard from "@/components/SkillCard";
import TitleScene from "@/components/TitleScene";

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
                <div className='relative w-full max-w-[1600px] flex flex-col items-center justify-between px-6 bg-neutral-900'>
                    <span className='text-8xl text-left font-light self-start text-white mb-8 mt-20 '>
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
        </div>
    );
}
