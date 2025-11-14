"use client";

import Spline from "@splinetool/react-spline";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";

interface SplineProjectSceneProps {
    splineLink: string;
}

export default function SplineProjectScene({
    splineLink,
}: SplineProjectSceneProps) {
    const [isLoaded, setIsLoaded] = useState(false);

    const onLoad = () => {
        setIsLoaded(true);
    };

    return (
        <>
            <Spline
                onLoad={onLoad}
                scene={splineLink || ""}
                className='w-full h-full sm:aspect-video aspect-square z-20'
            />
            {!isLoaded && (
                <div className='absolute top-0 left-0 w-full h-full sm:aspect-video aspect-square bg-neutral-800 z-30 rounded-xl flex flex-col justify-center items-center'>
                    <LoaderCircle className='w-10 h-10 text-neutral-500 animate-spin' />
                    <span className='text-neutral-500 text-sm'>Loading...</span>
                </div>
            )}
        </>
    );
}
