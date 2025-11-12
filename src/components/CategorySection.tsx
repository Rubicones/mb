"use client";

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
    return (
        <div className='w-full flex flex-col gap-16 md:gap-20'>
            {/* 3D DESIGN Category */}
            {projects3D.length > 0 && (
                <div id="section-3d" className='w-full scroll-mt-20'>
                    <div className='mb-6 md:mb-8'>
                        <h2 className='text-6xl md:text-8xl font-light text-white mb-2 uppercase'>
                            3D DESIGN
                        </h2>
                        <p className='text-neutral-400 text-lg lg:text-xl'>
                            Modeling / Texturing / Animation / Render
                        </p>
                    </div>
                    <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4'>
                        {projects3D.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                </div>
            )}

            {/* 2D DESIGN Category */}
            {projects2D.length > 0 && (
                <div id="section-2d" className='w-full scroll-mt-20'>
                    <div className='mb-6 md:mb-8'>
                        <h2 className='text-6xl md:text-8xl font-light text-white mb-2 uppercase'>
                            2D DESIGN
                        </h2>
                        <p className='text-neutral-400 text-lg lg:text-xl'>
                            Design creation / Animation / Special effects
                        </p>
                    </div>
                    <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4'>
                        {projects2D.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                </div>
            )}

            {/* HANDCRAFT Category */}
            {projectsMulti.length > 0 && (
                <div id="section-hc" className='w-full scroll-mt-20'>
                    <div className='mb-6 md:mb-8'>
                        <h2 className='text-6xl md:text-8xl font-light text-white mb-2 uppercase'>
                            HANDCRAFT
                        </h2>
                        <p className='text-neutral-400 text-lg lg:text-xl'>
                            Design creation / Animation / Special effects
                        </p>
                    </div>
                    <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4'>
                        {projectsMulti.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
