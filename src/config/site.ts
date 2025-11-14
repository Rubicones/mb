export const siteConfig = {
    name: "Matvei Brumberg",
    shortName: "Matvei Brumberg Portfolio",
    description:
        "Matvei Brumberg is a motion, 3D, and 2D designer blending craft, texture, and modern storytelling across digital and physical media.",
    keywords: [
        "Matvei Brumberg",
        "motion designer",
        "3D designer",
        "2D designer",
        "handcraft",
        "portfolio",
        "animation",
        "tel aviv designer",
    ],
    locale: "en_US",
    siteUrl:
        process.env.NEXT_PUBLIC_SITE_URL ?? "https://mb-tan.vercel.app/",
    contactEmail: "mgbtumbedg@gmail.com",
    socials: {
        instagram: "https://www.instagram.com/mgbtumbedg",
        linkedin: "https://il.linkedin.com/in/matvei-brumberg-593b8b290",
        telegram: "https://t.me/mativich",
        artstation: "https://www.artstation.com/batvey",
    },
    ogImage: "/whoami3.png",
};

export type SiteConfig = typeof siteConfig;
