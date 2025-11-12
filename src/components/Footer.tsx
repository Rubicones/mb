"use client";

import { SendIcon, SquareArrowOutUpRightIcon } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Footer() {
    const [time, setTime] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const gmt2Time = new Date().toLocaleTimeString("en-US", {
                timeZone: "Europe/Helsinki", // GMT+2 timezone
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
            });
            setTime(gmt2Time);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);
    return (
        <>
            <footer
                className='bg-neutral-900 w-screen flex justify-center mt-20'
                id='footer'
            >
                <div className='relative w-full max-w-[1920px] rounded-t-3xl bg-white p-8 flex-col'>
                    <span className='text-3xl lg:text-4xl xl:text-5xl font-light text-black w-[70%]'>
                        DO YOU HAVE A PROJECT FOR ME?
                    </span>
                    <a
                        href='https://wa.me/+9720552691841'
                        target='_blank'
                        className='mt-6 md:w-min w-full text-nowrap hover text-2xl md:text-3xl px-10 py-1 rounded-full text-black bg-[#C8B936] hover:bg-[#BBAD31] transition-all duration-300 font-light flex items-center justify-between gap-2 cursor-pointer'
                    >
                        <span className='-translate-y-[2px] w-full text-center '>
                            Get&nbsp;in&nbsp;touch
                        </span>
                        {/* <SendIcon className='w-7 h-7 ml-2' />{" "} */}
                    </a>
                    <div className='w-full flex justify-between md:justify-start  gap-4 md:gap-8 lg:gap-20 md:flex-nowrap flex-wrap'>
                        <div className='flex flex-col mt-8'>
                            <span className='text-3xl lg:text-4xl xl:text-5xl font-light text-neutral-400'>
                                CONTACTS
                            </span>
                            <a
                                href='https://t.me/mativich'
                                className='text-2xl md:text-3xl hover:text-[#C8B936] text-black font-light transition-all mt-4'
                            >
                                Telegram
                            </a>
                            <a
                                href='mailto:mgbtumbedg@gmail.com'
                                className='text-2xl md:text-3xl hover:text-[#C8B936] text-black font-light transition-all'
                            >
                                Email
                            </a>
                            <a
                                href='https://wa.me/+9720552691841'
                                className='text-2xl md:text-3xl hover:text-[#C8B936] text-black font-light transition-all'
                            >
                                WhatsApp
                            </a>
                        </div>
                        <div className='flex flex-col mt-8'>
                            <span className='text-3xl lg:text-4xl xl:text-5xl font-light text-neutral-400'>
                                SOCIALS
                            </span>
                            <a
                                href='https://il.linkedin.com/in/matvei-brumberg-593b8b290'
                                className='text-2xl md:text-3xl hover:text-[#C8B936] text-black font-light transition-all mt-4'
                            >
                                LinkedIn
                            </a>
                            <a
                                href='https://www.artstation.com/batvey'
                                className='text-2xl md:text-3xl hover:text-[#C8B936] text-black font-light transition-all'
                            >
                                ArtStation
                            </a>
                            <a
                                href='https://www.instagram.com/mgbtumbedg'
                                className='text-2xl md:text-3xl hover:text-[#C8B936] text-black font-light transition-all'
                            >
                                Instagram
                            </a>
                            <a
                                href='https://www.facebook.com/share/1AQ3a6JhPy/?mibextid=wwXIfr'
                                className='text-2xl md:text-3xl     hover:text-[#C8B936] text-black font-light transition-all'
                            >
                                Facebook
                            </a>
                        </div>
                        <div className='flex flex-col mt-8 md:ml-auto'>
                            <span className='text-3xl lg:text-4xl xl:text-5xl font-light text-neutral-400'>
                                NAVIGATION
                            </span>
                            <Link
                                href='/'
                                className='text-2xl md:text-3xl hover:text-[#C8B936] text-black font-light transition-all mt-4'
                            >
                                Home
                            </Link>
                            <Link
                                href='/about'
                                className='text-2xl md:text-3xl hover:text-[#C8B936] text-black font-light transition-all'
                            >
                                About Me
                            </Link>
                            <Link
                                href='/portfolio'
                                className='text-2xl md:text-3xl hover:text-[#C8B936] text-black font-light transition-all'
                            >
                                Portfolio
                            </Link>
                        </div>
                    </div>
                    <div className='mt-12 flex md:flex-row flex-col gap-4 md:gap-0 md:items-center justify-start md:justify-between'>
                        <span className='text-5xl text-black font-extrabold -tracking-[12px]'>
                            MB
                        </span>
                        <span className='text-base lg:text-lg text-neutral-400 font-light'>
                            Local time (GMT+2) {time}
                        </span>
                        <a
                            href='https://t.me/Rubicon1543'
                            className='text-2xl text-nowrap px-10 py-1 rounded-full   text-white bg-black hover:bg-neutral-700 transition-all duration-300 font-light flex items-center justify-center cursor-pointer'
                        >
                            <span className='-translate-y-0.5'>
                                Developed by:{" "}
                                <span className='font-medium pl-1'>
                                    rubicon
                                </span>
                            </span>
                            <SquareArrowOutUpRightIcon className='w-5 h-5 ml-2' />
                        </a>
                    </div>
                </div>
            </footer>
        </>
    );
}
