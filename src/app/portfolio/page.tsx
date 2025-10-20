import ProjectCard from "@/components/ProjectCard";
import Header from "@/components/Header";

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
    Content: 'youtube' | 'spline' | 'none';
    SplineLink: string | null;
    ytLink: string | null;
    Category: 'c_3D' | 'c_2D' | 'c_Craft';
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

async function getProjectWithImages(projectId: string): Promise<Project | null> {
    try {
        const response = await fetch(
            `https://authentic-splendor-f67c9d75a4.strapiapp.com/api/projects/${projectId}?populate[Media][populate]=*&populate[Programs][populate]=*&populate=Cover`,
            {
                next: { revalidate: 60 },
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );

        if (!response.ok) {
            console.error(`Failed to fetch project ${projectId}:`, response.status, response.statusText);
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
            'https://authentic-splendor-f67c9d75a4.strapiapp.com/api/projects?populate=*&pagination[pageSize]=100',
            {
                next: { revalidate: 60 }, // Revalidate every 60 seconds
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Strapi API Error:', {
                status: response.status,
                statusText: response.statusText,
                error: errorText
            });
            
            if (response.status === 403) {
                throw new Error('API access forbidden. The Strapi collection may require authentication or be private.');
            } else if (response.status === 404) {
                throw new Error('API endpoint not found. Please check the Strapi URL.');
            } else {
                throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
            }
        }

        const data: StrapiResponse = await response.json();
        console.log('Initial projects data:', data);
        
        // Now fetch each project individually with detailed populate parameters for images
        const projectsWithImages = await Promise.all(
            data.data.map(async (project) => {
                const detailedProject = await getProjectWithImages(project.documentId);
                return detailedProject || project; // Fallback to original project if detailed fetch fails
            })
        );

        console.log('Projects with images:', projectsWithImages);
        return projectsWithImages;
    } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
}

export default async function Portfolio() {
    const projects = await getProjects();

    return (
        <div className='w-full h-full flex flex-col items-center bg-black overflow-x-hidden'>
            <div className='w-screen h-full max-w-[1920px] flex flex-col items-center bg-black '>
                <Header />
                <main className='w-full flex flex-col items-start px-4 mouse:px-6 py-8 mouse:py-12'>
                    <span className='text-5xl mouse:text-6xl md:text-7xl lg:text-[7rem] font-bold text-white text-left mb-8 mouse:mb-12 md:mb-16'>PORTFOLIO</span>
                    
                    {projects.length === 0 ? (
                        <div className='text-center py-12'>
                            <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-2xl mx-auto'>
                                <h2 className='text-2xl font-bold text-yellow-800 mb-4'>Unable to Load Projects</h2>
                            </div>
                        </div>
                    ) : (
                        <div className='w-full space-y-12 sm:space-y-16 md:space-y-20'>
                            {/* 3D DESIGN Category */}
                            {(() => {
                                const projects3D = projects.filter(project => project.Category === 'c_3D');
                                return projects3D.length > 0 && (
                                    <div className='w-full'>
                                        <h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 md:mb-8'>3D DESIGN</h2>
                                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'>
                                            {projects3D.map((project) => (
                                                <ProjectCard key={project.id} project={project} />
                                            ))}
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* 2D DESIGN Category */}
                            {(() => {
                                const projects2D = projects.filter(project => project.Category === 'c_2D');
                                return projects2D.length > 0 && (
                                    <div className='w-full'>
                                        <h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 md:mb-8'>2D DESIGN</h2>
                                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'>
                                            {projects2D.map((project) => (
                                                <ProjectCard key={project.id} project={project} />
                                            ))}
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* MULTIDISCIPLINAR Category */}
                            {(() => {
                                const projectsMulti = projects.filter(project => project.Category === 'c_Craft');
                                return projectsMulti.length > 0 && (
                                    <div className='w-full'>
                                        <h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 md:mb-8'>HANDCRAFT</h2>
                                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'>
                                            {projectsMulti.map((project) => (
                                                <ProjectCard key={project.id} project={project} />
                                            ))}
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
