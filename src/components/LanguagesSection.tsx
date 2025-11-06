'use client';

import { useState } from 'react';
import TypingText from './TypingText';

type Language = 'ru' | 'en' | 'he';

const languageNames: Record<Language, { native: string; english: string; level: string; nameTranslation: string }> = {
    ru: {
        native: 'РУССКИЙ',
        english: 'RU',
        level: 'Native',
        nameTranslation: 'МАТВЕЙ'
    },
    en: {
        native: 'ENGLISH',
        english: 'EN',
        level: 'Fluent',
        nameTranslation: 'MATVEI'
    },
    he: {
        native: 'עברית',
        english: 'HEB',
        level: 'Basic',
        nameTranslation: 'מטביי'
    }
};

export default function LanguagesSection() {
    const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');

    return (
        <>
            <span className='text-4xl md:text-7xl lg:text-9xl font-extralight text-white leading-none mt-20'>
                LANGUAGES
            </span>
            
            {/* Languages Section */}
            <div className='w-full grid grid-cols-3 gap-3 md:gap-4 mb-8'>
                {/* Russian */}
                <button
                    onClick={() => setSelectedLanguage('ru')}
                    className='col-span-1 aspect-square p-1 sm:p-2 transition-all'
                >
                    <div className={`bg-neutral-800 rounded-3xl h-full p-3 sm:p-6 flex flex-col justify-between ${
                        selectedLanguage === 'ru' ? 'border-2 border-[#C8B936]' : ''
                    }`}>
                        <p className='text-white text-xl md:text-2xl lg:text-3xl xl:text-4xl text-left'>{languageNames.ru.native}</p>
                        <p className='text-white text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extralight text-center'>
                            {languageNames.ru.english}
                        </p>
                        <p className='text-gray-400 text-xl md:text-2xl lg:text-3xl xl:text-4xl text-right'>{languageNames.ru.level}</p>
                    </div>
                </button>

                {/* English */}
                <button
                    onClick={() => setSelectedLanguage('en')}
                    className='col-span-1 aspect-square p-1 sm:p-2 transition-all'
                >
                    <div className={`bg-neutral-800 rounded-3xl h-full p-3 sm:p-6 flex flex-col justify-between ${
                        selectedLanguage === 'en' ? 'border-2 border-[#C8B936]' : ''
                    }`}>
                        <p className='text-white text-xl md:text-2xl lg:text-3xl xl:text-4xl text-left'>{languageNames.en.native}</p>
                        <p className='text-white text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extralight text-center'>
                            {languageNames.en.english}
                        </p>
                        <p className='text-gray-400 text-xl md:text-2xl lg:text-3xl xl:text-4xl text-right'>{languageNames.en.level}</p>
                    </div>
                </button>

                {/* Hebrew */}
                <button
                    onClick={() => setSelectedLanguage('he')}
                    className='col-span-1 aspect-square p-1 sm:p-2 transition-all'
                >
                    <div className={`bg-neutral-800 rounded-3xl h-full p-3 sm:p-6 flex flex-col justify-between ${
                        selectedLanguage === 'he' ? 'border-2 border-[#C8B936]' : ''
                    }`}>
                        <p className='text-white text-xl md:text-2xl lg:text-3xl xl:text-4xl text-left'>{languageNames.he.native}</p>
                        <p className='text-white text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extralight text-center'>
                            {languageNames.he.english}
                        </p>
                        <p className='text-gray-400 text-xl md:text-2xl lg:text-3xl xl:text-4xl text-right'>{languageNames.he.level}</p>
                    </div>
                </button>
            </div>

            {/* Name at Bottom with Typing Effect */}
            <div className='w-full mb-16'>
                <TypingText 
                    key={selectedLanguage}
                    text={languageNames[selectedLanguage].nameTranslation}
                    className='text-6xl md:text-8xl lg:text-9xl font-extralight text-white tracking-wider'
                    speed={100}
                />
            </div>
        </>
    );
}

