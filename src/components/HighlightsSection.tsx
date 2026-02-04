"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import HighlightCard from "./HighlightCard";
import { fetchHighlightedProjects, type Project } from "@/lib/strapi";

const TIMER_DURATION = 5000;

export default function HighlightsSection() {
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(1);
    const [progressKey, setProgressKey] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<Map<number, HTMLDivElement>>(new Map());
    const isScrollingRef = useRef(false);
    const sectionRef = useRef<HTMLDivElement>(null);
    const hasInitializedRef = useRef(false);

    useEffect(() => {
        async function loadHighlightedProjects() {
            setIsLoading(true);
            const highlightedProjects = await fetchHighlightedProjects();

            setProjects(highlightedProjects);

            setIsLoading(false);
        }

        loadHighlightedProjects();
    }, []);

    useEffect(() => {
        const checkVisibility = () => {
            const carousel = scrollContainerRef.current;
            const target = carousel ?? sectionRef.current;
            if (!target) return;

            const rect = target.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            const sectionCenter = rect.top + rect.height / 2;
            const windowCenter = windowHeight / 2;
            const visible = Math.abs(sectionCenter - windowCenter) <= 200;

            if (visible && !isVisible) {
                setProgressKey(prev => prev + 1);
            }

            setIsVisible(visible);
        };

        checkVisibility();

        window.addEventListener('scroll', checkVisibility);
        window.addEventListener('resize', checkVisibility);

        return () => {
            window.removeEventListener('scroll', checkVisibility);
            window.removeEventListener('resize', checkVisibility);
        };
    }, [isVisible]);

    const scrollToCard = useCallback(
        (index: number, options?: { syncState?: boolean }) => {
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
            
            setTimeout(() => {
                isScrollingRef.current = false;
            }, 1000);
        }

        if (options?.syncState) {
            setCurrentIndex(index);
            setProgressKey(prev => prev + 1);
        }
    },
    [projects, setCurrentIndex, setProgressKey]);

    useEffect(() => {
        hasInitializedRef.current = false;
    }, [projects]);

    useEffect(() => {
        if (projects.length <= 1 || !isVisible || hasInitializedRef.current) {
            return;
        }

        hasInitializedRef.current = true;
        const timeoutId = setTimeout(() => {
            scrollToCard(1, { syncState: true });
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [projects, scrollToCard, isVisible]);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        let rafId: number | null = null;
        let lastScrollTime = 0;
        const THROTTLE_MS = 16;

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
                
                const distanceFromCenter = Math.abs(cardCenterX - centerX);
                
                if (distanceFromCenter < closestDistance) {
                    closestDistance = distanceFromCenter;
                    const index = projects.findIndex(p => p.id === projectId);
                    if (index !== -1) closestIndex = index;
                }
                
                const isInRange = cardRect.right > -200 && cardRect.left < window.innerWidth + 200;
                
                if (!isInRange) {
                    card.style.transform = 'scale(0.75) translate3d(0, 80px, 0)';
                    card.style.filter = 'grayscale(100%)';
                    card.style.opacity = '0.5';
                    return;
                }
                
                const maxDistance = containerRect.width / 2;
                const normalizedDistance = Math.min(distanceFromCenter / maxDistance, 1);
                
                const scale = 1 - (normalizedDistance * 0.25);
                
                const grayscale = normalizedDistance * 100;
                
                const opacity = Math.max(0.5, 1 - (normalizedDistance * 0.5));
                
                const rotation = (cardCenterX < centerX ? -1 : 1) * normalizedDistance * 8;
                
                const translateY = normalizedDistance * 80;

                card.style.transform = `scale(${scale}) rotate(${rotation}deg) translate3d(0, ${translateY}px, 0)`;
                card.style.filter = `grayscale(${grayscale}%)`;
                card.style.opacity = `${opacity}`;
            });

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

        container.addEventListener('scroll', handleScroll, { passive: true });
        
        updateCardStyles();
        
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
                        MY FAVORITES
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
                <div className='max-w-[1600px] w-full text-5xl md:text-8xl text-left font-light text-white mb-8 mt-20 self-center px-6'>
                    MY FAVORITES
                </div>

                <div className='relative w-full'>
                    <div className='absolute left-0 top-0 bottom-0 w-10 md:w-32 bg-linear-to-r from-neutral-900 to-transparent z-10 pointer-events-none' />
                    
                    <div className='absolute right-0 top-0 bottom-0 w-10 md:w-32 bg-linear-to-l from-neutral-900 to-transparent z-10 pointer-events-none' />
                    
                    <div
                        ref={scrollContainerRef}
                        className='flex gap-0.5 md:gap-1 overflow-x-auto py-8 px-4 md:px-8 no-scrollbar scroll-smooth'
                        style={{
                            scrollSnapType: 'x mandatory',
                        }}
                    >
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
                                        router.push(`/project/${project.documentId}`);
                                    } else {
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
                        
                        <div className='shrink-0 w-[calc(50vw-150px-0.0625rem)] md:w-[calc(50%-350px-0.125rem)]' />
                    </div>
                </div>

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
                                            className='absolute top-0 left-0 h-full bg-[#F7DB25]'
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
