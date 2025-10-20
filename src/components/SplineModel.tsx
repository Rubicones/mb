import Spline from "@splinetool/react-spline/next";

export default function SplineModel() {
    return (
        <div className='relative w-screen flex justify-start z-10'>
            <Spline
                        scene="https://prod.spline.design/1g59SSL9tQNhDuDw/scene.splinecode" 
                className='h-[calc(100dvh-10rem)] w-screen'
                style={{ height: "calc(100dvh-10rem)", width: "100vw" }}
            />
            <div className="absolute bottom-0 right-0 w-full h-20 bg-white z-20"></div>
        </div>
    );
}
