"use client";

import { useEffect, useState, useRef, useCallback } from "react";

type ScrollContext =
    | { type: "element"; node: HTMLElement }
    | { type: "window"; node: Window };

type ScrollMetrics = {
    scrollTop: number;
    clientHeight: number;
    scrollTo: (options: ScrollToOptions) => void;
    getRelativeTop: (element: HTMLElement) => number;
};

const getScrollContext = (): ScrollContext | null => {
    if (typeof window === "undefined" || typeof document === "undefined") {
        return null;
    }

    const container = document.querySelector<HTMLElement>(".scrollContainer");

    if (container) {
        const styles = window.getComputedStyle(container);
        const hasScrollableContent =
            container.scrollHeight > container.clientHeight + 1;
        const overflowAllowsScroll = ["auto", "scroll"].includes(
            styles.overflowY
        );

        if (hasScrollableContent && overflowAllowsScroll) {
            return { type: "element", node: container };
        }
    }

    return { type: "window", node: window };
};

const getScrollMetrics = (context: ScrollContext): ScrollMetrics => {
    if (context.type === "element") {
        const container = context.node;
        const containerRect = container.getBoundingClientRect();

        return {
            scrollTop: container.scrollTop,
            clientHeight: container.clientHeight,
            scrollTo: (options: ScrollToOptions) => container.scrollTo(options),
            getRelativeTop: (element: HTMLElement) => {
                const elementRect = element.getBoundingClientRect();
                return (
                    container.scrollTop + (elementRect.top - containerRect.top)
                );
            },
        };
    }

    const scrollElement = document.scrollingElement ?? document.documentElement;
    const currentScrollTop = window.scrollY ?? scrollElement.scrollTop;

    return {
        scrollTop: currentScrollTop,
        clientHeight: window.innerHeight,
        scrollTo: (options: ScrollToOptions) => window.scrollTo(options),
        getRelativeTop: (element: HTMLElement) => {
            const elementRect = element.getBoundingClientRect();
            return (
                (window.scrollY ?? scrollElement.scrollTop) + elementRect.top
            );
        },
    };
};

interface AnchorNavigationProps {
    sections: {
        id: string;
        label: string;
        scrollTo: "header" | "section";
    }[];
}

export default function AnchorNavigation({ sections }: AnchorNavigationProps) {
    const [activeSection, setActiveSection] = useState<string>(
        sections[0]?.id || ""
    );
    const [activeDividerIndex, setActiveDividerIndex] = useState<number>(-1);
    const [isTouching, setIsTouching] = useState(false);
    const [touchHoverIndex, setTouchHoverIndex] = useState<number>(-1);
    const lastVibratedIndex = useRef<number>(-1);
    const navRef = useRef<HTMLDivElement>(null);
    const [scrollContext, setScrollContext] = useState<ScrollContext | null>(
        null
    );
    const dragTimeoutRef = useRef<number | null>(null);
    const initialScrollHandledRef = useRef<boolean>(false);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const updateContext = () => {
            setScrollContext(getScrollContext());
        };

        updateContext();
        window.addEventListener("resize", updateContext);

        return () => {
            window.removeEventListener("resize", updateContext);
        };
    }, []);

    useEffect(() => {
        if (!scrollContext) return;

        const target =
            scrollContext.type === "element" ? scrollContext.node : window;

        const handleScroll = () => {
            const metrics = getScrollMetrics(scrollContext);

            const centerOffset = metrics.clientHeight / 2;
            const scrollPosition = metrics.scrollTop + centerOffset;

            if (metrics.scrollTop < 50) {
                setActiveSection(sections[0]?.id || "");
                setActiveDividerIndex(-1);
                return;
            }

            let activeDivider = -1;
            let foundMatch = false;

            for (let i = sections.length - 1; i >= 0; i--) {
                const sectionElement = document.getElementById(sections[i].id);
                if (sectionElement && !foundMatch) {
                    const header = sectionElement.querySelector(
                        "h2"
                    ) as HTMLElement | null;
                    const projectsContainer = sectionElement.querySelector(
                        ".grid"
                    ) as HTMLElement | null;

                    if (header && projectsContainer) {
                        const headerPosition = metrics.getRelativeTop(header);
                        const projectsPosition =
                            metrics.getRelativeTop(projectsContainer);

                        if (scrollPosition >= headerPosition) {
                            foundMatch = true;

                            if (
                                scrollPosition >= projectsPosition &&
                                i < sections.length - 1
                            ) {
                                activeDivider = i;
                                setActiveSection("");
                            } else {
                                setActiveSection(sections[i].id);
                            }
                        }
                    } else {
                        const sectionTop =
                            metrics.getRelativeTop(sectionElement);
                        if (scrollPosition >= sectionTop) {
                            foundMatch = true;
                            setActiveSection(sections[i].id);
                        }
                    }
                }
            }

            setActiveDividerIndex(activeDivider);
        };

        handleScroll();
        target.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            target.removeEventListener("scroll", handleScroll);
        };
    }, [sections, scrollContext]);

    const scrollToSection = useCallback(
        (
            sectionId: string,
            scrollTo: "header" | "section",
            smooth: boolean = true
        ) => {
            const context = scrollContext ?? getScrollContext();
            if (!context) return;

            const metrics = getScrollMetrics(context);

            if (scrollTo === "header") {
                metrics.scrollTo({
                    top: 0,
                    behavior: smooth ? "smooth" : "auto",
                });
            } else {
                const element = document.getElementById(sectionId);
                if (element) {
                    const headerOffset = context.type === "window" ? 120 : 80;
                    const elementPosition = metrics.getRelativeTop(element);
                    const offsetPosition = elementPosition - headerOffset;

                    metrics.scrollTo({
                        top: Math.max(offsetPosition, 0),
                        behavior: smooth ? "smooth" : "auto",
                    });
                }
            }

            setActiveSection(sectionId);
        },
        [scrollContext]
    );

    const handleClick = useCallback(
        (sectionId: string, scrollTo: "header" | "section") => {
            scrollToSection(sectionId, scrollTo, true);
        },
        [scrollToSection]
    );

    useEffect(() => {
        if (initialScrollHandledRef.current) return;
        if (!scrollContext) return;
        if (typeof window === "undefined") return;

        const params = new URLSearchParams(window.location.search);
        const targetMap = new Map<string, string>([
            ["3d", "section-3d"],
            ["2d", "section-2d"],
            ["craft", "section-hc"],
        ]);

        let matchedKey: string | null = null;

        params.forEach((value, key) => {
            const normalizedKey = key.toLowerCase();
            const normalizedValue = value.toLowerCase();

            if (matchedKey) {
                return;
            }

            if (targetMap.has(normalizedKey)) {
                matchedKey = normalizedKey;
                return;
            }

            if (targetMap.has(normalizedValue)) {
                matchedKey = normalizedValue;
            }
        });

        if (!matchedKey) {
            initialScrollHandledRef.current = true;
            return;
        }

        const targetId = targetMap.get(matchedKey);

        if (!targetId) {
            initialScrollHandledRef.current = true;
            return;
        }

        const targetSection = sections.find(
            (section) => section.id === targetId
        );
        const scrollMode = targetSection?.scrollTo ?? "section";

        const performScroll = () => {
            scrollToSection(targetId, scrollMode, true);
        };

        window.requestAnimationFrame(() => {
            window.setTimeout(performScroll, 120);
        });

        initialScrollHandledRef.current = true;
    }, [scrollContext, sections, scrollToSection]);

    const handleTouchStart = () => {
        if (dragTimeoutRef.current) {
            clearTimeout(dragTimeoutRef.current);
        }

        dragTimeoutRef.current = window.setTimeout(() => {
            setIsTouching(true);
            lastVibratedIndex.current = -1;

            if (typeof window !== "undefined" && navigator.vibrate) {
                navigator.vibrate(30);
            }
        }, 120);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!navRef.current) return;

        if (!isTouching) {
            if (dragTimeoutRef.current) {
                clearTimeout(dragTimeoutRef.current);
                dragTimeoutRef.current = null;
            }

            setIsTouching(true);
        }

        e.preventDefault();

        const touch = e.touches[0];
        const navRect = navRef.current.getBoundingClientRect();
        const relativeY = touch.clientY - navRect.top;
        const sectionHeight = navRect.height / sections.length;
        const hoveredIndex = Math.floor(relativeY / sectionHeight);

        if (hoveredIndex >= 0 && hoveredIndex < sections.length) {
            setTouchHoverIndex(hoveredIndex);

            if (hoveredIndex !== lastVibratedIndex.current) {
                try {
                    if (typeof window !== "undefined" && navigator.vibrate) {
                        navigator.vibrate(30);
                    }
                } catch {}

                lastVibratedIndex.current = hoveredIndex;

                const section = sections[hoveredIndex];
                scrollToSection(section.id, section.scrollTo, false);
            }
        }
    };

    const handleTouchEnd = () => {
        if (dragTimeoutRef.current) {
            clearTimeout(dragTimeoutRef.current);
            dragTimeoutRef.current = null;
        }

        setIsTouching(false);
        setTouchHoverIndex(-1);
        lastVibratedIndex.current = -1;
    };

    return (
        <div className='fixed right-2 md:right-4 top-1/2 -translate-y-1/2 md:top-1/3 md:-translate-y-1/3 z-100 pointer-events-auto'>
            <nav
                ref={navRef}
                className={`
                    bg-neutral-800/40 backdrop-blur-md rounded-full
                    py-3 pl-3 pr-2 md:py-4 md:pl-4 md:pr-2.5
                    flex flex-col items-end gap-0
                    ${isTouching ? "scale-110 bg-neutral-800/60" : ""}
                    transition-all duration-150
                    select-none
                `}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
            >
                {sections.map((section, index) => {
                    const isActive =
                        activeSection === section.id ||
                        (isTouching && touchHoverIndex === index);
                    return (
                        <div
                            key={`${section.id}-${index}`}
                            className={`
                                flex flex-col w-full transition-all duration-300
                                ${isActive ? "items-center" : "items-end"}
                            `}
                        >
                            <button
                                onClick={() =>
                                    handleClick(section.id, section.scrollTo)
                                }
                                className={`
                                    py-1.5 md:py-2
                                    text-xs md:text-sm font-medium
                                    transition-all duration-300 w-full
                                    ${
                                        isActive
                                            ? "text-center text-yellow-400 px-1.5 md:px-2.5"
                                            : "text-right text-neutral-400 md:hover:text-neutral-200 pr-1 pl-2 md:pr-1.5 md:pl-3.5"
                                    }
                                    ${
                                        isTouching && touchHoverIndex === index
                                            ? "scale-110"
                                            : ""
                                    }
                                `}
                                style={{
                                    textShadow: "0 1px 3px rgba(0, 0, 0, 0.45)",
                                }}
                            >
                                {section.label}
                            </button>
                            {index < sections.length - 1 && (
                                <div
                                    className={`
                                        w-6 md:w-7 h-px my-1.5 md:my-2 transition-all duration-300
                                        ${isActive ? "mr-0" : "mr-1 md:mr-1.5"}
                                        ${
                                            activeDividerIndex === index ||
                                            (isTouching &&
                                                touchHoverIndex === index)
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
