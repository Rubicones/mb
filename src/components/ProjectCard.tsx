import Image from "next/image";
import Link from "next/link";
import { resolveAssetUrl, type Project } from "@/lib/strapi";

interface ProjectCardProps {
    project: Pick<Project, "id" | "documentId" | "Name" | "Cover">;
}

export default function ProjectCard({ project }: ProjectCardProps) {
    return (
        <Link href={`/project/${project.documentId}`} className='block group'>
            <div className='relative w-full aspect-3/4 overflow-hidden rounded-2xl'>
                {project.Cover && (
                    <Image
                        src={resolveAssetUrl(project.Cover)}   
                        alt={project.Cover.alternativeText || project.Name}
                        fill
                        className='object-cover transition-transform duration-300 group-hover:scale-105'
                    />
                )}
                
                <div className='absolute top-0 left-0 w-full h-full flex flex-col justify-end items-start gap-2 touch:gap-4 mouse:gap-4 p-4 touch:p-2 mouse:p-6 opacity-100 mouse:opacity-0 mouse:group-hover:opacity-100 transition-all duration-300 z-40'>
                    <div className='absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent touch:block mouse:hidden'></div>
                    <div className='absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent opacity-0 mouse:group-hover:opacity-100 transition-opacity duration-300'></div>
                    
                    <span className='text-white text-3xl lg:text-4xl xl:text-5xl font-semibold uppercase drop-shadow-lg relative z-10'>{project.Name}</span>
                </div>
            </div>
        </Link>
    );
}
