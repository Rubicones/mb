import Link from "next/link";

export default function Footer() {
    return (
        <>
            <footer className='bg-neutral-900 w-screen flex justify-center mt-20' id='footer'>
                <div className='relative w-full max-w-[1920px] rounded-t-3xl bg-white p-8 flex-col'>
                    <span className='text-4xl lg:text-5xl xl:text-6xl font-light text-black w-[70%]'>
                        DO YOU HAVE A PROJECT OR VACANCY FOR ME?
                    </span>
                    <div className='w-full flex justify-start  gap-4 md:gap-8 lg:gap-20 md:flex-row flex-col'>
                        <div className='flex flex-col mt-12'>
                            <span className='text-4xl lg:text-5xl font-light text-neutral-400'>
                                CONTACTS
                            </span>
                            <a
                                href=''
                                className='text-4xl hover:text-[#C8B936] text-black font-light transition-all mt-4'
                            >
                                Telegram
                            </a>
                            <a
                                href=''
                                className='text-4xl hover:text-[#C8B936] text-black font-light transition-all'
                            >
                                Email
                            </a>
                            <a
                                href=''
                                className='text-4xl hover:text-[#C8B936] text-black font-light transition-all'
                            >
                                WhatsApp
                            </a>
                        </div>
                        <div className='flex flex-col mt-12'>
                            <span className='text-4xl lg:text-5xl font-light text-neutral-400'>
                                SOCIALS
                            </span>
                            <a
                                href=''
                                className='text-4xl hover:text-[#C8B936] text-black font-light transition-all mt-4'
                            >
                                LindedIn
                            </a>
                            <a
                                href=''
                                className='text-4xl hover:text-[#C8B936] text-black font-light transition-all'
                            >
                                ArtStation
                            </a>
                            <a
                                href=''
                                className='text-4xl hover:text-[#C8B936] text-black font-light transition-all'
                            >
                                Instagram
                            </a>
                            <a
                                href=''
                                className='text-4xl hover:text-[#C8B936] text-black font-light transition-all'
                            >
                                Facebook
                            </a>
                        </div>
                        <div className='flex flex-col mt-12 md:ml-auto'>
                            <span className='text-4xl lg:text-5xl font-light text-neutral-400'>
                                NAVIGATION
                            </span>
                            <Link
                                href='/'
                                className='text-4xl hover:text-[#C8B936] text-black font-light transition-all mt-4'
                            >
                                Home
                            </Link>
                            <Link
                                href='/about'
                                className='text-4xl hover:text-[#C8B936] text-black font-light transition-all'
                            >
                                About Me
                            </Link>
                            <Link
                                href='/portfolio'
                                className='text-4xl hover:text-[#C8B936] text-black font-light transition-all'
                            >
                                Portfolio
                            </Link>
                            
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
