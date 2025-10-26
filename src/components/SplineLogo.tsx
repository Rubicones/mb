import Spline from "@splinetool/react-spline";
import Link from "next/link";

export default function SplineLogo() {
    return (
        <Link href='/'>
            <Spline
                scene='https://prod.spline.design/PU2XQKzQ6p08SZ8L/scene.splinecode'
                className=' absolute top-[14px] left-0 w-[90px] h-[90px] z-100 canvas-container'
                style={{ width: "100vh", height: "100vh" }}
            />
        </Link>
    );
}
