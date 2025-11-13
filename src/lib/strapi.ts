export const STRAPI_BASE_URL = "https://mb-portfolio.fly.dev";
export const STRAPI_HEADERS = {
    "Content-Type": "application/json",
} as const;

export type ProjectCategory = "c_3D" | "c_2D" | "c_Craft";
export type ProjectContentType = "youtube" | "spline" | "none";
export type ProjectWorkType = "personal" | "comercial" | string;

export interface StrapiImage {
    id: number;
    url: string;
    alternativeText?: string | null;
    name?: string;
    width?: number;
    height?: number;
}

export interface Program {
    id: number;
    Name: string;
    Icon?: StrapiImage | null;
}

export interface MediaItem {
    id: number;
    Comment: string;
    Image?: StrapiImage | null;
    image?: StrapiImage | null;
}

export interface ProjectLink {
    documentId: string;
    Name: string;
    Cover: StrapiImage;
}

export interface Project {
    id: number;
    documentId: string;
    Name: string;
    Description: string;
    Date: string;
    isPosted: boolean;
    isHighlighted?: boolean;
    Cover: StrapiImage;
    Content: ProjectContentType;
    SplineLink: string | null;
    ytLink: string | null;
    Category: ProjectCategory;
    Media: MediaItem[];
    Programs: Program[];
    priority?: number;
    type?: ProjectWorkType | null;
    nextProject?: ProjectLink;
    prevProject?: ProjectLink;
}

export interface ProjectCollectionResponse {
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

export interface ProjectResponse {
    data: Project;
}

type StrapiFetchOptions = RequestInit & {
    next?: {
        revalidate?: number;
    };
};

export function buildStrapiUrl(path: string): string {
    if (path.startsWith("http")) {
        return path;
    }

    return `${STRAPI_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

export function resolveAssetUrl(image?: StrapiImage | null): string {
    if (!image?.url) {
        return "";
    }

    return image.url.startsWith("http") ? image.url : `${STRAPI_BASE_URL}${image.url}`;
}

export function resolveMediaImage(media?: MediaItem | null): StrapiImage | null {
    if (!media) {
        return null;
    }

    return media.Image ?? media.image ?? null;
}

export function getProjectCategoryLabel(category: ProjectCategory): string {
    return category.replace(/^c_/i, "");
}

export async function fetchStrapi<T>(
    endpoint: string,
    init: StrapiFetchOptions = {}
): Promise<T> {
    const url = buildStrapiUrl(endpoint);
    const headers = new Headers(init.headers ?? {});

    if (!headers.has("Content-Type")) {
        headers.set("Content-Type", STRAPI_HEADERS["Content-Type"]);
    }

    const response = await fetch(url, {
        ...init,
        headers,
    });

    if (!response.ok) {
        const errorText = await response.text().catch(() => response.statusText);
        throw new Error(
            `Strapi request failed (${response.status} ${response.statusText}): ${errorText}`
        );
    }

    return response.json() as Promise<T>;
}

const PROJECT_POPULATE_QUERY =
    "?populate[Media][populate]=*&populate[Programs][populate]=*&populate=Cover&populate[nextProject][populate]=*&populate[prevProject][populate]=*";

export async function fetchProjectByDocumentId(
    documentId: string,
    options: StrapiFetchOptions = {}
): Promise<Project | null> {
    try {
        const { data } = await fetchStrapi<ProjectResponse>(
            `/api/projects/${documentId}${PROJECT_POPULATE_QUERY}`,
            {
                ...options,
                next: options.next ?? { revalidate: 60 },
            }
        );

        return data;
    } catch (error) {
        console.error(`Failed to fetch project ${documentId}:`, error);
        return null;
    }
}

export async function fetchProjectsWithDetails(
    options: StrapiFetchOptions = {}
): Promise<Project[]> {
    try {
        const initialResponse = await fetchStrapi<ProjectCollectionResponse>(
            `/api/projects?populate=*&pagination[pageSize]=100`,
            {
                ...options,
                next: options.next ?? { revalidate: 60 },
            }
        );

        const projects = initialResponse.data;

        const detailedProjects = await Promise.all(
            projects.map(async (project) => {
                const detailed = await fetchProjectByDocumentId(project.documentId, options);
                return detailed ?? project;
            })
        );

        return detailedProjects;
    } catch (error) {
        console.error("Failed to fetch projects:", error);
        return [];
    }
}

export async function fetchHighlightedProjects(
    options: StrapiFetchOptions = {}
): Promise<Project[]> {
    try {
        const { data } = await fetchStrapi<ProjectCollectionResponse>(
            `/api/projects?filters[isHighlighted][$eq]=true&populate=*&pagination[pageSize]=10`,
            options
        );

        return data;
    } catch (error) {
        console.error("Failed to fetch highlighted projects:", error);
        return [];
    }
}
