"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
    const [currentElementIndex, setCurrentElementIndex] = useState<number>(0);
    const [disableScrollButtons, setDisableScrollButtons] =
        useState<boolean>(false);
    const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>(
        {}
    );
    const markImageLoaded = useCallback((id: number) => {
        setLoadedImages((prev) =>
            prev[id]
                ? prev
                : {
                      ...prev,
                      [id]: true,
                  }
        );
    }, []);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const fullscreenScrollRef = useRef<HTMLDivElement>(null);
    // Filter out items without images
    const validMedia = media.filter((item) => item.Image?.url);

    const scroll = useCallback(
        async (
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
                targetIndex =
                    currentIndex === 0 ? totalImages - 1 : currentIndex - 1;
            } else {
                targetIndex =
                    currentIndex === totalImages - 1 ? 0 : currentIndex + 1;
            }

            container.scrollTo({
                left: targetIndex * containerWidth,
                behavior: "smooth",
            });
            setFullscreenIndex(targetIndex);
        } else {
            setDisableScrollButtons(true);

            // For gallery, find next/prev element that isn't fully visible, starting from current
            const scrollLeft = container.scrollLeft;
            const children = Array.from(container.children) as HTMLElement[];

            // Helper function to check if element is fully visible
            const isFullyVisible = (child: HTMLElement) => {
                // 1) Get the width of the container
                const containerWidth = container.offsetWidth;

                // 2) Get the width of the image
                const imageWidth = child.offsetWidth;

                // 3) Find the left and right indents of the image
                const leftIndent = child.offsetLeft - scrollLeft;
                const rightIndent = containerWidth - (leftIndent + imageWidth);

                // 4) If indent + image's width is greater than the container width – it is not visible fully
                // 5) If any of the indents are negative – it is not visible fully
                const isVisible = leftIndent >= -10 && rightIndent >= -10;

                return isVisible;
            };

            let targetChild;
            let newIndex = currentElementIndex;
            // await new Promise(resolve => setTimeout(resolve, 400));
            if (direction === "left") {
                const firstFullyVisibleIndex = children.findIndex((child) =>
                    isFullyVisible(child)
                );
                if (firstFullyVisibleIndex === -1) {
                    newIndex = children.length - 1;
                    targetChild = children[newIndex];
                } else {
                    // Search backwards from current element
                    for (let i = firstFullyVisibleIndex; i >= 0; i--) {
                        const child = children[i];
                        if (!isFullyVisible(child)) {
                            targetChild = child;
                            newIndex = i;
                            break;
                        }
                    }
                }

                // If all elements are fully visible, go to previous element
                if (!targetChild) {
                    newIndex = children.length - 1;
                    targetChild = children[newIndex];
                }
            } else {
                // Find the last fully visible element
                let lastFullyVisibleIndex = -1;
                for (let i = children.length - 1; i >= 0; i--) {
                    if (isFullyVisible(children[i])) {
                        lastFullyVisibleIndex = i;
                        break;
                    }
                }

                // Search forwards from the last fully visible element
                if (lastFullyVisibleIndex === -1) {
                    // No elements are fully visible, go to first element
                    newIndex = 0;
                    targetChild = children[newIndex];
                } else {
                    // Look for the first not-fully-visible element after the last fully visible one
                    for (
                        let i = lastFullyVisibleIndex + 1;
                        i < children.length;
                        i++
                    ) {
                        const child = children[i];
                        if (!isFullyVisible(child)) {
                            targetChild = child;
                            newIndex = i;
                            break;
                        }
                    }
                }

                // If all elements are fully visible, go to first element
                if (!targetChild) {
                    newIndex = 0;
                    targetChild = children[newIndex];
                }
            }

            if (targetChild) {
                const targetLeft = targetChild.offsetLeft;
                container.scrollTo({
                    left: targetLeft,
                    behavior: "smooth",
                });

                // Update the current element index
                setCurrentElementIndex(newIndex);
            }
            setTimeout(() => {
                setDisableScrollButtons(false);
            }, 500);
        }
    },
    [currentElementIndex, validMedia.length]
);

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

            // Start with first image focused (scroll to 0)
            container.scrollTo({
                left: 0,
                behavior: "auto",
            });

            // Set current element index to 0
            setCurrentElementIndex(0);
        }
    }, [validMedia.length]);

    const closeFullscreen = useCallback(() => {
        setFullscreenIndex(null);
        document.body.style.overflow = "auto";
    }, []);

    useEffect(() => {
        if (fullscreenIndex === null) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "ArrowLeft") {
                event.preventDefault();
                scroll("left", true);
            } else if (event.key === "ArrowRight") {
                event.preventDefault();
                scroll("right", true);
            } else if (event.key === "Escape") {
                event.preventDefault();
                closeFullscreen();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [closeFullscreen, fullscreenIndex, scroll]);

    if (validMedia.length === 0) {
        return null;
    }

    return (
        <>
            {/* Gallery Container */}
            <div className='w-full mt-10 mb-4'>
                <h2 className='text-neutral-500 text-3xl font-extralight mb-4'>
                    Gallery
                </h2>

                <div className='relative group'>
                    {/* Scroll Container */}
                    <div
                        ref={scrollContainerRef}
                        className='flex overflow-x-auto scrollbar-hide gap-4 -pr-12 rounded-md'
                        style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                            scrollSnapType: "x mandatory",
                        }}
                    >
                        {validMedia.map((item, index) => {
                            const isLoaded = !!loadedImages[item.id];
                            return (
                                <div
                                    key={item.id}
                                    className='shrink-0 cursor-pointer'
                                    style={{
                                        height: "400px",
                                        scrollSnapAlign: "start",
                                    }}
                                    onClick={() => openFullscreen(index)}
                                >
                                    <div className='relative h-full w-full max-w-[calc(100vw-5rem)] overflow-hidden rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center'>
                                        {!isLoaded && (
                                            <div className='absolute inset-0 rounded-lg bg-neutral-900/60 animate-pulse flex items-center justify-center'>
                                                <span className='sr-only'>
                                                    Loading image
                                                </span>
                                            </div>
                                        )}
                                        <Image
                                            src={
                                                "https://mb-portfolio.fly.dev" +
                                                    item.Image?.url || ""
                                            }
                                            alt={
                                                item.Image!.alternativeText ||
                                                item.Comment ||
                                                "Gallery image"
                                            }
                                            width={600}
                                            height={400}
                                            className={`h-full w-auto max-w-full object-contain rounded-md transition-opacity duration-300 ${
                                                isLoaded
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            }`}
                                            loading='lazy'
                                            onLoad={() =>
                                                markImageLoaded(item.id)
                                            }
                                            onLoadingComplete={() =>
                                                markImageLoaded(item.id)
                                            }
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Navigation Arrows - Bottom */}
                    <div className='flex justify-start items-center gap-4 mt-4'>
                        {/* Left Arrow */}
                        <button
                            disabled={disableScrollButtons}
                            onClick={() => scroll("left")}
                            className='bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-opacity duration-200'
                            aria-label='Previous image'
                        >
                            <ChevronLeft className='w-6 h-6' />
                        </button>

                        {/* Right Arrow */}
                        <button
                            disabled={disableScrollButtons}
                            onClick={() => scroll("right")}
                            className='bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-opacity duration-200'
                            aria-label='Next image'
                        >
                            <ChevronRight className='w-6 h-6' />
                        </button>
                    </div>
                </div>
            </div>

            {/* Fullscreen Modal */}
            {fullscreenIndex !== null && (
                <div
                    className='fixed inset-0 z-110 flex items-center justify-center top-0 left-0'
                    onClick={closeFullscreen}
                >
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
                    <div className='fullscreen-arrow-wrapper h-full w-12 flex flex-col items-center justify-center py-16'>
                        {/* Left Arrow - Fullscreen */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                scroll("left", true);
                            }}
                            className='fullscreen-arrow absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 text-white p-4 rounded-full'
                            aria-label='Previous image'
                        >
                            <ChevronLeft className='w-8 h-8' />
                        </button>
                    </div>

                    {/* Fullscreen Scroll Container */}
                    <div
                        ref={fullscreenScrollRef}
                        className='relative w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide'
                        style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                        }}
                    >
                        {validMedia.map((item) => {
                            const isLoaded = !!loadedImages[item.id];
                            return (
                                <div
                                    key={item.id}
                                    className='shrink-0 snap-start snap-always w-full h-full flex flex-col items-center justify-center gap-4 p-16'
                                >
                                    <div className='relative max-w-[90vw] max-h-[80vh] w-full h-full '>
                                        {!isLoaded && (
                                            <div className='absolute inset-0 bg-neutral-900/60 animate-pulse rounded-md flex items-center justify-center'>
                                                <span className='sr-only'>
                                                    Loading image
                                                </span>
                                            </div>
                                        )}
                                        <Image
                                            src={
                                                "https://mb-portfolio.fly.dev" +
                                                    item.Image?.url || ""
                                            }
                                            alt={
                                                item.Image!.alternativeText ||
                                                item.Comment ||
                                                "Gallery image"
                                            }
                                            fill
                                            className={`object-contain transition-opacity duration-300 ${
                                                isLoaded
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            }`}
                                            sizes='90vw'
                                            priority
                                            onLoad={() =>
                                                markImageLoaded(item.id)
                                            }
                                            onLoadingComplete={() =>
                                                markImageLoaded(item.id)
                                            }
                                        />
                                    </div>
                                    {item.Comment && (
                                        <div className='mt-6 text-center'>
                                            <p className='text-white text-xl font-medium max-w-2xl'>
                                                {item.Comment}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <div className='fullscreen-arrow-wrapper h-full w-12 flex flex-col items-center justify-center py-16'>
                        {/* Right Arrow - Fullscreen */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                scroll("right", true);
                            }}
                            className='fullscreen-arrow absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 text-white p-4 rounded-full'
                            aria-label='Next image'
                        >
                            <ChevronRight className='w-8 h-8' />
                        </button>
                    </div>

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
                @media (pointer: coarse) {
                    .fullscreen-arrow {
                        display: none;
                    }
                    .fullscreen-arrow-wrapper {
                        display: none;
                    }
                }
            `}</style>
        </>
    );
}

export function GallerySkeleton() {
    return (
        <div className='w-full mt-10 mb-4 animate-pulse'>
            <div className='h-8 w-40 rounded bg-neutral-800 mb-6' />
            <div className='flex gap-4 overflow-hidden'>
                {Array.from({ length: 4 }).map((_, index) => (
                    <div
                        key={index}
                        className='h-[400px] w-full max-w-[calc(100vw-5rem)] rounded-lg bg-neutral-800/80'
                    />
                ))}
            </div>
            <div className='flex items-center gap-4 mt-4'>
                <div className='h-12 w-12 rounded-full bg-neutral-800/80' />
                <div className='h-12 w-12 rounded-full bg-neutral-800/80' />
            </div>
        </div>
    );
}
