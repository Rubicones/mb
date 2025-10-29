"use client";

import { useEffect } from "react";
import ProjectCard from "./ProjectCard";

interface StrapiImage {
    id: number;
    url: string;
    alternativeText: string | null;
    name: string;
}

interface MediaItem {
    id: number;
    Comment: string;
    image?: StrapiImage;
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
    Cover: StrapiImage;
    Content: "youtube" | "spline" | "none";
    SplineLink: string | null;
    ytLink: string | null;
    Category: "c_3D" | "c_2D" | "c_Craft";
    Media: MediaItem[];
    Programs: Program[];
}

interface CategorySectionProps {
    projects3D: Project[];
    projects2D: Project[];
    projectsMulti: Project[];
}

export default function CategorySection({
    projects3D,
    projects2D,
    projectsMulti,
}: CategorySectionProps) {
    useEffect(() => {
        const categories = document.querySelectorAll(".category");
        categories.forEach((category) => {
            console.log(category);
            category.addEventListener("click", () => {
                if (category.classList.contains("category-name-3d")) {
                    document
                        .querySelector(".category-3d")
                        ?.scrollIntoView({ behavior: "smooth", block: "end" });
                } else if (category.classList.contains("category-name-2d")) {
                    document
                        .querySelector(".category-2d")
                        ?.scrollIntoView({ behavior: "smooth", block: "end" });
                } else if (category.classList.contains("category-name-craft")) {
                    document
                        .querySelector(".category-craft")
                        ?.scrollIntoView({ behavior: "smooth", block: "end" });
                }
            });
        });
    }, []);

    return (
        <>
            {/* 3D DESIGN Category */}
            <h2 className='p-2 px-6 rounded-t-xl w-full border-t-4 border-l-4 border-r-4 border-neutral-700 bg-neutral-800 pb-2 category category-name-2d sticky mt-6 bottom-8 md:bottom-10 lg:bottom-15 h-16 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white'>
                3D DESIGN
            </h2>
            {projects3D.length > 0 && (
                <div className='w-full border-b-4 border-l-4 border-r-4 border-neutral-700 category-2d bg-neutral-800 rounded-b-xl p-6' id='3D'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'>
                        {projects3D.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                </div>
            )}
            <div className='p-2 px-6 rounded-t-xl w-full border-t-4 border-l-4 border-r-4 border-neutral-700 bg-neutral-800 pb-2 category category-name-2d sticky mt-6 bottom-12 md:bottom-15 lg:bottom-[62px] h-16 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white'>
                2D DESIGN
            </div>
            {/* 2D DESIGN Category */}
            {projects2D.length > 0 && (
                <div className='w-full border-b-4 border-l-4 border-r-4 border-neutral-700 category-2d bg-neutral-800 rounded-b-xl p-6' id='2D'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'>
                        {projects2D.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                </div>
            )}
            <div className='p-2 px-6 rounded-t-xl w-full border-t-4 border-l-4 border-r-4 border-neutral-700 bg-neutral-800 pb-2 category category-name-2d sticky mt-6 -bottom-[2px] h-16 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white'>
            HANDCRAFT
            </div>
            {/* MULTIDISCIPLINAR Category */}
            {projectsMulti.length > 0 && (
                <div className='w-full border-b-4 border-l-4 border-r-4 border-neutral-700 category-craft bg-neutral-800 rounded-b-xl p-6' id='handcraft'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'>
                        {projectsMulti.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
