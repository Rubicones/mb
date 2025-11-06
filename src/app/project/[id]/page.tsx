import Header from "@/components/Header";
import Gallery from "@/components/Gallery";
import Image from "next/image";
import Link from "next/link";
import Spline from "@splinetool/react-spline/next";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import Footer from "@/components/Footer";
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
    nextProject?: {
        documentId: string;
        Name: string;
        Cover: StrapiImage;
    };
    prevProject?: {
        documentId: string;
        Name: string;
        Cover: StrapiImage;
    };
}

interface StrapiResponse {
    data: Project;
}

async function getProject(id: string): Promise<Project | null> {
    try {
        const response = await fetch(
            `https://mb-portfolio.fly.dev/api/projects/${id}?populate[Media][populate]=*&populate[Programs][populate]=*&populate=Cover&populate[nextProject][populate]=*&populate[prevProject][populate]=*`,
            {
                next: { revalidate: 60 },
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            console.error(
                `Error fetching project ${id}:`,
                response.status,
                response.statusText
            );
            return null;
        }

        const data: StrapiResponse = await response.json();
        console.log(data);
        return data.data;
    } catch (error) {
        console.error(`Error fetching project ${id}:`, error);
        return null;
    }
}

export default async function ProjectDetail({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const project = await getProject(id);

    if (!project) {
        return (
            <div className='min-h-screen bg-gray-100'>
                <Header />
                <div className='flex items-center justify-center h-96'>
                    <div className='text-center'>
                        <h1 className='text-4xl font-bold text-gray-800 mb-4'>
                            Project Not Found
                        </h1>
                        <Link
                            href='/portfolio'
                            className='text-blue-600 hover:text-blue-800 underline'
                        >
                            ← Back to Portfolio
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-neutral-900 overflow-x-hidden'>
            <main className='w-screen h-full flex justify-center bg-neutral-900'>
                <div className='w-full max-w-[1920px] flex flex-col items-center justify-between bg-neutral-900 px-6'>
                    <Header />

                    <div className='z-50 w-full flex md:justify-between justify-start gap-4 md:gap-8 flex-wrap mt-6  bg-neutral-900 px-4'>
                        <a
                            href='/portfolio'
                            className='w-full flex justify-start items-center text-neutral-700 gap-2'
                        >
                            <ArrowLeft /> Back to portfolio
                        </a>

                        <div className='w-full flex flex-col'>
                            <span className='text-6xl md:text-7xl lg:text-8xl font-bold text-white w-full md:w-[65%]'>
                                {project.Name}
                            </span>
                            {!project.SplineLink && !project.ytLink && (
                                <div className=' w-full mt-6 h-full flex justify-start items-start gap-2 flex-col'>
                                    <span className='text-white text-2xl'>
                                        {project.Description}
                                    </span>
                                </div>
                            )}
                            {project.Programs.length > 0 && (
                                <>
                                    <span className='text-neutral-500 text-2xl font-extralight mt-6'>
                                        Made with:
                                    </span>
                                    <div className='flex w-full gap-2 items-center justify-start'>
                                        {project.Programs.map((program) => (
                                            <div
                                                key={program.id}
                                                className='flex items-center justify-between'
                                            >
                                                <Image
                                                    src={
                                                        "https://mb-portfolio.fly.dev" +
                                                            program.Icon?.url ||
                                                        ""
                                                    }
                                                    alt={program.Name}
                                                    width={52}
                                                    height={52}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        <div className='w-full flex md:justify-around justify-start gap-10 flex-wrap mt-4 text-black'>
                            <div className='grow flex flex-col gap-2'>
                                <span className='text-xl text-[#C8B936] '>
                                    Category
                                </span>
                                <span className='text-white text-xl font-bold'>
                                    {project.Category.slice(2)}
                                </span>
                            </div>
                            <div className='flex justify-between gap-10'>
                                <div className='flex flex-col gap-2'>
                                    <span className='text-xl text-[#C8B936] '>
                                        Date
                                    </span>
                                    <span className='text-white text-xl font-bold'>
                                        {project.Date}
                                    </span>
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <span className='text-xl text-[#C8B936] '>
                                        Type
                                    </span>
                                    <span className='text-white text-xl font-bold'>
                                        Here
                                    </span>
                                </div>
                            </div>
                        </div>
                        {(project.ytLink || project.SplineLink) && (
                            <div className='w-full flex flex-col md:flex-row justify-between gap-10 mt-12'>
                                <div className=' w-full md:w-1/2 h-full flex justify-start items-start gap-2 flex-col'>
                                    <span className='text-neutral-500 text-3xl font-extralight'>
                                        Preview
                                    </span>
                                    <div className=' w-full h-full flex justify-start items-center z-50'>
                                        {project.Content === "youtube" && (
                                            <iframe
                                                className='w-full aspect-video'
                                                src={
                                                    "https://www.youtube.com/embed/-zaMDDio_NU?si=j5zHyc8d257Aze5A}"
                                                }
                                                title='YouTube video player'
                                                frameBorder='0'
                                                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                                                referrerPolicy='strict-origin-when-cross-origin'
                                                allowFullScreen
                                            ></iframe>
                                        )}
                                        {project.Content === "spline" && (
                                            <Spline
                                                scene={project.SplineLink || ""}
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className=' w-full md:w-1/2 h-full flex justify-start items-start gap-2 flex-col'>
                                    <span className='text-neutral-500 text-3xl font-extralight'>
                                        Description
                                    </span>
                                    <span className='text-white text-2xl'>
                                        {project.Description}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Gallery Section */}
                        <Gallery media={project.Media} />

                        {/* Project Navigation Section */}
                        <div className='w-full mt-16 mb-8'>
                            <div className='grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6'>
                                {/* Back to Portfolio Card - Hidden on mobile */}
                                <Link
                                    href='/portfolio'
                                    className='hidden md:flex group relative h-96 bg-neutral-800 hover:bg-neutral-700 rounded-xl overflow-hidden flex-col items-center justify-center gap-2 transition-all duration-300'
                                >
                                    <ChevronLeft
                                        className='w-8 h-8 text-white'
                                        strokeWidth={2}
                                    />
                                    <div className='text-white text-xl font-medium text-center'>
                                        <div>Back to</div>
                                        <div>Portfolio</div>
                                    </div>
                                </Link>

                                {/* Previous Project Card */}
                                {project.prevProject && (
                                    <Link
                                        href={`/project/${project.prevProject.documentId}`}
                                        className='group relative h-80 md:h-96 rounded-xl overflow-hidden hover:opacity-90 transition-all duration-300'
                                    >
                                        <div className='absolute inset-0'>
                                            <Image
                                                src={
                                                    project.prevProject.Cover.url.startsWith(
                                                        "http"
                                                    )
                                                        ? project.prevProject
                                                              .Cover.url
                                                        : `https://mb-portfolio.fly.dev${project.prevProject.Cover.url}`
                                                }
                                                alt={project.prevProject.Name}
                                                fill
                                                className='object-cover blur-sm group-hover:blur-none group-hover:scale-105 transition-all duration-300'
                                            />
                                            <div className='absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent'></div>
                                        </div>
                                        <div className='absolute inset-0 flex flex-col justify-end p-4 md:p-6'>
                                            <span className='text-white text-2xl md:text-3xl lg:text-4xl font-bold uppercase drop-shadow-lg mb-2'>
                                                {project.prevProject.Name}
                                            </span>
                                            <div className='flex items-center gap-2'>
                                                <ChevronLeft
                                                    className='w-5 h-5 text-white'
                                                    strokeWidth={2.5}
                                                />
                                                <span className='text-white text-base md:text-lg font-medium'>
                                                    Previous
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                )}

                                {/* Next Project Card */}
                                {project.nextProject && (
                                    <Link
                                        href={`/project/${project.nextProject.documentId}`}
                                        className='group relative h-80 md:h-96 rounded-xl overflow-hidden hover:opacity-90 transition-all duration-300'
                                    >
                                        <div className='absolute inset-0'>
                                            <Image
                                                src={
                                                    project.nextProject.Cover.url.startsWith(
                                                        "http"
                                                    )
                                                        ? project.nextProject
                                                              .Cover.url
                                                        : `https://mb-portfolio.fly.dev${project.nextProject.Cover.url}`
                                                }
                                                alt={project.nextProject.Name}
                                                fill
                                                className='object-cover blur-sm group-hover:blur-none group-hover:scale-105 transition-all duration-300'
                                            />
                                            <div className='absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent'></div>
                                        </div>
                                        <div className='absolute inset-0 flex flex-col justify-end items-end p-4 md:p-6'>
                                            <span className='text-white text-2xl md:text-3xl lg:text-4xl font-bold uppercase drop-shadow-lg mb-2 text-right'>
                                                {project.nextProject.Name}
                                            </span>
                                            <div className='flex items-center gap-2'>
                                                <span className='text-white text-base md:text-lg font-medium'>
                                                    Next
                                                </span>
                                                <ChevronRight
                                                    className='w-5 h-5 text-white'
                                                    strokeWidth={2.5}
                                                />
                                            </div>
                                        </div>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </main>
        </div>
    );
}
