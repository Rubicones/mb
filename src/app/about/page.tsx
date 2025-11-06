import Header from "@/components/Header";

export default async function AboutMe() {
    return (
        <div className='w-full h-full flex flex-col items-center bg-black overflow-x-hidden'>
            <div className='w-screen h-full flex flex-col items-center bg-black'>
                <Header />
                <div className='w-full flex flex-col justify-center items-center bg-black z-50'>
                    <main className='max-w-[1100px] w-full flex flex-col items-start px-4 md:px-6 pt-8 md:pt-12 pb-16 z-50 h-[calc(100dvh-64px)] bg-black overflow-y-scroll no-scrollbar'>
                        {/* Hello There Section */}
                        <div className='w-full grid grid-cols-3 grid-rows-2 '>
                            {/* Greeting - Takes 4 columns */}
                            <div className='col-span-2  flex flex-col justify-between p-6 aspect-2/1'>
                                <h1 className='text-4xl md:text-7xl lg:text-9xl font-extralight text-white leading-none'>
                                    HELLO
                                    <br />
                                    THERE!
                                </h1>
                            </div>
                            {/* Profile Image - Takes 2 columns */}
                            <div className='aspect-1/2 row-span-2 col-start-3 rounded-3xl overflow-hidden p-2'>
                                <img
                                    src='/whoami4.jpg'
                                    alt='Profile'
                                    className='w-full h-full object-cover rounded-2xl'
                                />
                            </div>

                            <div className='aspect-2/1 col-span-2 row-start-2  flex flex-col justify-between p-2'>
                                <div className='bg-neutral-900 rounded-3xl h-full p-6'>
                                    <p className='text-white text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-4xl'>
                                        I&apos;m 23 years old Artist, Designer,
                                        Craftsman and many more. I&apos;m
                                        passionate about my works and constantly
                                        looking for new ways to express my self
                                        in different fields and conditions.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <span className='text-4xl md:text-7xl lg:text-9xl font-extralight text-white leading-none mt-20'>
                            EDUCATION
                        </span>
                        {/* Education Section */}
                        <div className='w-full grid grid-cols-3 grid-rows-2'>
                            {/* Stieglitz Academy */}
                            <div className='col-span-2 aspect-2/1 p-2'>
                                <div className='bg-neutral-900 rounded-3xl h-full p-6 border-2 border-[#C8B936] flex flex-col justify-start'>
                                    <h3 className='text-white text-base md:text-xl lg:text-3xl xl:text-4xl font-semibold mb-2'>
                                        Stieglitz Academy
                                    </h3>
                                    <p className='text-gray-400 text-xs md:text-sm lg:text-lg mb-1'>
                                        Bachelor / 2019-2022
                                    </p>
                                    <p className='text-gray-400 text-xs md:text-sm lg:text-lg mt-auto'>
                                        Fine arts / Metal Work / Design
                                    </p>
                                </div>
                            </div>

                            {/* International House */}
                            <div className='row-span-2 col-start-3 aspect-1/2 p-2 h-full'>
                                <div className='bg-neutral-900 rounded-3xl h-full p-6 flex flex-col justify-start'>
                                    <h3 className='text-white text-base md:text-xl lg:text-3xl xl:text-4xl font-semibold mb-2'>
                                        International House
                                    </h3>
                                    <p className='text-gray-400 text-xs md:text-sm lg:text-lg mb-1'>
                                        Courses / 2023-2024
                                    </p>
                                    <p className='text-gray-400 text-xs md:text-sm lg:text-lg mt-auto'>
                                        English B2
                                    </p>
                                </div>
                            </div>

                            {/* Empty space top right */}
                            <div className='col-span-1'></div>

                            {/* Masa Program */}
                            <div className='col-span-2 row-start-2 aspect-2/1 p-2'>
                                <div className='bg-neutral-900 rounded-3xl h-full p-6 flex flex-col justify-start'>
                                    <h3 className='text-white text-base md:text-xl lg:text-3xl xl:text-4xl font-semibold mb-2'>
                                        Masa Program
                                    </h3>
                                    <p className='text-gray-400 text-xs md:text-sm lg:text-lg mb-1'>
                                        Courses / 2024-2025
                                    </p>
                                    <p className='text-gray-400 text-xs md:text-sm lg:text-lg mt-auto'>
                                        Motion Design / Design
                                    </p>
                                </div>
                            </div>
                        </div>

                        <span className='text-4xl md:text-7xl lg:text-9xl font-extralight text-white leading-none mt-20'>
                            HOBBY
                        </span>
                        {/* Hobby Section */}
                        <div className='w-full grid grid-cols-3 grid-rows-3'>
                            {/* Row 1: Abstract Image + Music Card */}
                            <div className='col-span-1 aspect-square p-2'>
                                <div className='bg-neutral-900 rounded-3xl h-full overflow-hidden'>
                                    <img
                                        src='/abstract-pattern.jpg'
                                        alt='Abstract pattern'
                                        className='w-full h-full object-cover'
                                    />
                                </div>
                            </div>

                            <div className='col-span-2 aspect-2/1 p-2'>
                                <div className='bg-neutral-900 rounded-3xl h-full p-6 flex flex-col justify-start'>
                                    <h3 className='text-white text-base md:text-xl lg:text-3xl xl:text-4xl font-semibold mb-1'>
                                        MUSIC
                                    </h3>
                                    <p className='text-gray-400 text-xs md:text-sm lg:text-lg mb-3'>
                                        Don&apos;t play but listen a lot.
                                    </p>
                                    <p className='text-white text-sm md:text-base lg:text-xl mb-4'>
                                        Alt-J, Radiohead, Michael Kiwanuka, Herbie Hancock
                                    </p>
                                    <div className='mt-auto flex items-center gap-2 bg-neutral-800 rounded-full px-4 py-2 w-fit'>
                                        <div className='w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-black text-xs font-bold'>
                                            ♪
                                        </div>
                                        <span className='text-white text-xs md:text-sm lg:text-base'>matit&apos;yaho</span>
                                    </div>
                                </div>
                            </div>

                            {/* Row 2: Videogames Card + Game Cover Image */}
                            <div className='col-span-2 aspect-2/1 p-2 row-start-2'>
                                <div className='bg-neutral-900 rounded-3xl h-full p-6 flex flex-col justify-start'>
                                    <h3 className='text-white text-base md:text-xl lg:text-3xl xl:text-4xl font-semibold mb-1'>
                                        VIDEOGAMES
                                    </h3>
                                    <p className='text-gray-400 text-xs md:text-sm lg:text-lg mb-3'>
                                        One day i hope not only play but create them.
                                    </p>
                                    <p className='text-white text-sm md:text-base lg:text-xl mt-auto'>
                                        Dishonored, Outer Wilds, KCD, Claire Obscure. Exp 33
                                    </p>
                                </div>
                            </div>

                            <div className='col-span-1 aspect-square p-2 row-start-2'>
                                <div className='bg-neutral-900 rounded-3xl h-full overflow-hidden'>
                                    <img
                                        src='/game-cover.jpg'
                                        alt='Super Seducer game cover'
                                        className='w-full h-full object-cover'
                                    />
                                </div>
                            </div>

                            {/* Row 3: Abstract Image + Skateboarding Card */}
                            <div className='col-span-1 aspect-square p-2 row-start-3'>
                                <div className='bg-neutral-900 rounded-3xl h-full overflow-hidden'>
                                    <img
                                        src='/abstract-pattern.jpg'
                                        alt='Abstract pattern'
                                        className='w-full h-full object-cover'
                                    />
                                </div>
                            </div>

                            <div className='col-span-2 aspect-2/1 p-2 row-start-3'>
                                <div className='bg-neutral-900 rounded-3xl h-full p-6 flex flex-col justify-start'>
                                    <h3 className='text-white text-base md:text-xl lg:text-3xl xl:text-4xl font-semibold mb-1'>
                                        SKATEBOARDING
                                    </h3>
                                    <p className='text-gray-400 text-xs md:text-sm lg:text-lg mb-3'>
                                        Unfortunately don&apos;t have a possibility to do it now
                                    </p>
                                    <p className='text-white text-sm md:text-base lg:text-xl mt-auto'>
                                        Kickflip, Shuvit, Ollie, Rock-to-fakie, 50-50
                                    </p>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
