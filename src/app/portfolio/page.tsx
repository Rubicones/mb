import Header from "@/components/Header";
import CategorySection from "@/components/CategorySection";
import AnchorNavigation from "@/components/AnchorNavigation";
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
    data: Project[];
    meta: {
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
}

async function getProjectWithImages(
    projectId: string
): Promise<Project | null> {
    try {
        const response = await fetch(
            `https://mb-portfolio.fly.dev/api/projects/${projectId}?populate[Media][populate]=*&populate[Programs][populate]=*&populate=Cover`,
            {
                next: { revalidate: 60 },
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            console.error(
                `Failed to fetch project ${projectId}:`,
                response.status,
                response.statusText
            );
            return null;
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error(`Error fetching project ${projectId}:`, error);
        return null;
    }
}

async function getProjects(): Promise<Project[]> {
    try {
        // First, fetch all projects with basic data
        const response = await fetch(
            "https://mb-portfolio.fly.dev/api/projects?populate=*&pagination[pageSize]=100",
            {
                next: { revalidate: 60 }, // Revalidate every 60 seconds
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Strapi API Error:", {
                status: response.status,
                statusText: response.statusText,
                error: errorText,
            });

            if (response.status === 403) {
                throw new Error(
                    "API access forbidden. The Strapi collection may require authentication or be private."
                );
            } else if (response.status === 404) {
                throw new Error(
                    "API endpoint not found. Please check the Strapi URL."
                );
            } else {
                throw new Error(
                    `API request failed with status ${response.status}: ${response.statusText}`
                );
            }
        }

        const data: StrapiResponse = await response.json();
        console.log("Initial projects data:", data);

        // Now fetch each project individually with detailed populate parameters for images
        const projectsWithImages = await Promise.all(
            data.data.map(async (project) => {
                const detailedProject = await getProjectWithImages(
                    project.documentId
                );
                return detailedProject || project; // Fallback to original project if detailed fetch fails
            })
        );

        console.log("Projects with images:", projectsWithImages);
        return projectsWithImages;
    } catch (error) {
        console.error("Error fetching projects:", error);
        return [];
    }
}

export default async function Portfolio() {
    const projects = await getProjects();
    const projects3D = projects.filter(
        (project) => project.Category === "c_3D"
    );
    const projects2D = projects.filter(
        (project) => project.Category === "c_2D"
    );
    const projectsMulti = projects.filter(
        (project) => project.Category === "c_Craft"
    );

    const anchorSections = [
        { id: "section-3d", label: "3D", scrollTo: "header" as const },
        { id: "section-2d", label: "2D", scrollTo: "section" as const },
        { id: "section-hc", label: "HC", scrollTo: "section" as const },
    ];

    return (
        <div className='w-full h-full flex flex-col items-center bg-black overflow-x-hidden'>
            <div className='w-screen h-full flex flex-col items-center bg-black'>
                <Header />
                <AnchorNavigation sections={anchorSections} />
                <div className='w-full flex flex-col justify-center items-center bg-black z-50'>
                    <main className='max-w-[1920px] w-full flex flex-col items-start px-4 md:px-6 pt-8 md:pt-12 pb-16 z-50 h-[calc(100dvh-64px)] bg-black overflow-y-scroll no-scrollbar'>
                        <div className='mb-12 md:mb-16'>
                            <h1 className='text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white uppercase'>
                                PORTFOLIO
                            </h1>
                            <div className='w-full h-[2px] bg-white mt-2'></div>
                        </div>

                        {projects.length === 0 ? (
                            <div className='text-center py-12'>
                                <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-2xl mx-auto'>
                                    <h2 className='text-2xl font-bold text-yellow-800 mb-4'>
                                        Unable to Load Projects
                                    </h2>
                                </div>
                            </div>
                        ) : (
                            <CategorySection 
                                projects3D={projects3D}
                                projects2D={projects2D}
                                projectsMulti={projectsMulti}
                            />
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
