import Spline from "@splinetool/react-spline/next";

export default function SplineModel() {
    return (
        <div className='w-screen flex justify-start'>
            <Spline
                scene='https://prod.spline.design/1g59SSL9tQNhDuDw/scene.splinecode'
                className='h-[calc(100dvh-10rem)] w-screen'
                style={{ height: "calc(100dvh-10rem)", width: "100vw" }}
            />
        </div>
    );
}
