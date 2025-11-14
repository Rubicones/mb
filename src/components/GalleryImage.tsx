"use client";

import Image, { type ImageProps } from "next/image";
import { useState, useCallback } from "react";

interface GalleryImageProps extends Omit<ImageProps, "className" | "alt"> {
    alt: string;
    className?: string;
    containerClassName?: string;
    skeletonClassName?: string;
}

export default function GalleryImage({
    className = "",
    containerClassName = "",
    skeletonClassName = "",
    onLoad,
    onLoadingComplete,
    alt,
    ...imageProps
}: GalleryImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);

    const handleLoaded = useCallback(() => {
        setIsLoaded(true);
    }, []);

    return (
        <div className={`relative ${containerClassName}`}>
            {!isLoaded && (
                <div
                    className={`absolute inset-0 bg-neutral-800/60 animate-pulse flex items-center justify-center rounded-md ${skeletonClassName}`}
                >
                    <span className='sr-only'>Loading image</span>
                </div>
            )}
            <Image
                alt={alt}
                {...imageProps}
                className={`transition-opacity duration-300 ${
                    isLoaded ? "opacity-100" : "opacity-0"
                } ${className}`}
                onLoad={(event) => {
                    handleLoaded();
                    onLoad?.(event);
                }}
                onLoadingComplete={(result) => {
                    handleLoaded();
                    onLoadingComplete?.(result);
                }}
            />
        </div>
    );
}

