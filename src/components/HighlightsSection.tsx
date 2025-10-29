"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import HighlightCard from "./HighlightCard";

const TIMER_DURATION = 5000; // 5 seconds per slide

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

export default function HighlightsSection() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(1); // Start with second card
    const [progressKey, setProgressKey] = useState(0);
    const [isVisible, setIsVisible] = useState(false); // Don't start timer until scrolled to
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<Map<number, HTMLDivElement>>(new Map());
    const isScrollingRef = useRef(false);
    const sectionRef = useRef<HTMLDivElement>(null);

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

    // Simple scroll-based visibility detection
    useEffect(() => {
        const checkVisibility = () => {
            const section = sectionRef.current;
            if (!section) return;

            const rect = section.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Check if section is in viewport
            const visible = rect.top < windowHeight && rect.bottom > 0;
            console.log('visible', visible);
            // Reset timer when becoming visible
            if (visible && !isVisible) {
                setProgressKey(prev => prev + 1);
            }
            
            setIsVisible(visible);
        };

        // Check on mount
        checkVisibility();

        // Check on scroll
        window.addEventListener('scroll', checkVisibility);
        window.addEventListener('resize', checkVisibility);

        return () => {
            window.removeEventListener('scroll', checkVisibility);
            window.removeEventListener('resize', checkVisibility);
        };
    }, [isVisible]);

    // Scroll to a specific card
    const scrollToCard = useCallback((index: number) => {
        const projectId = projects[index]?.id;
        if (!projectId) return;
        
        const card = cardsRef.current.get(projectId);
        if (card) {
            isScrollingRef.current = true;
            card.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center',
            });
            
            // Reset scroll flag after animation
            setTimeout(() => {
                isScrollingRef.current = false;
            }, 1000);
        }
    }, [projects]);

    // Initialize: scroll to second card
    useEffect(() => {
        if (projects.length > 1) {
            setTimeout(() => {
                scrollToCard(1);
            }, 100);
        }
    }, [projects, scrollToCard]);

    // Update card styles based on scroll position
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const updateCardStyles = () => {
            const containerRect = container.getBoundingClientRect();
            const centerX = containerRect.left + containerRect.width / 2;
            let closestIndex = 0;
            let closestDistance = Infinity;

            cardsRef.current.forEach((card, projectId) => {
                const cardRect = card.getBoundingClientRect();
                const cardCenterX = cardRect.left + cardRect.width / 2;
                
                // Calculate distance from center (0 = at center, 1 = at edge or beyond)
                const distanceFromCenter = Math.abs(cardCenterX - centerX);
                const maxDistance = containerRect.width / 2;
                const normalizedDistance = Math.min(distanceFromCenter / maxDistance, 1);
                
                // Track which card is closest to center
                if (distanceFromCenter < closestDistance) {
                    closestDistance = distanceFromCenter;
                    const index = projects.findIndex(p => p.id === projectId);
                    if (index !== -1) closestIndex = index;
                }
                
                // Scale: 1.0 at center, 0.75 at edges
                const scale = 1 - (normalizedDistance * 0.25);
                
                // Grayscale: 0% at center, 100% at edges
                const grayscale = normalizedDistance * 100;
                
                // Opacity: 1 at center, 0.5 at edges
                const opacity = 1 - (normalizedDistance * 0.5);
                
                // Rotation: 0deg at center, ±8deg at edges (based on side)
                const rotation = (cardCenterX < centerX ? -1 : 1) * normalizedDistance * 8;
                
                // Vertical displacement: 0px at center, 80px lower at edges
                const translateY = normalizedDistance * 80;

                card.style.transform = `scale(${scale}) rotate(${rotation}deg) translateY(${translateY}px)`;
                card.style.filter = `grayscale(${grayscale}%)`;
                card.style.opacity = `${opacity}`;
            });

            // Update current index if not actively scrolling
            if (!isScrollingRef.current && closestIndex !== currentIndex) {
                setCurrentIndex(closestIndex);
                setProgressKey(prev => prev + 1);
            }
        };

        // Update on scroll
        container.addEventListener('scroll', updateCardStyles);
        
        // Initial update
        updateCardStyles();
        
        // Update on window resize
        window.addEventListener('resize', updateCardStyles);

        return () => {
            container.removeEventListener('scroll', updateCardStyles);
            window.removeEventListener('resize', updateCardStyles);
        };
    }, [projects, currentIndex]);

    // Auto-advance timer (only when visible)
    useEffect(() => {
        if (projects.length === 0 || !isVisible) return;

        const timer = setTimeout(() => {
            const nextIndex = (currentIndex + 1) % projects.length;
            setCurrentIndex(nextIndex);
            setProgressKey(prev => prev + 1);
            scrollToCard(nextIndex);
        }, TIMER_DURATION);

        return () => clearTimeout(timer);
    }, [projects.length, currentIndex, isVisible, scrollToCard]);

    if (isLoading) {
        return (
            <div className='relative w-full flex flex-col items-center justify-between md:px-6 bg-neutral-900 pt-10 pb-10'>
                <div className='relative w-full max-w-[1600px] flex flex-col items-center justify-between px-6 bg-neutral-900'>
                    <span className='text-5xl md:text-8xl text-left font-light self-start text-white mb-8 mt-20'>
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
        <div ref={sectionRef} className='relative w-full flex flex-col items-center justify-between md:px-6 bg-neutral-900 pt-10 pb-10'>
            <div className='relative w-full max-w-[1920px] flex flex-col items-center justify-between px-6 bg-neutral-900 gap-8'>
                <span className='text-5xl md:text-8xl text-left font-light self-start text-white mb-8 mt-20'>
                    MY TOPS
                </span>

                {/* Scroll Container with Edge Gradients */}
                <div className='relative w-full'>
                    {/* Left gradient overlay */}
                    <div className='absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-linear-to-r from-neutral-900 to-transparent z-10 pointer-events-none' />
                    
                    {/* Right gradient overlay */}
                    <div className='absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-linear-to-l from-neutral-900 to-transparent z-10 pointer-events-none' />
                    
                    {/* Scrollable container */}
                    <div
                        ref={scrollContainerRef}
                        className='flex gap-0.5 md:gap-1 overflow-x-auto py-8 px-4 md:px-8 no-scrollbar scroll-smooth'
                        style={{
                            scrollSnapType: 'x mandatory',
                        }}
                    >
                        {/* Spacer to center first card - responsive for mobile (300px) and desktop (700px) */}
                        <div className='shrink-0 w-[calc(50vw-150px-0.0625rem)] md:w-[calc(50%-350px-0.125rem)]' />
                        
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                ref={(el) => {
                                    if (el) {
                                        cardsRef.current.set(project.id, el);
                                    } else {
                                        cardsRef.current.delete(project.id);
                                    }
                                }}
                                className='shrink-0 transition-all duration-300 ease-out'
                                style={{
                                    scrollSnapAlign: 'center',
                                    }}
                                >
                                    <HighlightCard project={project} />
                                </div>
                        ))}
                        
                        {/* Spacer to center last card - responsive for mobile (300px) and desktop (700px) */}
                        <div className='shrink-0 w-[calc(50vw-150px-0.0625rem)] md:w-[calc(50%-350px-0.125rem)]' />
                    </div>
                </div>

                {/* Navigation Dots with Progress */}
                <div className='flex items-center gap-2 justify-center mt-4'>
                    {projects.map((project, index) => (
                        <button
                            key={project.id}
                            onClick={() => {
                                setCurrentIndex(index);
                                setProgressKey(prev => prev + 1);
                                scrollToCard(index);
                            }}
                            className='relative transition-all duration-300 ease-in-out'
                        >
                            {index === currentIndex ? (
                                <div className='relative w-12 h-3 bg-neutral-700 rounded-full overflow-hidden transition-all duration-300 ease-in-out'>
                                    {isVisible && (
                                        <div
                                            key={progressKey}
                                            className='absolute top-0 left-0 h-full bg-[#C8B936]'
                                            style={{
                                                animation: `progressBar ${TIMER_DURATION}ms linear forwards`
                                            }}
                                        />
                                    )}
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
