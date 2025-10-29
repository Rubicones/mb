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

    const getProjectAtIndex = (offset: number) => {
        const index =
            (currentIndex + offset + projects.length) % projects.length;
        return projects[index];
    };

    const goToNext = useCallback(() => {
        if (transitionState.isTransitioning) return;
        
        setProgress(0);
        // Set direction and update index (cards render at initial position)
        setTransitionState({ isTransitioning: true, direction: "next", animating: false });
        setCurrentIndex((current) => (current + 1) % projects.length);
    }, [projects.length, transitionState.isTransitioning]);

    const goToPrevious = useCallback(() => {
        if (transitionState.isTransitioning) return;
        
        setProgress(0);
        // Set direction and update index (cards render at initial position)
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
            // If distances are equal, prefer forward
            const direction = backwardDistance < forwardDistance ? "prev" : "next";
            
            setProgress(0);
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

    // Timer effect
    useEffect(() => {
        if (projects.length === 0 || transitionState.isTransitioning) return;

        const interval = setInterval(() => {
            setProgress((prev) => {
                const newProgress = prev + 100 / (TIMER_DURATION / 50);
                if (newProgress >= 100) {
                    return 100;
                }
                return newProgress;
            });
        }, 50);

        return () => clearInterval(interval);
    }, [projects.length, transitionState.isTransitioning]);
    
    // Trigger goToNext when progress reaches 100
    useEffect(() => {
        if (progress >= 100 && !transitionState.isTransitioning) {
            goToNext();
        }
    }, [progress, transitionState.isTransitioning, goToNext]);

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
                            const isLeft = offset === -1;
                            const isCenter = offset === 0;
                            const isRight = offset === 1;
                            const isFarLeft = offset === -2;
                            const isFarRight = offset === 2;
                            
                            // Determine visual position
                            let visualPosition = offset; // default: -2, -1, 0, 1, 2
                            
                            // During transition, override positions for smooth sliding
                            if (transitionState.isTransitioning && transitionState.direction === "next") {
                                // Everything shifts left (all cards move one position to the left)
                                if (isCenter) {
                                    visualPosition = 1; // New center starts at right
                                } else if (isLeft) {
                                    visualPosition = 0; // New left starts at center
                                } else if (isFarLeft) {
                                    visualPosition = -1; // New far-left starts at left
                                } else if (isRight) {
                                    visualPosition = 2; // New right starts at far-right
                                } else if (isFarRight) {
                                    visualPosition = 3; // New far-right starts off-screen
                                }
                            } else if (transitionState.isTransitioning && transitionState.direction === "prev") {
                                // Everything shifts right (all cards move one position to the right)
                                if (isCenter) {
                                    visualPosition = -1; // New center starts at left
                                } else if (isRight) {
                                    visualPosition = 0; // New right starts at center
                                } else if (isFarRight) {
                                    visualPosition = 1; // New far-right starts at right
                                } else if (isLeft) {
                                    visualPosition = -2; // New left starts at far-left
                                } else if (isFarLeft) {
                                    visualPosition = -3; // New far-left starts off-screen
                                }
                            }
                            
                            const getPositionStyles = (pos: number) => {
                                const isVisualCenter = pos === 0;
                                const isVisualLeft = pos === -1;
                                const isVisualRight = pos === 1;
                                const isVisualFarLeft = pos === -2;
                                const isVisualFarRight = pos === 2;
                                const isVisualOffLeft = pos <= -3;
                                const isVisualOffRight = pos >= 3;
                                
                                // Calculate translateX - cards closer together
                                let translateX = '0';
                                if (isVisualOffLeft) translateX = 'calc(-150% - 8rem)';
                                else if (isVisualFarLeft) translateX = 'calc(-100% - 5rem)';
                                else if (isVisualLeft) translateX = 'calc(-60% - 2rem)';
                                else if (isVisualRight) translateX = 'calc(60% + 2rem)';
                                else if (isVisualFarRight) translateX = 'calc(100% + 5rem)';
                                else if (isVisualOffRight) translateX = 'calc(150% + 8rem)';
                                
                                return {
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
                                };
                            };

                            const finalPosition = offset;
                            const currentPosition = (transitionState.isTransitioning && !transitionState.animating) 
                                ? visualPosition 
                                : finalPosition;
                            
                            return (
                                <div
                                    key={`${project.id}-${offset}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (isLeft) goToPrevious();
                                        if (isRight) goToNext();
                                    }}
                                    className={`absolute ${transitionState.animating ? 'transition-all duration-700 ease-in-out' : ''}`}
                                    style={getPositionStyles(currentPosition) as React.CSSProperties}
                                    onMouseEnter={(e) => {
                                        if (!isCenter) {
                                            e.currentTarget.style.opacity = '0.6';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isCenter && !isFarLeft && !isFarRight) {
                                            e.currentTarget.style.opacity = '0.5';
                                        }
                                    }}
                                >
                                    <HighlightCard project={project} />
                                </div>
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
