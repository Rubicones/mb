'use client';

import { useState, useEffect } from 'react';

interface TypingTextProps {
    text: string;
    className?: string;
    speed?: number;
    showCaret?: boolean;
}

export default function TypingText({ 
    text, 
    className = '', 
    speed = 80,
    showCaret = true 
}: TypingTextProps) {
    const [visibleText, setVisibleText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showCursor, setShowCursor] = useState(true);

    useEffect(() => {
        // Reset when text changes
        setVisibleText('');
        setCurrentIndex(0);
        setShowCursor(true);
    }, [text]);

    useEffect(() => {
        if (currentIndex < text.length) {
            const randomSpeed = Math.floor(Math.random() * speed);
            const timeout = setTimeout(() => {
                setVisibleText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, randomSpeed);

            return () => clearTimeout(timeout);
        }
    }, [currentIndex, text, speed]);

    return (
        <div className="relative inline-block h-20 md:h-32 lg:h-64">
            <span className={className}>{visibleText}</span>
            {showCaret && (
                <span 
                    className={`${className} ml-1 animate-pulse`}
                    style={{ animation: 'blink 0.7s infinite' }}
                >
                    |
                </span>
            )}
        </div>
    );
}

