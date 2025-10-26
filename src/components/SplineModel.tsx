import Spline from "@splinetool/react-spline";

export default function SplineModel() {
    
    return (
        <div className='relative w-screen flex justify-start z-40'>
            <Spline
                scene="https://prod.spline.design/1g59SSL9tQNhDuDw/scene.splinecode" 
                className='h-[calc(100dvh-10rem)] w-screen z-40'
                style={{ height: "calc(100dvh-10rem)", width: "100vw", backgroundColor: "white" }}
            />

            
            <div className="absolute bottom-0 right-0 w-full h-20 bg-white z-50"></div>
        </div>
    );
}
