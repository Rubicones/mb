'use client';

import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import LanguagesSection from "@/components/LanguagesSection";

export default function AboutMe() {
    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        const elements = Array.from(
            document.querySelectorAll<HTMLElement>("[data-slide-direction]")
        );

        const updateElements = () => {
            const viewportHeight = window.innerHeight;
            const thresholdStart = viewportHeight;
            const thresholdEnd = viewportHeight * 0.7; // 25% from bottom
            const span = Math.max(thresholdStart - thresholdEnd, 1);
            const baseOffset = window.innerWidth * 0.15; // ~20vw

            elements.forEach((element) => {
                const rect = element.getBoundingClientRect();
                const direction =
                    element.getAttribute("data-slide-direction")?.toLowerCase() ??
                    "left";
                const offset = direction === "right" ? baseOffset : -baseOffset;

                const distance = thresholdStart - rect.top;
                const rawProgress = distance / span;
                const progress = Math.min(Math.max(rawProgress, 0), 1);
                const translate = offset * (1 - progress);

                element.style.transform = `translateX(${translate}px)`;
                element.style.opacity = progress.toString();
                element.style.willChange = "transform, opacity";
                element.style.transformOrigin = "center";
            });
        };

        let frame = 0;
        const requestUpdate = () => {
            if (frame) {
                return;
            }

            frame = window.requestAnimationFrame(() => {
                frame = 0;
                updateElements();
            });
        };

        updateElements();

        window.addEventListener("scroll", requestUpdate, { passive: true });
        window.addEventListener("resize", requestUpdate);

        return () => {
            window.removeEventListener("scroll", requestUpdate);
            window.removeEventListener("resize", requestUpdate);

            if (frame) {
                window.cancelAnimationFrame(frame);
            }

            elements.forEach((element) => {
                element.style.removeProperty("opacity");
                element.style.removeProperty("transform");
                element.style.removeProperty("will-change");
                element.style.removeProperty("transform-origin");
            });
        };
    }, []);

    return (
        <div className='w-full h-full flex flex-col items-center bg-neutral-900 overflow-x-hidden'>
            <div className='w-screen h-full flex flex-col items-center bg-neutral-900 overflow-y-scroll no-scrollbar'>
                <Header />
                <div className='w-full h-full flex flex-col justify-center items-center bg-neutral-900 z-50 mt-16'>
                    <main className='max-w-[1200px] w-full h-full flex flex-col items-start sm:px-4 lg:px-32 pt-8 md:pt-12 pb-16 p-4 z-50 bg-neutral-900'>
                        {/* Hello There Section */}
                        <div className='w-full grid grid-cols-3 grid-rows-2 '>
                            {/* Greeting - Takes 4 columns */}
                            <div className='col-span-2  flex flex-col justify-between p-3 sm:p-6 aspect-2/1' data-slide-direction='left'>
                                <h1 className='text-5xl md:text-7xl lg:text-9xl font-extralight text-white leading-none'>
                                    HELLO
                                    <br />
                                    THERE!
                                </h1>
                            </div>
                            {/* Profile Image - Takes 2 columns */}
                            <div className='aspect-1/2 row-span-2 col-start-3 rounded-3xl overflow-hidden p-1 sm:p-2' data-slide-direction='right'>
                                <div className='relative h-full w-full overflow-hidden rounded-2xl group'>
                                    <img
                                        src='/whoami4.jpg'
                                        alt='Profile'
                                        className='absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
                                    />
                                </div>
                            </div>

                            <div className='aspect-2/1 col-span-2 row-start-2  flex flex-col justify-between p-2' data-slide-direction='left'>
                                <div className='bg-neutral-800 rounded-3xl h-full p-4 sm:p-6'>
                                    <p className='text-white text-xs xs:text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-4xl'>
                                        <span className='hidden sm:inline'>
                                            I&apos;m 23 years old Artist,
                                            Designer, Craftsman and many more.
                                            I&apos;m passionate about my works
                                            and constantly looking for new ways
                                            to express my self in different
                                            fields and conditions.{" "}
                                        </span>

                                        <span className='inline sm:hidden'>
                                            I&apos;m a 23-year-old artist,
                                            designer, and craftsman, passionate
                                            about my work and always exploring
                                            new forms of expression.
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <span className='mb-8 text-4xl md:text-7xl lg:text-9xl font-extralight text-white leading-none mt-20'>
                            EDUCATION
                        </span>
                        {/* Education Section */}
                        <div className='w-full grid grid-cols-3 grid-rows-2'>
                            {/* Stieglitz Academy */}
                            <div className='col-span-2 aspect-2/1 p-1 sm:p-2' data-slide-direction='left'>
                                <div className='bg-[#C8B936] hover:bg-[#BBAD31] transition-all duration-300  rounded-3xl h-full p-3 sm:p-6 border-2 border-[#C8B936] flex flex-col justify-start'>
                                    <h3 className='text-neutral-900 text-lg lg:text-3xl xl:text-4xl font-semibold mb-2'>
                                        Stieglitz Academy
                                    </h3>
                                    <p className='text-gray-800 text-sm lg:text-lg mb-1'>
                                        Bachelor / 2019-2022
                                    </p>
                                    <p className='text-gray-800 text-sm lg:text-lg mt-auto'>
                                        Fine arts / Metal Work / Design
                                    </p>
                                </div>
                            </div>

                            {/* International House */}
                            <div className='row-span-2 col-start-3 aspect-1/2 p-1 sm:p-2 h-full' data-slide-direction='right'>
                                <div className='bg-neutral-800 hover:bg-neutral-700 transition-all duration-300 rounded-3xl h-full p-3 sm:p-6 flex flex-col justify-start'>
                                    <h3 className='text-white text-sm sm:text-lg md:text-xl lg:text-3xl xl:text-4xl font-semibold mb-2'>
                                        International House
                                    </h3>
                                    <p className='text-gray-400 text-sm lg:text-lg mb-1'>
                                        Courses / 2023-2024
                                    </p>
                                    <p className='text-gray-400 text-sm lg:text-lg mt-auto'>
                                        English B2
                                    </p>
                                </div>
                            </div>

                            {/* Masa Program */}
                            <div data-slide-direction='left' className='col-span-2 row-start-2 aspect-2/1 p-1 sm:p-2'>
                                <div className='bg-neutral-800 hover:bg-neutral-700 transition-all duration-300 rounded-3xl h-full p-3 sm:p-6 flex flex-col justify-start'>
                                    <h3 className='text-white text-lg lg:text-3xl xl:text-4xl font-semibold mb-2'>
                                        Masa Program
                                    </h3>
                                    <p className='text-gray-400 text-sm lg:text-lg mb-1'>
                                        Courses / 2024-2025
                                    </p>
                                    <p className='text-gray-400 text-sm lg:text-lg mt-auto'>
                                        Motion Design / Design
                                    </p>
                                </div>
                            </div>
                        </div>
                        <LanguagesSection />

                        <span className='mb-8 text-4xl md:text-7xl lg:text-9xl font-extralight text-white leading-none mt-20'>
                            HOBBY
                        </span>
                        {/* Hobby Section */}
                        <div className='w-full grid grid-cols-3 grid-rows-3'>
                            {/* Row 1: Abstract Image + Music Card */}
                            <div className='col-span-1 aspect-square p-1 sm:p-2' data-slide-direction='left'>
                                <div className='bg-neutral-800 rounded-3xl h-full overflow-hidden group'>
                                    <img
                                        src='/music.png'
                                        alt='Abstract pattern'
                                        className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
                                    />
                                </div>
                            </div>

                            <div className='col-span-2 aspect-2/1 p-1 sm:p-2 ' data-slide-direction='right'>
                                <div className='bg-neutral-800 hover:bg-neutral-700 transition-all duration-300 rounded-3xl h-full p-3 sm:p-6 flex flex-col justify-start relative'>
                                    <h3 className='text-white text-base md:text-xl lg:text-3xl xl:text-4xl font-semibold mb-1'>
                                        MUSIC
                                    </h3>
                                    <p className='text-gray-400 text-xs md:text-sm lg:text-lg mb-1 sm:mb-3'>
                                        Don&apos;t play but listen a lot.
                                    </p>
                                    <p className='text-white text-xs sm:text-sm md:text-base lg:text-xl mb-1 sm:mb-4'>
                                        Alt-J, Radiohead, Michael Kiwanuka,
                                        Herbie Hancock
                                    </p>
                                    <a
                                        href='https://open.spotify.com/user/31b4thyjutygjlpmvdiphc4g65oq?si=23aa5fac46304dce'
                                        className='mt-auto flex items-center gap-2 sm:bg-neutral-700 hover:bg-neutral-600 transition-all duration-300 rounded-full px-4 py-2 w-fit absolute right-2 top-2 sm:static'
                                    >
                                        <Image
                                            width={20}
                                            height={20}
                                            src='/spotifyIcon.png'
                                            alt='Music icon'
                                            className='w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-black text-xs font-bold'
                                        />
                                        <span className='sm:inline hidden text-white text-xs md:text-sm lg:text-base'>
                                            matat&apos;yaho
                                        </span>
                                    </a>
                                </div>
                            </div>

                            {/* Row 2: Videogames Card + Game Cover Image */}
                            <div className='col-span-2 aspect-2/1 p-1 sm:p-2 row-start-2' data-slide-direction='left'>
                                <div className='bg-neutral-800 hover:bg-neutral-700 transition-all duration-300 rounded-3xl h-full p-3 sm:p-6 flex flex-col justify-start'>
                                    <h3 className='text-white text-base md:text-xl lg:text-3xl xl:text-4xl font-semibold mb-1'>
                                        VIDEOGAMES
                                    </h3>
                                    <p className='text-gray-400 text-xs sm:text-sm md:text-lg lg:text-lg mb-1 sm:mb-3'>
                                        One day i hope not only play but create
                                        them.
                                    </p>
                                    <p className='text-white text-xs sm:text-sm md:text-base lg:text-xl mb-1 sm:mb-4 mt-auto'>
                                        Dishonored, Outer Wilds, KCD, Claire
                                        Obscure. Exp 33
                                    </p>
                                </div>
                            </div>

                            <div className='col-span-1 aspect-square p-1 sm:p-2 row-start-2' data-slide-direction='right'>
                                <div className='bg-neutral-800 rounded-3xl h-full overflow-hidden group'>
                                    <img
                                        src='/games.png'
                                        alt='Super Seducer game cover'
                                        className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
                                    />
                                </div>
                            </div>

                            {/* Row 3: Abstract Image + Skateboarding Card */}
                            <div className='col-span-1 aspect-square p-2 row-start-3' data-slide-direction='left'>
                                <div className='bg-neutral-800 rounded-3xl h-full overflow-hidden group'>
                                    <img
                                        src='skateboarding.png'
                                        alt='Abstract pattern'
                                        className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
                                    />
                                </div>
                            </div>

                            <div className='col-span-2 aspect-2/1 p-1 sm:p-2 row-start-3' data-slide-direction='right'>
                                <div className='bg-neutral-800 hover:bg-neutral-700 transition-all duration-300 rounded-3xl h-full p-3 sm:p-6 flex flex-col justify-start'>
                                    <h3 className='text-white text-sm sm:text-lg md:text-xl lg:text-3xl xl:text-4xl font-semibold mb-1'>
                                        SKATEBOARDING
                                    </h3>
                                    <p className='text-gray-400 text-xs sm:text-sm md:text-lg lg:text-lg mb-1 sm:mb-3'>
                                        Unfortunately don&apos;t have a
                                        possibility to do it now
                                    </p>
                                    <p className='text-white text-xs sm:text-sm md:text-base lg:text-xl mb-1 sm:mb-4 mt-auto'>
                                        Kickflip, Shuvit, Ollie, Rock-to-fakie,
                                        50-50
                                    </p>
                                </div>
                            </div>
                        </div>
                        <span className='mb-8 text-4xl md:text-7xl lg:text-9xl font-extralight text-white leading-none mt-20'>
                            WORK EXPERIENCE
                        </span>
                        <div className='w-full grid grid-cols-3 grid-rows-4'>
                            <div className='row-span-2 aspect-1/2 p-1 sm:p-2 ' data-slide-direction='left'>
                                <div className='bg-neutral-800 rounded-3xl h-full overflow-hidden group'>
                                    <img
                                        src='/erra.JPG'
                                        alt='Abstract pattern'
                                        className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
                                    />
                                </div>
                            </div>
                            {/* Row 2: Videogames Card + Game Cover Image */}
                            <div className='col-span-2 aspect-2/1 p-1 sm:p-2' data-slide-direction='right'>
                                <div className='bg-neutral-800 rounded-3xl h-full p-3 sm:p-6 flex flex-col justify-start'>
                                    <h3 className='text-white text-xl sm:text-2xl  md:text-3xl lg:text-4xl xl:text-5xl font-semibold mb-1'>
                                        MOTION DESIGNER
                                    </h3>
                                    <p className='text-gray-400 text-md sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl mb-3'>
                                        ERRA Investments | Israel
                                    </p>
                                    <h3 className='text-white text-lg md:text-2xl lg:text-4xl xl:text-5xl font-semibold mb-1 mt-auto'>
                                        &lt;
                                    </h3>
                                </div>
                            </div>
                            <div className='col-span-2 row-span-2 col-start-2 row-start-2 aspect-square p-1 sm:p-2 ' data-slide-direction='right'>
                                <div className='bg-neutral-800 relative rounded-3xl h-full overflow-hidden group'>
                                    <img
                                        src='/carpenter.png'
                                        alt='Abstract pattern'
                                        className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
                                    />
                                    <div className='absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-transparent flex flex-col items-start justify-start text-left gap-1 p-4'>
                                        <h3 className='text-white text-xl sm:text-2xl  md:text-3xl lg:text-4xl xl:text-5xl font-semibold mb-1'>
                                            Carpenter
                                        </h3>
                                        <p className='text-gray-400 text-md sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl mb-3'>
                                            Svod space | Georgia
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className='row-start-3 aspect-square p-1 sm:p-2' data-slide-direction='left'>
                                <div className='bg-neutral-800 relative rounded-3xl h-full overflow-hidden group'>
                                    <img
                                        src='/insomnia.png'
                                        alt='Abstract pattern'
                                        className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
                                    />
                                    <div className='absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-transparent flex flex-col items-start justify-start text-left gap-1 p-4'>
                                        <span className='text-white text-sm xs:text-lg sm:text-xl md:text-2xl xl:text-3xl font-bold'>
                                            VOLONTEER
                                        </span>
                                        <span className='text-neutral-400 text-sm xs:text-md sm:text-lg md:text-xl'>
                                            Insomnia festival
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {/* Row 2: Videogames Card + Game Cover Image */}
                            <div className='col-span-2 aspect-2/1 row-start-4 p-1 sm:p-2' data-slide-direction='left'>
                                <div className='bg-neutral-800 rounded-3xl h-full p-3 sm:p-6 flex flex-col justify-start'>
                                    <h3 className='text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold mb-1'>
                                        3D DESIGNER
                                    </h3>
                                    <p className='text-gray-400 text-md sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl mb-3'>
                                        Freelance | Georgia
                                    </p>
                                    <h3 className='text-white text-lg md:text-2xl lg:text-4xl xl:text-5xl font-semibold mb-1 mt-auto'>
                                        &gt;
                                    </h3>
                                </div>
                            </div>
                            <div className='col-start-3 row-start-4 aspect-square p-1 sm:p-2' data-slide-direction='right'>
                                <div className='bg-neutral-800 rounded-3xl h-full overflow-hidden group'>
                                    <img
                                        src='/3ddesigner.jpg'
                                        alt='Abstract pattern'
                                        className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
                                    />
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
                <Footer />
            </div>
        </div>
    );
}
