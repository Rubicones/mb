import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: siteConfig.name,
        short_name: siteConfig.shortName,
        description: siteConfig.description,
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#111111",
        theme_color: "#111111",
        lang: "en",
        icons: [
            {
                src: "/favicon.ico",
                sizes: "48x48",
                type: "image/x-icon",
            },
            {
                src: siteConfig.ogImage,
                sizes: "180x180",
                type: "image/png",
            },
        ],
    };
}
