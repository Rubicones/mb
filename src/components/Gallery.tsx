"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
    resolveAssetUrl,
    resolveMediaImage,
    type MediaItem,
} from "@/lib/strapi";

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
    const validMedia = media.filter((item) => resolveMediaImage(item)?.url);

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
            const containerWidth = container.offsetWidth;
            const scrollLeft = container.scrollLeft;

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

            const scrollLeft = container.scrollLeft;
            const children = Array.from(container.children) as HTMLElement[];

            const isFullyVisible = (child: HTMLElement) => {
                const containerWidth = container.offsetWidth;

                const imageWidth = child.offsetWidth;

                const leftIndent = child.offsetLeft - scrollLeft;
                const rightIndent = containerWidth - (leftIndent + imageWidth);

                const isVisible = leftIndent >= -10 && rightIndent >= -10;

                return isVisible;
            };

            let targetChild;
            let newIndex = currentElementIndex;
            if (direction === "left") {
                const firstFullyVisibleIndex = children.findIndex((child) =>
                    isFullyVisible(child)
                );
                if (firstFullyVisibleIndex === -1) {
                    newIndex = children.length - 1;
                    targetChild = children[newIndex];
                } else {
                    for (let i = firstFullyVisibleIndex; i >= 0; i--) {
                        const child = children[i];
                        if (!isFullyVisible(child)) {
                            targetChild = child;
                            newIndex = i;
                            break;
                        }
                    }
                }

                if (!targetChild) {
                    newIndex = children.length - 1;
                    targetChild = children[newIndex];
                }
            } else {
                let lastFullyVisibleIndex = -1;
                for (let i = children.length - 1; i >= 0; i--) {
                    if (isFullyVisible(children[i])) {
                        lastFullyVisibleIndex = i;
                        break;
                    }
                }

                if (lastFullyVisibleIndex === -1) {
                    newIndex = 0;
                    targetChild = children[newIndex];
                } else {
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
        document.body.style.overflow = "hidden";

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

    useEffect(() => {
        if (validMedia.length > 0 && scrollContainerRef.current) {
            const container = scrollContainerRef.current;

            container.scrollTo({
                left: 0,
                behavior: "auto",
            });

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
            <div className='w-full mt-10 mb-4'>
                <h2 className='text-neutral-500 text-3xl font-extralight mb-4'>
                    Gallery
                </h2>

                <div className='relative group'>
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
                            const image = resolveMediaImage(item);
                            const imageUrl = resolveAssetUrl(image);

                            if (!image || !imageUrl) {
                                return null;
                            }
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
                                            src={imageUrl}
                                            alt={
                                                image.alternativeText ||
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
                                            onLoad={() => markImageLoaded(item.id)}
                                            onLoadingComplete={() =>
                                                markImageLoaded(item.id)
                                            }
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className='flex justify-start items-center gap-4 mt-4'>
                        <button
                            disabled={disableScrollButtons}
                            onClick={() => scroll("left")}
                            className='bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-opacity duration-200'
                            aria-label='Previous image'
                        >
                            <ChevronLeft className='w-6 h-6' />
                        </button>

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

            {fullscreenIndex !== null && (
                <div
                    className='fixed inset-0 z-110 flex items-center justify-center top-0 left-0'
                    onClick={closeFullscreen}
                >
                    <div
                        className='absolute inset-0 bg-black/80 backdrop-blur-md'
                        onClick={closeFullscreen}
                    />

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
                            const image = resolveMediaImage(item);
                            const imageUrl = resolveAssetUrl(image);

                            if (!image || !imageUrl) {
                                return null;
                            }
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
                                            src={imageUrl}
                                            alt={
                                                image.alternativeText ||
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
                                            onLoad={() => markImageLoaded(item.id)}
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
