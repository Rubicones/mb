"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
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
    const router = useRouter();
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
                    "https://mb-portfolio.fly.dev/api/projects?filters[isHighlighted][$eq]=true&populate=*&pagination[pageSize]=10",
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
                console.log(data);
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
        if (projects.length > 1 && isVisible) {
            setTimeout(() => {
                scrollToCard(1);
            }, 100);
        }
    }, [projects, scrollToCard, isVisible]);

    // Update card styles based on scroll position (optimized for mobile)
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        let rafId: number | null = null;
        let lastScrollTime = 0;
        const THROTTLE_MS = 16; // ~60fps

        const updateCardStyles = () => {
            const now = Date.now();
            if (now - lastScrollTime < THROTTLE_MS) return;
            lastScrollTime = now;

            const containerRect = container.getBoundingClientRect();
            const centerX = containerRect.left + containerRect.width / 2;
            let closestIndex = 0;
            let closestDistance = Infinity;

            cardsRef.current.forEach((card, projectId) => {
                const cardRect = card.getBoundingClientRect();
                const cardCenterX = cardRect.left + cardRect.width / 2;
                
                // Calculate distance from center
                const distanceFromCenter = Math.abs(cardCenterX - centerX);
                
                // Track which card is closest to center
                if (distanceFromCenter < closestDistance) {
                    closestDistance = distanceFromCenter;
                    const index = projects.findIndex(p => p.id === projectId);
                    if (index !== -1) closestIndex = index;
                }
                
                // Only apply transforms to cards within viewport + 1 card buffer
                const isInRange = cardRect.right > -200 && cardRect.left < window.innerWidth + 200;
                
                if (!isInRange) {
                    // Reset off-screen cards to default state
                    card.style.transform = 'scale(0.75) translate3d(0, 80px, 0)';
                    card.style.filter = 'grayscale(100%)';
                    card.style.opacity = '0.5';
                    return;
                }
                
                const maxDistance = containerRect.width / 2;
                const normalizedDistance = Math.min(distanceFromCenter / maxDistance, 1);
                
                // Scale: 1.0 at center, 0.75 at edges
                const scale = 1 - (normalizedDistance * 0.25);
                
                // Grayscale: 0% at center, 100% at edges
                const grayscale = normalizedDistance * 100;
                
                // Opacity: 1 at center, 0.5 at edges (clamped to prevent white cards)
                const opacity = Math.max(0.5, 1 - (normalizedDistance * 0.5));
                
                // Rotation: 0deg at center, ±8deg at edges (based on side)
                const rotation = (cardCenterX < centerX ? -1 : 1) * normalizedDistance * 8;
                
                // Vertical displacement: 0px at center, 80px lower at edges
                const translateY = normalizedDistance * 80;

                // Use translate3d for better hardware acceleration
                card.style.transform = `scale(${scale}) rotate(${rotation}deg) translate3d(0, ${translateY}px, 0)`;
                card.style.filter = `grayscale(${grayscale}%)`;
                card.style.opacity = `${opacity}`;
            });

            // Update current index if not actively scrolling
            if (!isScrollingRef.current && closestIndex !== currentIndex) {
                setCurrentIndex(closestIndex);
                setProgressKey(prev => prev + 1);
            }
        };

        const handleScroll = () => {
            if (rafId) {
                cancelAnimationFrame(rafId);
            }
            rafId = requestAnimationFrame(updateCardStyles);
        };

        // Update on scroll with RAF
        container.addEventListener('scroll', handleScroll, { passive: true });
        
        // Initial update
        updateCardStyles();
        
        // Update on window resize (debounced)
        let resizeTimeout: NodeJS.Timeout;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(updateCardStyles, 100);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            if (rafId) {
                cancelAnimationFrame(rafId);
            }
            container.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
            clearTimeout(resizeTimeout);
        };
    }, [projects, currentIndex]);

    // Auto-advance timer (only when visible)
    useEffect(() => {
        console.log('isVisible', isVisible);
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
        <div  className='relative w-full flex flex-col items-center justify-between md:px-6 bg-neutral-900 pt-10 pb-10' id='highlights'>
            <div className='relative w-full max-w-[1920px] flex flex-col items-center justify-between px-6 bg-neutral-900 gap-8'>
                <div className='max-w-[1600px] w-full text-5xl md:text-8xl text-left font-light self-start text-white mb-8 mt-20'>
                    MY TOPS
                </div>

                {/* Scroll Container with Edge Gradients */}
                <div className='relative w-full'>
                    {/* Left gradient overlay */}
                    <div className='absolute left-0 top-0 bottom-0 w-10 md:w-32 bg-linear-to-r from-neutral-900 to-transparent z-10 pointer-events-none' />
                    
                    {/* Right gradient overlay */}
                    <div className='absolute right-0 top-0 bottom-0 w-10 md:w-32 bg-linear-to-l from-neutral-900 to-transparent z-10 pointer-events-none' />
                    
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
                        
                        {projects.map((project, index) => (
                            <div
                                key={project.id}
                                ref={(el) => {
                                    if (el) {
                                        cardsRef.current.set(project.id, el);
                                    } else {
                                        cardsRef.current.delete(project.id);
                                    }
                                }}
                                onClick={() => {
                                    if (index === currentIndex) {
                                        // If card is centered, navigate to project page
                                        router.push(`/project/${project.documentId}`);
                                    } else {
                                        // If card is greyscaled (not centered), scroll to center
                                        setCurrentIndex(index);
                                        setProgressKey(prev => prev + 1);
                                        scrollToCard(index);
                                    }
                                }}
                                className='shrink-0 transition-all duration-300 ease-out'
                                style={{
                                    scrollSnapAlign: 'center',
                                    willChange: 'transform, opacity',
                                    backfaceVisibility: 'hidden',
                                    WebkitBackfaceVisibility: 'hidden',
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
                <div className='flex items-center gap-2 justify-center mt-4' ref={sectionRef}>
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
