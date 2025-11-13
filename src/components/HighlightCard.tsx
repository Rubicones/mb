import Image from "next/image";
import { getProjectCategoryLabel, resolveAssetUrl, type Project } from "@/lib/strapi";

interface HighlightCardProps {
    project: Pick<
        Project,
        "Name" | "Category" | "Date" | "Cover" | "documentId" | "type"
    >;
}

export default function HighlightCard({ project }: HighlightCardProps) {
    const coverUrl = resolveAssetUrl(project.Cover);

    if (!coverUrl) {
        return null;
    }

    const projectTypeLabel = project.type ?? "personal";

    return (
        <>
            <div className='hidden md:flex w-[700px] h-[550px] bg-black rounded-2xl justify-start overflow-hidden relative hover:outline-6 hover:outline-[#C8B936] transition-all duration-200 cursor-pointer'>
                <div className='relative w-2/3 h-full'>
                    <Image
                        src={coverUrl}
                        alt={project.Name}
                        fill
                        className='object-cover rounded-2xl'
                        unoptimized
                    />
                    <div className='absolute inset-0 flex flex-col justify-start p-6 rounded-l-2xl bg-linear-to-b from-black/80 via-transparent to-transparent z-40'>
                        <span className='text-white text-3xl lg:text-4xl xl:text-5xl font-semibold uppercase'>
                            {project.Name}
                        </span>
                    </div>
                </div>
                <div className='w-1/3 flex flex-col gap-4 font-light p-6 text-lg lg:text-xl bg-black'>
                    <div className='flex flex-col'>
                        <span className='text-neutral-500'>Category: </span>
                        <span className='text-white'>
                            {getProjectCategoryLabel(project.Category)}
                        </span>
                    </div>
                    <div className='flex flex-col'>
                        <span className='text-neutral-500'>Date: </span>
                        <span className='text-white'>{project.Date}</span>
                    </div>
                    <div className='flex flex-col'>
                        <span className='text-neutral-500'>Type: </span>
                        <span className='text-white capitalize'>{projectTypeLabel}</span>
                    </div>
                </div>
            </div>
            <div className='flex relative md:hidden w-[300px] aspect-[calc(9.5/16)] flex-col bg-black rounded-2xl justify-start overflow-hidden cursor-pointer'>
                <div className='absolute top-0 left-0 h-full w-full z-10'>
                    <Image
                        src={coverUrl}
                        alt={project.Name}
                        fill
                        className='object-cover rounded-2xl'
                        unoptimized
                    />
                    <div className='absolute inset-0 flex flex-col justify-start p-6 rounded-l-2xl bg-linear-to-b from-black/80 via-transparent to-transparent z-40'>
                        <span className='text-white text-3xl lg:text-4xl xl:text-5xl font-bold uppercase'>
                            {project.Name}
                        </span>
                    </div>
                </div>
                <div className='absolute -bottom-[2px] rounded-xl w-[calc(100%+2px)] h-1/3 flex flex-col gap-4 font-light p-6 text-base lg:text-xl bg-[#141414] z-20 flex-wrap'>
                    <div className='flex flex-col'>
                        <span className='text-neutral-500'>Category: </span>
                        <span className='text-white'>
                            {getProjectCategoryLabel(project.Category)}
                        </span>
                    </div>
                    <div className='flex flex-col'>
                        <span className='text-neutral-500'>Date: </span>
                        <span className='text-white'>{project.Date}</span>
                    </div>
                    <div className='flex flex-col'>
                        <span className='text-neutral-500'>Type: </span>
                        <span className='text-white capitalize'>{projectTypeLabel}</span>
                    </div>
                </div>
            </div>
        </>
    );
}
