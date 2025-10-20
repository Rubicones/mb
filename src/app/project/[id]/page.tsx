import Header from "@/components/Header";
import Gallery from "@/components/Gallery";
import Image from "next/image";
import Link from "next/link";
import Spline from "@splinetool/react-spline/next";

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

interface StrapiResponse {
    data: Project;
}

async function getProject(id: string): Promise<Project | null> {
    try {
        const response = await fetch(
            `https://authentic-splendor-f67c9d75a4.strapiapp.com/api/projects/${id}?populate[Media][populate]=*&populate[Programs][populate]=*&populate=Cover`,
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
        console.log(data.data);
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
        <div className='min-h-screen bg-gray-100 overflow-x-hidden'>
            <Header />

            <main className='w-screen h-full flex justify-center'>
                <div className='w-full max-w-[1920px] flex items-center justify-between px-4 md:px-6'>
                    <div className='w-full flex md:justify-between justify-start gap-10 flex-wrap mt-12'>
                        <span className='text-8xl font-bold text-black w-full md:w-[65%]'>
                            {project.Name}
                        </span>
                        <div className='flex w-full gap-2 items-center md:w-[20%] md:justify-end justify-start'>
                            {project.Programs.map((program) => (
                                <div
                                    key={program.id}
                                    className='flex items-center justify-between'
                                >
                                    <Image
                                        src={program.Icon?.url || ""}
                                        alt={program.Name}
                                        width={64}
                                        height={64}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className='w-full flex md:justify-around justify-start gap-10 flex-wrap mt-4 text-black'>
                            <div className='flex-grow-1 flex flex-col gap-2'>
                                <span className="text-xl text-neutral-700 ">Category</span>
                                <span className="text-black text-xl font-bold">{project.Category.slice(2)}</span>
                            </div>
                            <div className='flex justify-between gap-10'>
                                <div className='flex flex-col gap-2'>
                                    <span className="text-xl text-neutral-700 ">Date</span>
                                    <span className="text-black text-xl font-bold">{project.Date}</span>
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <span className="text-xl text-neutral-700 ">Smth</span>
                                    <span className="text-black text-xl font-bold">Here</span>
                                </div>
                            </div>
                        </div>
                        <div className='w-full flex flex-col md:flex-row justify-between gap-10 mt-12'>
                        <div className=" w-full md:w-1/2 h-full flex justify-start items-start gap-2 flex-col">
                                <span className="text-neutral-700 text-3xl font-bold">Preview</span>
                                <div className=" w-full h-full flex justify-start items-center">
                                {project.Content === "youtube" && (
                                    <iframe className="w-full aspect-video" src={"https://www.youtube.com/embed/-zaMDDio_NU?si=j5zHyc8d257Aze5A}"} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                                )}
                                {project.Content === "spline" && (
                                   <Spline scene={project.SplineLink || ""} style={{ width: "100%", height: "100%" }} />
                                )}
                            </div>
                            </div>
                           
                            <div className=" w-full md:w-1/2 h-full flex justify-start items-start gap-2 flex-col">
                                <span className="text-neutral-700 text-3xl font-bold">Description</span>
                                <span className="text-black text-2xl">{project.Description}</span>
                            </div>
                        </div>
                        
                        {/* Gallery Section */}
                        <Gallery media={project.Media} />
                    </div>
                </div>
            </main>
        </div>
    );
}
