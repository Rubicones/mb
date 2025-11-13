"use client";

import { useState } from "react";
import TypingText from "./TypingText";

type Language = "ru" | "en" | "he";

const languageNames: Record<
    Language,
    { native: string; english: string; level: string; nameTranslation: string }
> = {
    ru: {
        native: "РУССКИЙ",
        english: "RU",
        level: "Native",
        nameTranslation: "Привет! У вас есть работа для меня?",
    },
    en: {
        native: "ENGLISH",
        english: "EN",
        level: "Fluent",
        nameTranslation: "Hello! Do you have work for me?",
    },
    he: {
        native: "עברית",
        english: "HEB",
        level: "Basic",
        nameTranslation: "?שלום! יש לך עבודה בשבילי",
    },
};

export default function LanguagesSection() {
    const [selectedLanguage, setSelectedLanguage] = useState<Language>("en");

    return (
        <>
            <span className='text-6xl md:text-8xl font-extralight text-white leading-none mt-20 mb-8'>
                LANGUAGES
            </span>

            <div className='w-full grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8'>
                <div className='language-card col-span-1 rounded-3xl bg-neutral-800 p-6 sm:p-10 flex flex-col items-start gap-4'>
                    <button
                        data-slide-direction='left'
                        onClick={() => setSelectedLanguage("ru")}
                        className='cursor-pointer col-span-1 aspect-square p-1 sm:p-2 transition-all'
                    >
                        <div
                            className={`bg-neutral-800  hover:bg-neutral-700 transition-all duration-300 outline-2  rounded-3xl h-full p-3 sm:p-6 flex flex-col justify-between ${
                                selectedLanguage === "ru"
                                    ? "outline-[#C8B936]"
                                    : "outline-neutral-800 hover:outline-[#BBAD31]/60"
                            }`}
                        >
                            <p className='text-white text-md sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-left'>
                                {languageNames.ru.native}
                            </p>
                            <p className='text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extralight text-center'>
                                {languageNames.ru.english}
                            </p>
                            <p className='text-gray-400 text-md sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-right'>
                                {languageNames.ru.level}
                            </p>
                        </div>
                    </button>
                </div>

                <div className='language-card col-span-1 rounded-3xl bg-neutral-800 p-6 sm:p-10 flex flex-col items-start gap-4'>
                    <button
                        data-slide-direction='right'
                        onClick={() => setSelectedLanguage("en")}
                        className='cursor-pointer col-span-1 aspect-square p-1 sm:p-2 transition-all'
                    >
                        <div
                            className={`bg-neutral-800  hover:bg-neutral-700 transition-all duration-300 outline-2  rounded-3xl h-full p-3 sm:p-6 flex flex-col justify-between ${
                                selectedLanguage === "en"
                                    ? "outline-[#C8B936]"
                                    : "outline-neutral-800 hover:outline-[#BBAD31]/60"
                            }`}
                        >
                            <p className='text-white text-md sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-left'>
                                {languageNames.en.native}
                            </p>
                            <p className='text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extralight text-center'>
                                {languageNames.en.english}
                            </p>
                            <p className='text-gray-400 text-md sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-right'>
                                {languageNames.en.level}
                            </p>
                        </div>
                    </button>
                </div>

                <div className='language-card col-span-1 rounded-3xl bg-neutral-800 p-6 sm:p-10 flex flex-col items-start gap-4'>
                    <button
                        data-slide-direction='right'
                        onClick={() => setSelectedLanguage("he")}
                        className='cursor-pointer col-span-1 aspect-square p-1 sm:p-2 transition-all'
                    >
                        <div
                            className={`bg-neutral-800  hover:bg-neutral-700 transition-all duration-300 outline-2  rounded-3xl h-full p-3 sm:p-6 flex flex-col justify-between ${
                                selectedLanguage === "he"
                                    ? "outline-[#C8B936]"
                                    : "outline-neutral-800 hover:outline-[#BBAD31]/60"
                            }`}
                        >
                            <p className='text-white text-md sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-left'>
                                {languageNames.he.native}
                            </p>
                            <p className='text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extralight text-center'>
                                {languageNames.he.english}
                            </p>
                            <p className='text-gray-400 text-md sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-right'>
                                {languageNames.he.level}
                            </p>
                        </div>
                    </button>
                </div>
            </div>

            <div className='col-span-1 md:col-span-3 flex justify-center items-center mt-8'>
                <TypingText
                    key={selectedLanguage}
                    text={languageNames[selectedLanguage].nameTranslation}
                    className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extralight text-white tracking-wider ${selectedLanguage ===  'he' ? 'font-normal' : 'font-extralight'}`}
                    speed={100}
                />
            </div>
        </>
    );
}
