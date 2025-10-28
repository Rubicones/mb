"use client";

import { useEffect, useState, useCallback } from "react";
import HighlightCard from "./HighlightCard";

interface StrapiImage {
    id: number;
    url: string;
    width: number;
    height: number;
    alternativeText?: string;
}

interface MediaItem {
    id: number;
    Image: StrapiImage;
}

interface Program {
    id: number;
    Name: string;
    Icon?: StrapiImage;
}

interface Project {
    id: number;
    documentId: string;
    Name: string;
    Description: string;
    Date: string;
    isPosted: boolean;
    isHighlighted?: boolean;
    Cover: StrapiImage;
    Content: "youtube" | "spline" | "none";
    SplineLink: string | null;
    ytLink: string | null;
    Category: "c_3D" | "c_2D" | "c_Craft";
    Media: MediaItem[];
    Programs: Program[];
}

interface StrapiResponse {
    data: Project[];
}

const TIMER_DURATION = 5000; // 5 seconds per slide

export default function HighlightsSection() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);

    useEffect(() => {
        async function fetchHighlightedProjects() {
            try {
                const response = await fetch(
                    "https://authentic-splendor-f67c9d75a4.strapiapp.com/api/projects?filters[isHighlighted][$eq]=true&populate=*&pagination[pageSize]=10",
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    console.error(
                        "Failed to fetch highlighted projects:",
                        response.status,
                        response.statusText
                    );
                    setIsLoading(false);
                    return;
                }

                const data: StrapiResponse = await response.json();
                if (data.data && data.data.length > 0) {
                    setProjects(data.data);
                }
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching highlighted projects:", error);
                setIsLoading(false);
            }
        }

        fetchHighlightedProjects();
    }, []);

    const getProjectAtIndex = (offset: number) => {
        const index = (currentIndex + offset + projects.length) % projects.length;
        return projects[index];
    };

    const goToNext = useCallback(() => {
        setSlideDirection('left');
        setCurrentIndex((current) => (current + 1) % projects.length);
        setProgress(0);
    }, [projects.length]);

    const goToPrevious = useCallback(() => {
        setSlideDirection('right');
        setCurrentIndex((current) => (current - 1 + projects.length) % projects.length);
        setProgress(0);
    }, [projects.length]);

    const goToIndex = useCallback((index: number) => {
        if (index > currentIndex) {
            setSlideDirection('left');
        } else if (index < currentIndex) {
            setSlideDirection('right');
        }
        setCurrentIndex(index);
        setProgress(0);
    }, [currentIndex]);

    // Timer effect
    useEffect(() => {
        if (projects.length === 0) return;

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    goToNext();
                    return 0;
                }
                return prev + (100 / (TIMER_DURATION / 50));
            });
        }, 50);

        return () => clearInterval(interval);
    }, [projects.length, goToNext]);

    // Minimum swipe distance (in px)
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            goToNext();
        } else if (isRightSwipe) {
            goToPrevious();
        }
    };

    if (isLoading) {
        return (
            <div className='relative w-full flex flex-col items-center justify-between md:px-6 bg-neutral-900 pt-10 pb-10'>
                <div className='relative w-full max-w-[1600px] flex flex-col items-center justify-between px-6 bg-neutral-900'>
                    <span className='text-5xl md:text-8xl text-left font-light self-start text-white mb-8 mt-20 '>
                        MY TOPS
                    </span>
                    <div className='w-full max-w-[700px] h-[550px] bg-neutral-800 rounded-2xl animate-pulse' />
                </div>
            </div>
        );
    }

    if (projects.length === 0) {
        return null;
    }

    return (
        <div className='relative w-full flex flex-col items-center justify-between md:px-6 bg-neutral-900 pt-10 pb-10'>
            <div className='relative w-full max-w-[1600px] flex flex-col items-center justify-between px-6 bg-neutral-900 gap-8'>
                <span className='text-5xl md:text-8xl text-left font-light self-start text-white mb-8 mt-20 '>
                    MY TOPS
                </span>

                {/* Carousel Container */}
                <div 
                    className='relative w-full flex items-center justify-center overflow-x-visible md:overflow-hidden min-h-[600px] touch-pan-y'
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    {/* Left Card (Faded) */}
                    {projects.length > 1 && (
                        <div 
                            key={`left-${getProjectAtIndex(-1).id}`}
                            onClick={goToPrevious}
                            className='absolute left-[-120px] md:left-10 opacity-40 grayscale scale-[0.6] md:scale-75 -rotate-6 z-0 cursor-pointer hover:opacity-60 transition-all duration-700 ease-in-out'
                        >
                            <HighlightCard project={getProjectAtIndex(-1)} />
                        </div>
                    )}

                    {/* Center Card (Active) */}
                    <div 
                        key={`center-${getProjectAtIndex(0).id}`}
                        className={`relative z-10 ${
                            slideDirection === 'left' 
                                ? 'animate-slideFromRight' 
                                : slideDirection === 'right' 
                                ? 'animate-slideFromLeft' 
                                : 'animate-fadeIn'
                        }`}
                    >
                        <HighlightCard project={getProjectAtIndex(0)} />
                    </div>

                    {/* Right Card (Faded) */}
                    {projects.length > 1 && (
                        <div 
                            key={`right-${getProjectAtIndex(1).id}`}
                            onClick={goToNext}
                            className='absolute right-[-120px] md:right-10 opacity-40 grayscale scale-[0.6] md:scale-75 rotate-6 z-0 cursor-pointer hover:opacity-60 transition-all duration-700 ease-in-out'
                        >
                            <HighlightCard project={getProjectAtIndex(1)} />
                        </div>
                    )}
                </div>

                {/* Navigation Dots */}
                <div className='flex items-center gap-2 justify-center mt-4'>
                    {projects.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToIndex(index)}
                            className='relative transition-all duration-300 ease-in-out'
                        >
                            {index === currentIndex ? (
                                <div className='relative w-12 h-3 bg-neutral-700 rounded-full overflow-hidden transition-all duration-300 ease-in-out'>
                                    <div
                                        className='absolute top-0 left-0 h-full bg-[#C8B936] transition-all duration-100 ease-linear'
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            ) : (
                                <div className='w-3 h-3 rounded-full bg-white transition-all duration-300 ease-in-out' />
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
