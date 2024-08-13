import Link from "next/link";
import type { NextPage } from "next";
import Image from "next/image";
import homeImage from "../public/home.png";
import logo from "../public/logo.jpg";
import { Chat } from "./_components";

const Home: NextPage = () => {

  return (
    <div className="drawer drawer-end">
      <input id="chat-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <div className="flex items-center flex-col pt-10 w-100vw h-100vh">
          <div className="mx-auto">
            <Image src={logo} alt="logo" width={120} height={120} />
          </div>
          <div className="m-auto flex flex-row justify-around w-5/6 h-2/3">
            <div className="flex flex-col justify-between">
              <Link href={"/about"} className="border-2 rounded-lg p-7 text-center">
                About Us
              </Link>
              <label htmlFor="chat-drawer" className="drawer-button border-2 rounded-lg p-7 text-center">How can we help you?</label>
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
      </div>
      <div className="drawer-side z-[1000]">
        <label htmlFor="chat-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <div className="bg-base-200 h-full w-[32rem] p-4">
          <Chat />
        </div>
      </div>
    </div>
  );
};

export default Home;
