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
        <Link href={`/project/${project.documentId}`} className='block'>
            <div className=' group cursor-pointer relative rounded-lg bg-transparent'>
            {project.Cover && (
                <div className='w-full aspect-[4/5] rounded-lg overflow-hidden relative'>
                    <Image
                        src={
                            project.Cover.url.startsWith("http")
                                ? project.Cover.url
                                : `https://authentic-splendor-f67c9d75a4.strapiapp.com${project.Cover.url}`
                        }
                        alt={project.Cover.alternativeText || project.Name}
                        fill
                        className='object-cover group-hover:scale-110 transition-transform duration-300'
                    />
                </div>
            )}
             {/* Hover Overlay - Always visible on mobile, hover on desktop */}
             <div className='absolute top-0 left-0 w-full h-full flex flex-col justify-end items-start gap-2 sm:gap-4 p-4 sm:p-6 rounded-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-hover:backdrop-blur-sm transition-all duration-300 z-40'>
                 {/* Mobile background overlay for text readability */}
                 <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent sm:hidden'></div>
                {/* Program Icons */}
                {project.Programs && project.Programs.length > 0 && (
                    <div className='flex flex-wrap gap-2 sm:gap-3 justify-center relative z-10'>
                        {project.Programs.map((program) => (
                            <div
                                key={program.id}
                                className='flex items-center gap-2'
                            >
                                {program.Icon && (
                                    <Image
                                        src={
                                            program.Icon.url.startsWith("http")
                                                ? program.Icon.url
                                                : `https://authentic-splendor-f67c9d75a4.strapiapp.com${program.Icon.url}`
                                        }
                                        alt={
                                            program.Icon.alternativeText ||
                                            program.Name
                                        }
                                         width={48}
                                         height={48}
                                        className='object-contain'
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                )}
                 <span className='text-white text-5xl font-bold uppercase drop-shadow-lg relative z-10'>{project.Name}</span>
            </div>
            </div>
        </Link>
    );
}
