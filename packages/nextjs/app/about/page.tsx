import Link from "next/link";
import type { NextPage } from "next";
import Image from "next/image";
import logo from "../../public/logo.jpg";

const About: NextPage = () => {

    return (
        <>
            <div className="flex items-center flex-col flex-grow pt-10 w-dvw h-dvh">
                <div className="mx-auto">
                    <Image src={logo} alt="logo" width={100} height={100} />
                    <p className="text-4xl">About</p>
                </div>
                <div className="m-auto flex flex-col justify-around w-5/6 h-2/3">
                    <p>Welcome to <strong>WeLivedIt</strong>, the platform where your voice shapes the future of online communities. Our innovative tool empowers users to report hate speech, contributing to a safer and more inclusive digital environment.</p>
                    <p><strong>WeLivedIt</strong> leverages advanced AI to review and classify reported hate speech, ensuring swift and accurate identification of harmful content. Each report earns you Lived Experience Points, reflecting your crucial role in maintaining a respectful community. These points are aligned with specific protected characteristics, emphasizing the diversity and inclusivity of your contributions</p>
                    <p>With <strong>WeLivedIt</strong>, you are at the forefront of change. As you gather Lived Experience Points, you gain the power to influence updates to our AI agent’s prompts, making it more adept at recognizing nuanced hate speech. This collaborative effort ensures our AI evolves to better serve the community, enhancing its effectiveness and sensitivity.</p>
                    <p>Join us in our mission to reclaim and own our digital spaces. With <strong>WeLivedIt</strong>, your lived experiences drive the creation of safer, more respectful online environments. Together, we can govern online spaces for a better future.</p>
                </div>
            </div>
        </>
    );
};

export default About;
