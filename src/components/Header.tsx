"use client";

import { useState } from "react";

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            <header className='bg-black w-screen h-14 md:h-16 flex justify-center'>
                <div className='w-full max-w-[1920px] flex items-center justify-between px-4 md:px-6'>
                    <span className='text-2xl md:text-4xl font-bold'>MB</span>
                    
                    {/* Desktop Navigation */}
                    <div className='hidden md:flex w-full justify-center gap-6 lg:gap-10 uppercase'>
                        <a className='text-lg lg:text-xl hover:text-neutral-400 transition-all'>
                            ABOUT&nbsp;ME
                        </a>
                        <a
                            className='text-lg lg:text-xl hover:text-neutral-400 transition-all'
                            href='/portfolio'
                        >
                            PORTFOLIO
                        </a>
                        <a className='text-lg lg:text-xl hover:text-neutral-400 transition-all'>
                            HIGHLIGHTS
                        </a>
                    </div>
                    
                    {/* Mobile Menu Button */}
                    <button 
                        className='md:hidden flex flex-col gap-1 p-2'
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <div className={`w-6 h-0.5 bg-white transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
                        <div className={`w-6 h-0.5 bg-white transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
                        <div className={`w-6 h-0.5 bg-white transition-transform duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
                    </button>
                    
                    {/* Desktop Contact Button */}
                    <button className='hidden md:block bg-white text-center text-xl lg:text-2xl font-bold uppercase text-black rounded-3xl px-4 lg:px-6 py-2 transition-all duration-500 hover:bg-neutral-800 hover:text-white'>
                        Contact&nbsp;me
                    </button>
                </div>
            </header>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className='md:hidden bg-black w-full border-t border-gray-800'>
                    <div className='flex flex-col py-4 px-4 space-y-4'>
                        <a 
                            className='text-white text-lg uppercase hover:text-neutral-400 transition-all py-2'
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            ABOUT&nbsp;ME
                        </a>
                        <a 
                            className='text-white text-lg uppercase hover:text-neutral-400 transition-all py-2'
                            href='/portfolio'
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            PORTFOLIO
                        </a>
                        <a 
                            className='text-white text-lg uppercase hover:text-neutral-400 transition-all py-2'
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            HIGHLIGHTS
                        </a>
                        <button 
                            className='bg-white text-center text-lg font-bold uppercase text-black rounded-3xl px-6 py-3 transition-all duration-500 hover:bg-neutral-800 hover:text-white mt-2'
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Contact&nbsp;me
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
