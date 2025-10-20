"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface StrapiImage {
    id: number;
    url: string;
    alternativeText: string | null;
    name: string;
    width?: number;
    height?: number;
}

interface MediaItem {
    id: number;
    Comment: string;
    Image?: StrapiImage;
}

interface GalleryProps {
    media: MediaItem[];
}

export default function Gallery({ media }: GalleryProps) {
    const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const fullscreenScrollRef = useRef<HTMLDivElement>(null);

    // Filter out items without images
    const validMedia = media.filter((item) => item.Image?.url);

    const scroll = (
        direction: "left" | "right",
        isFullscreen: boolean = false
    ) => {
        const container = isFullscreen
            ? fullscreenScrollRef.current
            : scrollContainerRef.current;
        if (!container) return;

        if (isFullscreen) {
            // For fullscreen, use simple wraparound logic
            const containerWidth = container.offsetWidth;
            const scrollLeft = container.scrollLeft;
            
            // Calculate current image index
            const currentIndex = Math.round(scrollLeft / containerWidth);
            const totalImages = validMedia.length;
            
            let targetIndex;
            if (direction === "left") {
                targetIndex = currentIndex === 0 ? totalImages - 1 : currentIndex - 1;
            } else {
                targetIndex = currentIndex === totalImages - 1 ? 0 : currentIndex + 1;
            }
            
            container.scrollTo({
                left: targetIndex * containerWidth,
                behavior: "smooth",
            });
        } else {
            // For gallery, calculate scroll based on current container width
            const scrollLeft = container.scrollLeft;
            const containerWidth = container.offsetWidth;
            
            let newScrollLeft;
            if (direction === "left") {
                newScrollLeft = scrollLeft - containerWidth;
                // Wrap to end if going past beginning
                if (newScrollLeft < 0) {
                    newScrollLeft = (validMedia.length - 1) * containerWidth;
                }
            } else {
                newScrollLeft = scrollLeft + containerWidth;
                // Wrap to beginning if going past end
                if (newScrollLeft >= validMedia.length * containerWidth) {
                    newScrollLeft = 0;
                }
            }
            
            container.scrollTo({
                left: newScrollLeft,
                behavior: "smooth",
            });
        }
    };

    const openFullscreen = (index: number) => {
        setFullscreenIndex(index);
        // Prevent body scroll when fullscreen is open
        document.body.style.overflow = "hidden";

        // After opening, scroll to the correct image
        setTimeout(() => {
            if (fullscreenScrollRef.current) {
                const scrollAmount =
                    fullscreenScrollRef.current.offsetWidth * index;
                fullscreenScrollRef.current.scrollTo({
                    left: scrollAmount,
                    behavior: "auto",
                });
            }
        }, 50);
    };

    // Initialize gallery position - start with first image focused
    useEffect(() => {
        if (validMedia.length > 0 && scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const containerWidth = container.offsetWidth;
            
            // Start with first image focused (scroll to 0)
            container.scrollTo({
                left: 0,
                behavior: "auto",
            });
        }
    }, [validMedia.length]);

    const closeFullscreen = () => {
        setFullscreenIndex(null);
        document.body.style.overflow = "auto";
    };

    if (validMedia.length === 0) {
        return null;
    }

    return (
        <>
            {/* Gallery Container */}
            <div className='w-full mt-16 mb-16'>
                <h2 className='text-neutral-700 text-3xl font-bold mb-4'>
                    Gallery
                </h2>

                <div className='relative group'>
                    {/* Left Arrow */}
                    <button
                        onClick={() => scroll("left")}
                        className='absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200'
                        aria-label='Previous image'
                    >
                        <ChevronLeft className='w-6 h-6' />
                    </button>

                    {/* Scroll Container */}
                    <div
                        ref={scrollContainerRef}
                        className='flex overflow-x-auto scrollbar-hide gap-4'
                        style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                            scrollSnapType: "x mandatory",
                        }}
                    >
                        {validMedia.map((item, index) => (
                            <div
                                key={item.id}
                                className='flex-shrink-0 cursor-pointer flex flex-col w-[calc(100vw-2rem)] sm:w-[480px]'
                                style={{
                                    height: "350px", // Increased to accommodate caption
                                    scrollSnapAlign: "start",
                                }}
                                onClick={() => openFullscreen(index)}
                            >
                                <div className='relative w-full h-[300px] overflow-hidden rounded-lg hover:opacity-90 transition-opacity bg-gray-100 flex items-center justify-center'>
                                    <Image
                                        src={item.Image!.url}
                                        alt={
                                            item.Image!.alternativeText ||
                                            item.Comment ||
                                            "Gallery image"
                                        }
                                        width={480}
                                        height={300}
                                        className='max-w-full max-h-full object-contain'
                                        sizes='480px'
                                    />
                                </div>
                                {item.Comment && (
                                    <p className='text-lg  text-neutral-600 mt-2 font-medium flex-1 flex justify-center items-start'>
                                        {item.Comment}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Right Arrow */}
                    <button
                        onClick={() => scroll("right")}
                        className='absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200'
                        aria-label='Next image'
                    >
                        <ChevronRight className='w-6 h-6' />
                    </button>
                </div>
            </div>

            {/* Fullscreen Modal */}
            {fullscreenIndex !== null && (
                <div className='fixed inset-0 z-50 flex items-center justify-center' onClick={closeFullscreen}>
                    {/* Backdrop - Blurred */}
                    <div
                        className='absolute inset-0 bg-black/80 backdrop-blur-md'
                        onClick={closeFullscreen}
                    />

                    {/* Close Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            closeFullscreen();
                        }}
                        className='absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full'
                        aria-label='Close fullscreen'
                    >
                        <X className='w-6 h-6' />
                    </button>

                    {/* Left Arrow - Fullscreen */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            scroll("left", true);
                        }}
                        className='absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 text-white p-4 rounded-full'
                        aria-label='Previous image'
                    >
                        <ChevronLeft className='w-8 h-8' />
                    </button>

                    {/* Fullscreen Scroll Container */}
                    <div
                        ref={fullscreenScrollRef}
                        className='relative w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide'
                        style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                        }}
                    >
                        {validMedia.map((item) => (
                            <div
                                key={item.id}
                                className='flex-shrink-0 snap-start snap-always w-full h-full flex flex-col items-center justify-start gap-4 p-16'
                            >
                                <div className='relative max-w-[90vw] max-h-[80vh] w-full h-full'>
                                    <Image
                                        src={item.Image!.url}
                                        alt={
                                            item.Image!.alternativeText ||
                                            item.Comment ||
                                            "Gallery image"
                                        }
                                        fill
                                        className='object-contain'
                                        sizes='90vw'
                                        priority
                                    />
                                </div>
                                {item.Comment && (
                                    <div className="mt-6 text-center">
                                        <p className="text-white text-xl font-medium max-w-2xl">
                                            {item.Comment}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Right Arrow - Fullscreen */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            scroll("right", true);
                        }}
                        className='absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 text-white p-4 rounded-full'
                        aria-label='Next image'
                    >
                        <ChevronRight className='w-8 h-8' />
                    </button>

                    {/* Image Counter */}
                    {fullscreenScrollRef.current && (
                        <div className='absolute bottom-4 left-1/2 -translate-x-1/2 z-50 bg-black/50 text-white px-4 py-2 rounded-full'>
                            {fullscreenIndex + 1} / {validMedia.length}
                        </div>
                    )}
                </div>
            )}

            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </>
    );
}
