import Spline from "@splinetool/react-spline/next";
import Header from "@/components/Header";

export default function Home() {
    const scrollText =
        "MOTION DESIGNER / 3D DESIGNER / 2D DESIGNER / TRADITIONAL ARTIST / HANDIMAN / ";

    return (
        <div className='w-full h-full flex flex-col items-center bg-white'>
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
                <div className='w-full flex justify-start px-4 sm:px-20 md:px-24 lg:px-48'>
                    <Spline
                        scene='https://prod.spline.design/1g59SSL9tQNhDuDw/scene.splinecode'
                        className='h-[calc(100dvh-10rem)]'
                        style={{ height: "calc(100dvh-10rem)" }}
                    />
                </div>
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
        </div>
    );
}
