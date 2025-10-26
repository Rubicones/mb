import Spline from "@splinetool/react-spline";
import Header from "../components/Header";
import SplineModel from "../components/SplineModel";

export default function Home() {
    const scrollText =
        "MOTION DESIGNER / 3D DESIGNER / 2D DESIGNER / TRADITIONAL ARTIST / HANDIMAN / ";

    return (
        <div className='w-full h-full flex flex-col items-center bg-white z-20 overflow-x-hidden'>
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
            <div className='hidden'>
                <span className='text-8xl text-left font-bold self-start ml-4 text-black mt'>
                    Skills
                </span>
                <div className='w-full h-full flex flex-col gap-4 my-5'>
                    <div className='flex justify-between mx-4 border border-neutral-400 rounded-md min-h-[250px] bg-neutral-200 transition-all duration-300 group hover:bg-white hover:border-neutral-300'>
                        <Spline scene='https://prod.spline.design/ongX5LuZDRGzPgrg/scene.splinecode' />
                        <div className='w-[calc[]]'></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
