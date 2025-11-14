"use client";
import Image from "next/image";

import { useState } from "react";

export default function WhoamiImages() {
    const [activeImage, setActiveImage] = useState<number | null>(null);
    return (
        <div className='w-full md:w-1/3 min-h-[250px] md:min-h-[400px] flex flex-col items-center justify-center relative mr-10 '>
            <Image
                src='/whoami3.png'
                width={200}
                height={250}
                className={`absolute object-cover rounded-2xl top-[5px] md:top-[10px] left-[calc(50%-75px+5px)] md:left-[calc(50%-100px+10px)] rotate-12 transition-all duration-300 cursor-pointer hover:scale-125 hover:z-50 ${
                    activeImage === 1 ? "scale-125 z-50" : "z-10"
                } w-[120px] h-[150px] md:w-[150px] md:h-[187.5px] lg:w-[200px] lg:h-[250px]`}
                alt=''
                onClick={() => setActiveImage(activeImage === 1 ? null : 1)}
            />
            <Image
                src='/whoami2.png'
                width={200}
                height={250}
                className={`absolute object-cover rounded-2xl top-[40px] md:top-[70px] left-[calc(50%-75px-40px)] md:left-[calc(50%-100px-70px)] -rotate-10 transition-all duration-300 cursor-pointer hover:scale-125 hover:z-50 ${
                    activeImage === 2 ? "scale-125 z-50" : "z-20"
                } w-[120px] h-[150px] md:w-[150px] md:h-[187.5px] lg:w-[200px] lg:h-[250px]`}
                alt=''
                onClick={() => setActiveImage(activeImage === 2 ? null : 2)}
            />
            <Image
                src='/whoami4.jpg'
                width={200}
                height={250}
                className={`absolute object-cover rounded-2xl top-[80px] md:top-[140px] left-[calc(50%-75px+60px)] md:left-[calc(50%-100px+110px)] rotate-5 transition-all duration-300 cursor-pointer hover:scale-125 hover:z-50 ${
                    activeImage === 3 ? "scale-125 z-50" : "z-30"
                } w-[120px] h-[150px] md:w-[150px] md:h-[187.5px] lg:w-[200px] lg:h-[250px]`}
                alt=''
                onClick={() => setActiveImage(activeImage === 3 ? null : 3)}
            />
        </div>
    );
}
