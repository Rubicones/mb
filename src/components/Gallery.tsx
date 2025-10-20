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

    // Use original media array - no duplication needed
    const infiniteMedia = validMedia;

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
            // Simple wraparound logic
            const containerWidth = container.offsetWidth;
            const containerCenter = containerWidth / 2;
            const scrollLeft = container.scrollLeft;
            
            const children = Array.from(container.children) as HTMLElement[];
            
            // Find current centered image
            let currentCenteredIndex = -1;
            children.forEach((child, index) => {
                const childLeft = child.offsetLeft;
                const childWidth = child.offsetWidth;
                const childCenter = childLeft + childWidth / 2;
                const distanceFromCenter = Math.abs(
                    childCenter - (scrollLeft + containerCenter)
                );

                if (distanceFromCenter < childWidth / 2) {
                    currentCenteredIndex = index;
                }
            });

            // Simple wraparound: if at first image and going left, go to last
            // if at last image and going right, go to first
            let targetIndex = currentCenteredIndex;
            if (direction === "left") {
                if (currentCenteredIndex === 0) {
                    targetIndex = children.length - 1; // Go to last image
                } else {
                    targetIndex = currentCenteredIndex - 1;
                }
            } else if (direction === "right") {
                if (currentCenteredIndex === children.length - 1) {
                    targetIndex = 0; // Go to first image
                } else {
                    targetIndex = currentCenteredIndex + 1;
                }
            }

            if (targetIndex !== currentCenteredIndex) {
                const targetChild = children[targetIndex];
                const targetLeft = targetChild.offsetLeft;
                const targetWidth = targetChild.offsetWidth;
                const targetCenter = targetLeft + targetWidth / 2;

                container.scrollTo({
                    left: targetCenter - containerCenter,
                    behavior: "smooth",
                });
            }
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

    // Initialize gallery position - center the first image
    useEffect(() => {
        if (validMedia.length > 0 && scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const containerWidth = container.offsetWidth;
            const containerCenter = containerWidth / 2;

            // Wait for images to load and center the second image (if available)
            const initPosition = () => {
                const children = Array.from(container.children) as HTMLElement[];
                if (children.length === 0) return;

                // Use second image if available, otherwise first image
                const targetChild = children.length > 1 ? children[1] : children[0];
                const targetLeft = targetChild.offsetLeft;
                const targetWidth = targetChild.offsetWidth;
                const targetCenter = targetLeft + targetWidth / 2;

                container.scrollTo({
                    left: targetCenter - containerCenter,
                    behavior: "auto",
                });
            };

            // Try immediately, then retry after a short delay for image loading
            initPosition();
            setTimeout(initPosition, 100);
        }
    }, [validMedia.length]);

    // Handle mobile centering on touch end
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container || validMedia.length === 0) return;

        const handleTouchEnd = () => {
            const children = Array.from(container.children) as HTMLElement[];
            if (children.length === 0) return;
            
            const containerWidth = container.offsetWidth;
            const containerCenter = containerWidth / 2;
            const scrollLeft = container.scrollLeft;
            
            // Find the closest image to center
            let closestIndex = 0;
            let minDistance = Infinity;
            
            children.forEach((child, index) => {
                const childLeft = child.offsetLeft;
                const childWidth = child.offsetWidth;
                const childCenter = childLeft + childWidth / 2;
                const distanceFromCenter = Math.abs(
                    childCenter - (scrollLeft + containerCenter)
                );
                
                if (distanceFromCenter < minDistance) {
                    minDistance = distanceFromCenter;
                    closestIndex = index;
                }
            });
            
            // Center the closest image
            const targetChild = children[closestIndex];
            const targetLeft = targetChild.offsetLeft;
            const targetWidth = targetChild.offsetWidth;
            const targetCenter = targetLeft + targetWidth / 2;
            
            container.scrollTo({
                left: targetCenter - containerCenter,
                behavior: "smooth",
            });
        };

        container.addEventListener("touchend", handleTouchEnd, {
            passive: true,
        });

        return () => {
            container.removeEventListener("touchend", handleTouchEnd);
        };
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
            <div className='w-full mt-16'>
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
                        className='flex overflow-x-auto scrollbar-hide gap-4 px-[50%]'
                        style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                            scrollSnapType: "x mandatory",
                        }}
                    >
                        {infiniteMedia.map((item, index) => (
                            <div
                                key={`${item.id}-${index}`}
                                className='flex-shrink-0 cursor-pointer'
                                style={{
                                    width: "auto",
                                    minWidth: "200px",
                                    scrollSnapAlign: "center",
                                }}
                                onClick={() => openFullscreen(index)}
                            >
                                <div className='relative w-auto h-[400px] md:h-[600px] overflow-hidden rounded-lg hover:opacity-90 transition-opacity'>
                                    <Image
                                        src={item.Image!.url}
                                        alt={
                                            item.Image!.alternativeText ||
                                            item.Comment ||
                                            "Gallery image"
                                        }
                                        width={item.Image!.width || 400}
                                        height={item.Image!.height || 300}
                                        className='h-full w-auto object-cover'
                                        sizes='(max-width: 768px) 200px, 400px'
                                    />
                                </div>
                                {item.Comment && (
                                    <p className='text-lg text-neutral-600 mt-4 font-medium'>
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
