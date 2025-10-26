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
            <span className='text-8xl text-left font-bold self-start ml-4 text-black mt-8'>
                Skills
            </span>
            <div className='w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4'>
                <SkillCard sceneLink='https://prod.spline.design/Qa3rZwKSwQDohW1E/scene.splinecode' />
                {/* <SkillCard sceneLink='https://prod.spline.design/Qa3rZwKSwQDohW1E/scene.splinecode' />
                <SkillCard sceneLink='https://prod.spline.design/Qa3rZwKSwQDohW1E/scene.splinecode' />
                <SkillCard sceneLink='https://prod.spline.design/Qa3rZwKSwQDohW1E/scene.splinecode' /> */}
                
            </div>
        </div>
    );
}
