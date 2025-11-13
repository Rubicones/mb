import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { GallerySkeleton } from "@/components/Gallery";

export default function Loading() {
    return (
        <div className='min-h-screen bg-neutral-900 overflow-x-hidden'>
            <main className='w-screen h-full flex justify-center bg-neutral-900'>
                <div className='w-full max-w-[1600px] flex flex-col items-center justify-between bg-neutral-900 px-6'>
                    <Header />

                    <div className='w-full flex flex-col gap-10 mt-6 px-4'>
                        <div className='flex flex-col gap-6 animate-pulse'>
                            <div className='flex flex-wrap gap-4 text-neutral-700'>
                                <div className='h-6 w-36 rounded bg-neutral-800/80' />
                            </div>

                            <div className='flex flex-col gap-4'>
                                <div className='h-20 w-full md:w-2/3 rounded bg-neutral-800/80' />
                                <div className='hidden md:block h-20 w-1/2 rounded bg-neutral-800/60' />
                            </div>

                            <div className='flex flex-wrap gap-10 text-black'>
                                <div className='flex flex-col gap-2'>
                                    <div className='h-5 w-24 rounded bg-neutral-800/80' />
                                    <div className='h-6 w-28 rounded bg-neutral-700/80' />
                                </div>
                                <div className='flex gap-10'>
                                    <div className='flex flex-col gap-2'>
                                        <div className='h-5 w-20 rounded bg-neutral-800/80' />
                                        <div className='h-6 w-28 rounded bg-neutral-700/80' />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <div className='h-5 w-20 rounded bg-neutral-800/80' />
                                        <div className='h-6 w-28 rounded bg-neutral-700/80' />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='w-full flex flex-col md:flex-row justify-between gap-10 animate-pulse'>
                            <div className='w-full md:w-1/2 flex flex-col gap-4'>
                                <div className='h-6 w-32 rounded bg-neutral-800/80' />
                                <div className='w-full aspect-video rounded-2xl bg-neutral-800/80' />
                            </div>
                            <div className='w-full md:w-1/2 flex flex-col gap-4'>
                                <div className='h-6 w-36 rounded bg-neutral-800/80' />
                                <div className='h-32 w-full rounded bg-neutral-800/60' />
                            </div>
                        </div>

                        <GallerySkeleton />

                        <div className='w-full mt-10 mb-8 animate-pulse'>
                            <div className='grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6'>
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className='h-80 md:h-96 rounded-xl bg-neutral-800/80'
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </main>
        </div>
    );
}

