import Spline from "@splinetool/react-spline";
import Link from "next/link";

export default function SplineLogo() {
    return (
            <Link href="/"><Spline
            scene='https://prod.spline.design/PU2XQKzQ6p08SZ8L/scene.splinecode'
            className=' absolute top-[14px] left-0 w-[60px] h-[60px]' style={{ width: "60px" }}
        /></Link>

    );
}
