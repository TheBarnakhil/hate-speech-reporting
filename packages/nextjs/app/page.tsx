import Link from "next/link";
import type { NextPage } from "next";
import Image from "next/image";
import homeImage from "../public/home.png";
import logo from "../public/logo.jpg";

const Home: NextPage = () => {

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10 w-dvw h-dvh">
        <div className="mx-auto">
          <Image src={logo} alt="logo" width={120} height={120} />
        </div>
        <div className="m-auto flex flex-row justify-around w-5/6 h-2/3">
          <div className="flex flex-col justify-between">
            <Link href={"/about"} className="border-2 rounded-lg p-7 text-center">
              About Us
            </Link>
            <Link href={"/"} className="border-2 rounded-lg p-7 text-center">
              How can we help you?
            </Link>
          </div>
          <Image src={homeImage} alt="logo" width={500} height={800} />
          <div className="flex flex-col justify-between">
            <Link href={"/report"} className="border-2 rounded-lg p-7 text-center">
              Report your experience
            </Link>
            <Link href={"/contact"} className="border-2 rounded-lg p-7 text-center">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
