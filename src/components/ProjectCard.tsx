import Image from "next/image";
import Link from "next/link";

interface StrapiImage {
    id: number;
    url: string;
    alternativeText: string | null;
    name: string;
}

interface Program {
    id: number;
    Name: string;
    Icon?: StrapiImage;
}

interface ProjectCardProps {
    project: {
        id: number;
        documentId: string;
        Name: string;
        Cover: StrapiImage;
        Programs: Program[];
    };
}

export default function ProjectCard({ project }: ProjectCardProps) {
    return (
        <Link href={`/project/${project.documentId}`} className='block group'>
            <div className='relative w-full aspect-3/4 overflow-hidden rounded-2xl'>
                {project.Cover && (
                    <Image
                        src={
                            project.Cover.url.startsWith("http")
                                ? project.Cover.url
                                : `https://mb-portfolio.fly.dev${project.Cover.url}`
                        }   
                        alt={project.Cover.alternativeText || project.Name}
                        fill
                        className='object-cover transition-transform duration-300 group-hover:scale-105'
                    />
                )}
                
                {/* Hover Overlay - Always visible on touch devices, hover on mouse devices */}
                <div className='absolute top-0 left-0 w-full h-full flex flex-col justify-end items-start gap-2 touch:gap-4 mouse:gap-4 p-4 touch:p-2 mouse:p-6 opacity-100 mouse:opacity-0 mouse:group-hover:opacity-100 transition-all duration-300 z-40'>
                    {/* Touch device background overlay for text readability */}
                    <div className='absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent touch:block mouse:hidden'></div>
                    <div className='absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent opacity-0 mouse:group-hover:opacity-100 transition-opacity duration-300'></div>
                    
                    <span className='text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold uppercase drop-shadow-lg relative z-10'>{project.Name}</span>
                </div>
            </div>
        </Link>
    );
}
