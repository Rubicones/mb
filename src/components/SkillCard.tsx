"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import type { CSSProperties } from "react";
import SkillsSceneMobile from "./SkillsSceneMobile";
import Image from "next/image";

export default function SkillCard({
    title,
    path,
}: {
    title: string;
    path: string;
}) {
    const skillsRef = useRef<HTMLAnchorElement>(null);
    const [canvasSize, setCanvasSize] = useState(300);
    const [scrollProgress, setScrollProgress] = useState(0);

    const skillsData = {
        "3D": {
            title: "3D DESIGN",
            description:
                "I taught myself 3D design out of pure curiosity and eventually made it my profession.",
            tags: "3D modeling / texturing / animation / render / 3D modeling / texturing / animation / render /",
            images: [
                { path: "/blender.png", title: "Blender" },
                { path: "/cinema4D.png", title: "Cinema 4D" },
                {
                    path: "/Substance3Dpainter.png",
                    title: "Substance 3D Painter",
                },
            ],
        },
        "2D": {
            title: "2D DESIGN",
            description:
                "My education was closely related to 2D design, but later I significantly advanced and expanded my skills in this field.",
            tags: "design creation / animation / special effects / design creation / animation / special effects /",
            images: [
                { path: "/photoshop.png", title: "Photoshop" },
                { path: "/PremierePro.png", title: "Premiere Pro" },
                { path: "/After.png", title: "After Effects" },
                { path: "/Illustrator.png", title: "Illustrator" },
            ],
        },
        handcraft: {
            title: "CRAFT",
            description:
                "Despite my current focus on digital media, I've always been drawn to tangible, three-dimensional forms of self-expression. I believe that my experience with different materials and techniques has made me a more multifaceted artist and broadened my creative perspective.",
            tags: "blacksmith / woodwork / construction / blacksmith / woodwork / construction /",
            images: [
                { path: "/blacksmith.png", title: "Blacksmith" },
                { path: "/Carpentry.png", title: "Carpentery" },
            ],
        },
    };

    useEffect(() => {
        const updateSize = () => {
            const width = window.innerWidth;
            if (width > 1600) {
                setCanvasSize(1600 / 4);
            } else if (width > 1024) {
                // Tablet
                setCanvasSize(width / 4);
            } else {
                setCanvasSize(width / 1.5);
            }
        };

        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    // Scroll-based animation for mobile
    useEffect(() => {
        const handleScroll = () => {
            if (!skillsRef.current) return;

            const rect = skillsRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Calculate distance from center of viewport
            const elementCenter = rect.top + rect.height / 2;
            const viewportCenter = windowHeight / 2;
            const distanceFromCenter = viewportCenter - elementCenter;

            // Calculate scroll progress (0 to 1)
            let progress =
                (distanceFromCenter + windowHeight / 2) / windowHeight;
            progress = Math.max(0, Math.min(1, progress));

            // Create triangular wave: 0 -> 1 (at center) -> 0
            let animationProgress;
            if (progress <= 0.35) {
                animationProgress = progress / 0.35;
            } else if (progress <= 0.65) {
                animationProgress = 1;
            } else {
                animationProgress = (1 - progress) / 0.35;
            }

            setScrollProgress(animationProgress);
        };

        handleScroll(); // Initial call
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const skillKey = title as keyof typeof skillsData;
    const skill = skillsData[skillKey];

    const circleId = useMemo(
        () => `skill-circle-${title.replace(/\s+/g, "-").toLowerCase()}`,
        [title]
    );

    const circleDiameter = Math.round(canvasSize);
    const ringCoverage = canvasSize / circleDiameter;
    const ringRadius = Math.max(60, Math.min(95, ringCoverage * 100 + 12));
    const ringDiameter = ringRadius * 2;

    const circleTypographyMap: Record<
        keyof typeof skillsData,
        { fontSize: number; letterSpacing: number }
    > = {
        "3D": { fontSize: 8.3, letterSpacing: 1.82 },
        "2D": { fontSize: 8.3, letterSpacing: 1.73 },
        handcraft: { fontSize: 9, letterSpacing: 2.3 },
    };

    const circleTypography = circleTypographyMap[skillKey] ?? {
        fontSize: 10,
        letterSpacing: 1.5,
    };

    const ringStyle = useMemo(
        () =>
            ({
                width: circleDiameter,
                height: circleDiameter,
                "--skill-ring-font-size": `${circleTypography.fontSize}px`,
                "--skill-ring-letter-spacing": `${circleTypography.letterSpacing}px`,
            } as CSSProperties),
        [
            circleDiameter,
            circleTypography.fontSize,
            circleTypography.letterSpacing,
        ]
    );

    return (
        <a
            href={"/portfolio#" + title}
            ref={skillsRef}
            className={`skill-card bg-neutral-800 outline-2 outline-neutral-800 hover:outline-[#C8B936] grow relative w-full lg:w-auto  gap-6 md:mx-2 p-5 md:p-6 flex flex-col justify-start items-center rounded-4xl transition-all duration-300 group`}
            style={{
                // @ts-expect-error - CSS custom property
                "--card-scroll-progress": scrollProgress,
            }}
        >
            <h3
                className={`text-4xl text-nowrap md:text-4xl lg:text-4xl xl:text-6xl font-extralight text-white capitalize break-normal`}
            >
                {skill.title}
            </h3>
            <div
                className='relative flex items-center justify-center rounded-full'
                style={ringStyle}
            >
                <div
                    className='absolute inset-0 pointer-events-none skill-text-ring-wrapper'
                    style={{
                        animation: "skill-text-rotate 30s linear infinite",
                    }}
                >
                    <svg
                        className='skill-text-ring'
                        viewBox='0 0 200 200'
                        aria-hidden='true'
                        focusable='false'
                    >
                        <defs>
                            <path
                                id={circleId}
                                d={`M100,100 m-${ringRadius},0 a${ringRadius},${ringRadius} 0 1,1 ${ringDiameter},0 a${ringRadius},${ringRadius} 0 1,1 -${ringDiameter},0`}
                            />
                        </defs>
                        <text>
                            <textPath href={`#${circleId}`} startOffset='0'>
                                {skill.tags}
                            </textPath>
                        </text>
                    </svg>
                </div>
                <div
                    className='relative flex items-center justify-center rounded-full'
                    style={{
                        width: canvasSize,
                        height: canvasSize,
                    }}
                >
                    <SkillsSceneMobile
                        hoverContainerRef={skillsRef}
                        size={canvasSize}
                        path={path}
                    />
                </div>
            </div>
            <div className={`w-full flex flex-col justify-between gap-4`}>
                <div className='w-full h-full flex grow text-black text-2xl flex-col justify-end lg:justify-between gap-2 uppercase font-bold items-start lg:items-end mt-auto lg:flex-row flex-wrap'>
                    <div className='flex gap-4 items-center mt-4 w-full justify-center'>
                        {skillsData[
                            title as keyof typeof skillsData
                        ].images.map(
                            (
                                image: { path: string; title: string },
                                i: number
                            ) => (
                                <div
                                    className='skill-icon-wrapper relative'
                                    key={i}
                                    data-program-name={image.title}
                                    style={{
                                        // @ts-expect-error - CSS custom property
                                        "--scroll-progress": scrollProgress,
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className='skill-icon-inner rounded-xl p-1 border-2 border-transparent'>
                                        <Image
                                            width={50}
                                            height={50}
                                            src={image.path}
                                            alt={image.title}
                                        />
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
            <style jsx>{`
                .skill-card {
                    --skill-ring-color: rgba(255, 255, 255, 0.45);
                }
                .skill-card:hover,
                .skill-card:focus-visible {
                    --skill-ring-color: #c8b936;
                }
                @media (pointer: coarse) {
                    .skill-card {
                        --skill-ring-color: color-mix(
                            in srgb,
                            rgba(255, 255, 255, 0.45)
                                calc(
                                    100% -
                                        (var(--card-scroll-progress, 0) * 100%)
                                ),
                            #c8b936 calc(var(--card-scroll-progress, 0) * 100%)
                        );
                    }
                    .skill-card:hover,
                    .skill-card:focus-visible {
                        --skill-ring-color: color-mix(
                            in srgb,
                            rgba(255, 255, 255, 0.45)
                                calc(
                                    100% -
                                        (var(--card-scroll-progress, 0) * 100%)
                                ),
                            #c8b936 calc(var(--card-scroll-progress, 0) * 100%)
                        );
                    }
                }
                @keyframes skill-text-rotate {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
                .skill-text-ring-wrapper {
                    transform-origin: 50% 50%;
                }
                .skill-text-ring {
                    width: 100%;
                    height: 100%;
                }
                .skill-text-ring text {
                    fill: var(--skill-ring-color, currentColor);
                    font-size: var(--skill-ring-font-size, 10px);
                    letter-spacing: var(--skill-ring-letter-spacing, 1.5px);
                    text-transform: uppercase;
                    fill-opacity: 0.6;
                    transition: fill 0.3s ease;
                    font-weight: 500;
                }
            `}</style>
        </a>
    );
}
