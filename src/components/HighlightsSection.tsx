"use client";

import { useEffect, useState, useCallback, memo } from "react";
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

// Memoized carousel card component to prevent unnecessary re-renders
const CarouselCard = memo(({ 
    project, 
    offset, 
    isTransitioning, 
    direction, 
    animating,
    onCardClick 
}: { 
    project: Project;
    offset: number;
    isTransitioning: boolean;
    direction: "next" | "prev" | null;
    animating: boolean;
    onCardClick: () => void;
}) => {
    const isLeft = offset === -1;
    const isCenter = offset === 0;
    const isRight = offset === 1;
    const isFarLeft = offset === -2;
    const isFarRight = offset === 2;
    
    // Determine visual position
    let visualPosition = offset;
    
    // During transition, override positions for smooth sliding
    if (isTransitioning && direction === "next") {
        if (isCenter) visualPosition = 1;
        else if (isLeft) visualPosition = 0;
        else if (isFarLeft) visualPosition = -1;
        else if (isRight) visualPosition = 2;
        else if (isFarRight) visualPosition = 3;
    } else if (isTransitioning && direction === "prev") {
        if (isCenter) visualPosition = -1;
        else if (isRight) visualPosition = 0;
        else if (isFarRight) visualPosition = 1;
        else if (isLeft) visualPosition = -2;
        else if (isFarLeft) visualPosition = -3;
    }
    
    const currentPosition = (isTransitioning && !animating) ? visualPosition : offset;
    
    const isVisualCenter = currentPosition === 0;
    const isVisualLeft = currentPosition === -1;
    const isVisualRight = currentPosition === 1;
    const isVisualFarLeft = currentPosition === -2;
    const isVisualFarRight = currentPosition === 2;
    const isVisualOffLeft = currentPosition <= -3;
    const isVisualOffRight = currentPosition >= 3;
    
    // Calculate translateX - memoized
    let translateX = '0';
    if (isVisualOffLeft) translateX = 'calc(-150% - 8rem)';
    else if (isVisualFarLeft) translateX = 'calc(-100% - 5rem)';
    else if (isVisualLeft) translateX = 'calc(-60% - 2rem)';
    else if (isVisualRight) translateX = 'calc(60% + 2rem)';
    else if (isVisualFarRight) translateX = 'calc(100% + 5rem)';
    else if (isVisualOffRight) translateX = 'calc(150% + 8rem)';
    
    const positionStyles = {
        transform: `
            translateX(${translateX})
            scale(${isVisualCenter ? 1 : 0.75})
            rotate(${
                isVisualOffLeft ? '-10deg' :
                isVisualFarLeft ? '-8deg' :
                isVisualLeft ? '-6deg' : 
                isVisualOffRight ? '10deg' :
                isVisualFarRight ? '8deg' :
                isVisualRight ? '6deg' : 
                '0deg'
            })
        `,
        opacity: isVisualCenter ? 1 : 
                 (isVisualLeft || isVisualRight) ? 0.5 : 
                 0,
        filter: isVisualCenter ? 'none' : 'grayscale(100%)',
        zIndex: isVisualCenter ? 10 : 
               (isVisualLeft || isVisualRight) ? 5 : 
               0,
        cursor: isCenter ? 'default' : 'pointer',
        pointerEvents: (isFarLeft || isFarRight) ? 'none' : 'auto',
    } as React.CSSProperties;

    const [localOpacity, setLocalOpacity] = useState<number | undefined>();

    return (
        <div
            key={`${project.id}-${offset}`}
            onClick={(e) => {
                e.stopPropagation();
                if (isLeft || isRight) onCardClick();
            }}
            className={`absolute ${animating ? 'transition-all duration-700 ease-in-out' : ''}`}
            style={{ ...positionStyles, opacity: localOpacity ?? positionStyles.opacity }}
            onMouseEnter={() => {
                if (!isCenter) setLocalOpacity(0.6);
            }}
            onMouseLeave={() => {
                if (!isCenter && !isFarLeft && !isFarRight) {
                    setLocalOpacity(undefined);
                }
            }}
        >
            <HighlightCard project={project} />
        </div>
    );
});

CarouselCard.displayName = 'CarouselCard';

export default function HighlightsSection() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progressKey, setProgressKey] = useState(0); // Key to trigger progress animation restart
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const [transitionState, setTransitionState] = useState<{
        isTransitioning: boolean;
        direction: "next" | "prev" | null;
        animating: boolean;
    }>({ isTransitioning: false, direction: null, animating: false });

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

    const getProjectAtIndex = useCallback((offset: number) => {
        const index =
            (currentIndex + offset + projects.length) % projects.length;
        return projects[index];
    }, [currentIndex, projects]);

    const goToNext = useCallback(() => {
        if (transitionState.isTransitioning) return;
        
        setProgressKey(prev => prev + 1);
        setTransitionState({ isTransitioning: true, direction: "next", animating: false });
        setCurrentIndex((current) => (current + 1) % projects.length);
    }, [projects.length, transitionState.isTransitioning]);

    const goToPrevious = useCallback(() => {
        if (transitionState.isTransitioning) return;
        
        setProgressKey(prev => prev + 1);
        setTransitionState({ isTransitioning: true, direction: "prev", animating: false });
        setCurrentIndex(
            (current) => (current - 1 + projects.length) % projects.length
        );
    }, [projects.length, transitionState.isTransitioning]);

    const goToIndex = useCallback(
        (index: number) => {
            if (transitionState.isTransitioning || index === currentIndex) return;
            
            // Calculate the shortest path (forward or backward)
            const forwardDistance = (index - currentIndex + projects.length) % projects.length;
            const backwardDistance = (currentIndex - index + projects.length) % projects.length;
            
            // Choose direction based on shortest path
            const direction = backwardDistance < forwardDistance ? "prev" : "next";
            
            setProgressKey(prev => prev + 1);
            setTransitionState({ isTransitioning: true, direction, animating: false });
            setCurrentIndex(index);
        },
        [currentIndex, transitionState.isTransitioning, projects.length]
    );
    
    // Trigger animation after index change
    useEffect(() => {
        if (transitionState.isTransitioning && !transitionState.animating) {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setTransitionState(prev => ({ ...prev, animating: true }));
                });
            });
        }
    }, [transitionState.isTransitioning, transitionState.animating]);
    
    // Clear transition state after animation completes
    useEffect(() => {
        if (transitionState.animating) {
            const timer = setTimeout(() => {
                setTransitionState({ isTransitioning: false, direction: null, animating: false });
            }, 750);
            return () => clearTimeout(timer);
        }
    }, [transitionState.animating]);

    // Auto-advance timer - triggers goToNext when timer completes
    useEffect(() => {
        if (projects.length === 0 || transitionState.isTransitioning) return;

        const timer = setTimeout(() => {
            goToNext();
        }, TIMER_DURATION);

        return () => clearTimeout(timer);
    }, [projects.length, transitionState.isTransitioning, goToNext, progressKey]);

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
                    {projects.length === 1 ? (
                        <div className='relative z-10'>
                            <HighlightCard project={projects[0]} />
                        </div>
                    ) : (
                        [-2, -1, 0, 1, 2].map((offset) => {
                            const project = getProjectAtIndex(offset);
                            
                            return (
                                <CarouselCard
                                    key={`${project.id}-${offset}`}
                                    project={project}
                                    offset={offset}
                                    isTransitioning={transitionState.isTransitioning}
                                    direction={transitionState.direction}
                                    animating={transitionState.animating}
                                    onCardClick={offset === -1 ? goToPrevious : goToNext}
                                />
                            );
                        })
                    )}
                </div>

                {/* Navigation Dots */}
                <div className='flex items-center gap-2 justify-center mt-4'>
                    {projects.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {goToIndex(index)}}
                            className='relative transition-all duration-300 ease-in-out'
                        >
                            {index === currentIndex ? (
                                <div className='relative w-12 h-3 bg-neutral-700 rounded-full overflow-hidden transition-all duration-300 ease-in-out'>
                                    <div
                                        key={progressKey}
                                        className='absolute top-0 left-0 h-full bg-[#C8B936] animate-progress-bar'
                                        style={{
                                            animation: transitionState.isTransitioning 
                                                ? 'none' 
                                                : `progressBar ${TIMER_DURATION}ms linear forwards`
                                        }}
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
