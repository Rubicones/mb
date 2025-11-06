"use client";

import { useState } from "react";
import SplineLogo from "./SplineLogo";
import LogoScene from "./LogoScene";
import Link from "next/link";

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            <header className='bg-neutral-900 w-screen h-16 flex justify-center fixed top-0 left-0 z-100'>
                <div className='relative w-full max-w-[1920px] flex items-center justify-between px-4 md:px-6'>
                    <LogoScene />

                    {/* Desktop Navigation */}
                    <div className='hidden md:flex w-full justify-center gap-6 lg:gap-10 uppercase'>
                        <Link
                            href='/about'
                            className='text-lg lg:text-xl hover:text-neutral-400 transition-all z-50'
                        >
                            ABOUT&nbsp;ME
                        </Link>
                        <Link
                            className='text-lg lg:text-xl hover:text-neutral-400 transition-all z-50'
                            href='/portfolio'
                        >
                            PORTFOLIO
                        </Link>
                        <button onClick={() => {
                            if (window.location.pathname === '/') {
                                document.querySelector("#highlights")?.scrollIntoView({
                                    behavior: "smooth",
                                });
                            } else {
                                window.location.href = '/#highlights';
                            }
                        }} className='text-lg lg:text-xl hover:text-neutral-400 transition-all z-50'>
                            HIGHLIGHTS
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className='md:hidden flex flex-col gap-1 p-2 z-50'
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <div
                            className={`w-6 h-0.5 bg-white transition-transform duration-300 ${
                                isMobileMenuOpen
                                    ? "rotate-45 translate-y-2"
                                    : ""
                            }`}
                        ></div>
                        <div
                            className={`w-6 h-0.5 bg-white transition-opacity duration-300 ${
                                isMobileMenuOpen ? "opacity-0" : ""
                            }`}
                        ></div>
                        <div
                            className={`w-6 h-0.5 bg-white transition-transform duration-300 ${
                                isMobileMenuOpen
                                    ? "-rotate-45 -translate-y-2"
                                    : ""
                            }`}
                        ></div>
                    </button>

                    {/* Desktop Contact Button */}
                    <a
                        onClick={() => {
                            document.querySelector("#footer")?.scrollIntoView({
                                behavior: "smooth",
                            });
                        }}
                        className='hidden md:block bg-white text-center text-xl lg:text-2xl font-bold uppercase text-black rounded-3xl px-4 lg:px-6 py-2 transition-all duration-500 hover:bg-neutral-800 hover:text-white'
                    >
                        Contact&nbsp;me
                    </a>
                </div>
            </header>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className='md:hidden bg-neutral-900 w-full border-t border-gray-800 fixed top-16 left-0 z-60'>
                    <div className='flex flex-col py-4 px-4 space-y-4 z-50'>
                        <a
                            className='text-white text-lg uppercase hover:text-neutral-400 transition-all py-2 z-50'
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            ABOUT&nbsp;ME
                        </a>
                        <a
                            className='text-white text-lg uppercase hover:text-neutral-400 transition-all py-2 z-50'
                            href='/portfolio'
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            PORTFOLIO
                        </a>
                        <a
                            className='text-white text-lg uppercase hover:text-neutral-400 transition-all py-2 z-50'
                            onClick={() => {
                                document.querySelector("#highlights")?.scrollIntoView({
                                    behavior: "smooth",
                                });
                                setIsMobileMenuOpen(false);
                            }}
                        >
                            HIGHLIGHTS
                        </a>
                        <a
                            className='z-50 bg-white text-center text-lg font-bold uppercase text-black rounded-3xl px-6 py-3 transition-all duration-500 hover:bg-neutral-800 hover:text-white mt-2'
                            onClick={() => {
                                document
                                    .querySelector("#footer")
                                    ?.scrollIntoView({
                                        behavior: "smooth",
                                    });
                            }}
                        >
                            Contact&nbsp;me
                        </a>
                    </div>
                </div>
            )}
        </>
    );
}
