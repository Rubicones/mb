"use client";

import { useEffect, useState, useRef } from "react";

interface AnchorNavigationProps {
    sections: {
        id: string;
        label: string;
        scrollTo: "header" | "section";
    }[];
}

export default function AnchorNavigation({ sections }: AnchorNavigationProps) {
    const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || "");
    const [activeDividerIndex, setActiveDividerIndex] = useState<number>(-1);
    const [isTouching, setIsTouching] = useState(false);
    const [touchHoverIndex, setTouchHoverIndex] = useState<number>(-1);
    const lastVibratedIndex = useRef<number>(-1);
    const navRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Find the scrollable container
        const scrollContainer = document.querySelector('main');
        
        const handleScroll = () => {
            if (!scrollContainer) return;
            
            // Calculate scroll position relative to center of screen
            const centerOffset = scrollContainer.clientHeight / 2;
            const scrollPosition = scrollContainer.scrollTop + centerOffset;

            // Check if we're at the top
            if (scrollContainer.scrollTop < 50) {
                setActiveSection(sections[0]?.id || "");
                setActiveDividerIndex(-1);
                return;
            }

            // Find which section is currently in view based on headers
            let activeDivider = -1;
            let foundMatch = false;
            
            for (let i = sections.length - 1; i >= 0; i--) {
                const sectionElement = document.getElementById(sections[i].id);
                if (sectionElement && scrollContainer && !foundMatch) {
                    // Get the header (h2) and the projects container (grid)
                    const header = sectionElement.querySelector('h2') as HTMLElement;
                    const projectsContainer = sectionElement.querySelector('.grid') as HTMLElement;
                    
                    if (header && projectsContainer) {
                        // Get absolute position relative to the scrollable container
                        const scrollContainerRect = scrollContainer.getBoundingClientRect();
                        const headerRect = header.getBoundingClientRect();
                        const projectsRect = projectsContainer.getBoundingClientRect();
                        
                        // Calculate position of elements relative to scroll container top
                        const headerPosition = scrollContainer.scrollTop + (headerRect.top - scrollContainerRect.top);
                        const projectsPosition = scrollContainer.scrollTop + (projectsRect.top - scrollContainerRect.top);
                        
                        // If header has passed the center, this is the active section
                        if (scrollPosition >= headerPosition) {
                            foundMatch = true;
                            
                            // If projects container has also passed center, highlight divider instead
                            if (scrollPosition >= projectsPosition && i < sections.length - 1) {
                                activeDivider = i;
                                setActiveSection("");  // Don't highlight header text
                            } else {
                                setActiveSection(sections[i].id);  // Highlight header text
                            }
                        }
                    } else {
                        // Fallback if elements not found
                        const sectionTop = sectionElement.offsetTop - scrollContainer.offsetTop;
                        if (scrollPosition >= sectionTop) {
                            foundMatch = true;
                            setActiveSection(sections[i].id);
                        }
                    }
                }
            }

            setActiveDividerIndex(activeDivider);
        };

        if (scrollContainer) {
            scrollContainer.addEventListener("scroll", handleScroll);
            handleScroll(); // Initial check
        }

        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener("scroll", handleScroll);
            }
        };
    }, [sections, activeSection]);

    const scrollToSection = (sectionId: string, scrollTo: "header" | "section", smooth: boolean = true) => {
        const scrollContainer = document.querySelector('main');
        if (!scrollContainer) return;

        if (scrollTo === "header") {
            // Scroll to top of the container
            scrollContainer.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
        } else {
            // Scroll to the section
            const element = document.getElementById(sectionId);
            if (element) {
                const headerOffset = 80; // Adjust based on your header height
                const elementPosition = element.offsetTop - scrollContainer.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                scrollContainer.scrollTo({
                    top: offsetPosition,
                    behavior: smooth ? "smooth" : "auto",
                });
            }
        }
        setActiveSection(sectionId);
    };

    const handleClick = (sectionId: string, scrollTo: "header" | "section") => {
        scrollToSection(sectionId, scrollTo, true);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        // Prevent pull-to-refresh and other default browser behaviors
        e.preventDefault();
        setIsTouching(true);
        lastVibratedIndex.current = -1;
        
        // Vibrate on touch start - this is a user gesture so it should work
        try {
            if (typeof window !== "undefined" && navigator.vibrate) {
                // Use shorter vibration for better UX
                navigator.vibrate(30);
            }
        } catch {
            // Silently fail if vibration not supported
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!navRef.current || !isTouching) return;
        
        // Prevent pull-to-refresh and scrolling
        e.preventDefault();

        const touch = e.touches[0];
        const navRect = navRef.current.getBoundingClientRect();
        const relativeY = touch.clientY - navRect.top;
        
        // Calculate which section index the finger is hovering over
        const sectionHeight = navRect.height / sections.length;
        const hoveredIndex = Math.floor(relativeY / sectionHeight);
        
        if (hoveredIndex >= 0 && hoveredIndex < sections.length) {
            setTouchHoverIndex(hoveredIndex);
            
            // Vibrate when crossing into a new section
            // This is still within the user gesture context from touchstart
            if (hoveredIndex !== lastVibratedIndex.current) {
                try {
                    if (typeof window !== "undefined" && navigator.vibrate) {
                        // Chrome for Android requires user gesture (touchstart counts)
                        // Subsequent vibrations during the same touch interaction should work
                        navigator.vibrate(30);
                    }
                } catch {
                    // Silently fail
                }
                
                lastVibratedIndex.current = hoveredIndex;
                
                // Scroll to the hovered section
                const section = sections[hoveredIndex];
                scrollToSection(section.id, section.scrollTo, false);
            }
        }
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        e.preventDefault();
        setIsTouching(false);
        setTouchHoverIndex(-1);
        lastVibratedIndex.current = -1;
    };

    return (
        <div className="fixed right-2 md:right-4 top-1/2 -translate-y-1/2 z-[100] pointer-events-auto">
            <nav 
                ref={navRef}
                className={`
                    bg-neutral-800/40 backdrop-blur-md rounded-full 
                    py-3 pl-3 pr-2 md:py-4 md:pl-4 md:pr-2.5 
                    flex flex-col items-end gap-0
                    ${isTouching ? 'scale-110 bg-neutral-800/60' : ''}
                    transition-all duration-150
                    touch-none select-none
                `}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
            >
                {sections.map((section, index) => {
                    const isActive = activeSection === section.id || (isTouching && touchHoverIndex === index);
                    return (
                        <div 
                            key={`${section.id}-${index}`} 
                            className={`
                                flex flex-col w-full transition-all duration-300
                                ${isActive ? 'items-center' : 'items-end'}
                            `}
                        >
                        <button
                            onClick={() => handleClick(section.id, section.scrollTo)}
                            className={`
                                py-1.5 md:py-2 
                                text-xs md:text-sm font-medium 
                                transition-all duration-300 w-full
                                ${isActive ? 'text-center text-yellow-400 px-1.5 md:px-2.5' : 'text-right text-neutral-400 md:hover:text-neutral-200 pr-1 pl-2 md:pr-1.5 md:pl-3.5'}
                                ${isTouching && touchHoverIndex === index ? 'scale-110' : ''}
                            `}
                        >
                            {section.label}
                        </button>
                            {index < sections.length - 1 && (
                                <div 
                                    className={`
                                        w-6 md:w-7 h-px my-1.5 md:my-2 transition-all duration-300
                                        ${isActive ? 'mr-0' : 'mr-1 md:mr-1.5'}
                                        ${
                                            activeDividerIndex === index || (isTouching && touchHoverIndex === index)
                                                ? "bg-yellow-400"
                                                : "bg-neutral-600"
                                        }
                                    `}
                                ></div>
                            )}
                        </div>
                    );
                })}
            </nav>
        </div>
    );
}

