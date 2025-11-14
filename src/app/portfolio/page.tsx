import Header from "@/components/Header";
import CategorySection from "@/components/CategorySection";
import AnchorNavigation from "@/components/AnchorNavigation";
import Footer from "@/components/Footer";
import { fetchProjectsWithDetails } from "@/lib/strapi";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
    title: "Portfolio",
    description:
        "Browse highlighted 3D, 2D, and craft projects by Matvei Brumberg, featuring motion design, animation, and handcrafted work.",
    alternates: {
        canonical: `${siteConfig.siteUrl}/portfolio`,
    },
    openGraph: {
        title: "Portfolio | Matvei Brumberg",
        description:
            "Explore Matvei Brumberg's curated portfolio across 3D, 2D, and handcrafted projects.",
        url: `${siteConfig.siteUrl}/portfolio`,
    },
    twitter: {
        title: "Portfolio | Matvei Brumberg",
        description:
            "Explore Matvei Brumberg's curated portfolio across 3D, 2D, and handcrafted projects.",
    },
};

export default async function Portfolio() {
    const projects = await fetchProjectsWithDetails();
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
        <div className='w-full h-full flex flex-col items-center bg-neutral-900 overflow-x-hidden'>
            <div className='w-screen h-full flex flex-col items-center bg-neutral-900  overflow-y-scroll no-scrollbar scrollContainer'>
                <Header />
                <AnchorNavigation sections={anchorSections} />
                <div className='w-full flex flex-col justify-center items-center bg-neutral-900 mt-20'>
                    <main className='max-w-[1600px] w-full flex flex-col items-start px-4 md:px-6 pt-8 md:pt-12 pb-16 bg-neutral-900'>
                        <div className='mb-12 md:mb-36'>
                            <h1 className='text-[3.5rem] sm:text-8xl md:text-9xl xl:text-[14rem] font-semibold text-white uppercase'>
                                PORTFOLIO
                            </h1>
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
                <Footer />
            </div>
        </div>
    );
}
