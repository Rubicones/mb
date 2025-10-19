import Spline from "@splinetool/react-spline/next";

export default function SplineModel() {
    return (
        <div className='w-full flex justify-start px-4 sm:px-20 md:px-24 lg:px-48'>
            <Spline
                scene='https://prod.spline.design/1g59SSL9tQNhDuDw/scene.splinecode'
                className='h-[calc(100dvh-10rem)]'
                style={{ height: "calc(100dvh-10rem)" }}
            />
        </div>
    );
}
