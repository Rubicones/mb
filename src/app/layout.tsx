import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import Script from "next/script";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: new URL(siteConfig.siteUrl),
    title: {
        default: siteConfig.name,
        template: `%s | ${siteConfig.shortName}`,
    },
    description: siteConfig.description,
    applicationName: siteConfig.shortName,
    keywords: siteConfig.keywords,
    authors: [{ name: siteConfig.name, url: siteConfig.siteUrl }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    alternates: {
        canonical: siteConfig.siteUrl,
    },
    openGraph: {
        type: "website",
        locale: siteConfig.locale,
        url: siteConfig.siteUrl,
        title: siteConfig.name,
        description: siteConfig.description,
        siteName: siteConfig.shortName,
        images: [
            {
                url: siteConfig.ogImage,
                width: 1200,
                height: 630,
                alt: `${siteConfig.name} portfolio cover`,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: siteConfig.name,
        description: siteConfig.description,
        images: [siteConfig.ogImage],
        creator: "@mgbtumbedg",
    },
    category: "portfolio",
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon.ico",
        apple: siteConfig.ogImage,
    },
    other: {
        "theme-color": "#111111",
    },
};

export const viewport: Viewport = {
    colorScheme: "dark",
    themeColor: "#111111",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <Script
                    id='ld-json-organization'
                    type='application/ld+json'
                    strategy='afterInteractive'
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Person",
                            name: siteConfig.name,
                            url: siteConfig.siteUrl,
                            description: siteConfig.description,
                            email: `mailto:${siteConfig.contactEmail}`,
                            sameAs: Object.values(siteConfig.socials),
                        }),
                    }}
                />
                {children}
            </body>
        </html>
    );
}
