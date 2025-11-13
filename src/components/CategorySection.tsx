"use client";

import ProjectCard from "./ProjectCard";
import { Project } from "@/lib/strapi";

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
    const sortByPriority = (projects: Project[]) =>
        [...projects].sort((a, b) => {
            const priorityA =
                typeof a.priority === "number" ? a.priority : Number.MAX_SAFE_INTEGER;
            const priorityB =
                typeof b.priority === "number" ? b.priority : Number.MAX_SAFE_INTEGER;

            if (priorityA === priorityB) {
                return a.Name.localeCompare(b.Name);
            }

            return priorityA - priorityB;
        });

    const sortedProjects3D = sortByPriority(projects3D);
    const sortedProjects2D = sortByPriority(projects2D);
    const sortedProjectsMulti = sortByPriority(projectsMulti);

    return (
        <div className='w-full flex flex-col gap-16 md:gap-20'>
            {sortedProjects3D.length > 0 && (
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
                        {sortedProjects3D.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                </div>
            )}

            {sortedProjects2D.length > 0 && (
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
                        {sortedProjects2D.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                </div>
            )}

            {sortedProjectsMulti.length > 0 && (
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
                        {sortedProjectsMulti.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
