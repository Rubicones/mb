interface ScrollingTickerProps {
    direction: "left" | "right";
    text: string;
    repeatCount?: number;
    className?: string;
}

export default function ScrollingTicker({
    direction,
    text,
    repeatCount = 10,
    className = "",
}: ScrollingTickerProps) {
    const directionClass =
        direction === "left" ? "animate-scroll-left" : "animate-scroll-right";

    return (
        <div
            className={`w-screen bg-[#F7DB25] h-12 text-lg lg:text-xl flex items-center overflow-hidden ${className}`}
        >
            <div className={`flex ${directionClass}`}>
                {Array.from({ length: 2 }).map((_, index) => (
                    <span
                        key={index}
                        className='whitespace-nowrap text-black font-semibold'
                    >
                        {text.repeat(repeatCount)}
                    </span>
                ))}
            </div>
        </div>
    );
}
