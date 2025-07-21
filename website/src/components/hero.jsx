import GoogleChromeLogo from "../assets/chrome.png"
import { FaGithub } from "react-icons/fa";
import { GrInstallOption } from "react-icons/gr";
import { Routes, Route, Link } from 'react-router-dom';

export default function Hero() {
    return (
        <div className=" bg-pink-100 p-2 pl-4 pb-8 ">
            <div className=" max-w-[95%] font-semibold text-3xl leading-[1.5] text-neutral-900 md:text-5xl md:max-w-[55%] xl:ml-8 xl:text-6xl">Capture, organize, revisit your best prompts. </div>
            <div className=" max-w-[85%] text-sm mt-2 text-neutral-800 md:text-3xl md:max-w-[75%] xl:ml-8 xl:text-4xl">
                A simple bookmarking extension for ChatGPT. Everything is stored locally and fully open source.
                Try it now and never lose a prompt again.  <span className=" p-0.5 underline cursor-pointer">
                    <Link to='/privacy'>
                        your privacy
                    </Link>
                </span>
            </div>
            <div className=" max-w-[268px] w-full mt-8 bg-pink-500 text-neutral-100 rounded p-2 flex gap-2 items-center justify-center md:max-w-[468px] md:py-4 md:mt-12 xl:ml-8 xl:max-w-[668px] xl:py-8 xl:text-xl xl:mt-16 cursor-pointer">
                <span>Install for Chrome</span>
                <div className="lg:hidden">
                    <GrInstallOption size={20}></GrInstallOption>
                </div>
                <div className="hidden lg:block">
                    <GrInstallOption size={35}></GrInstallOption>
                </div>
            </div>

            <div className="max-w-[268px] w-full mt-4 border border-black bg-neutral-800 text-neutral-100 rounded p-2 flex justify-center items-center gap-2 md:max-w-[468px] md:py-4 xl:ml-8 xl:max-w-[668px] xl:py-8 xl:text-2xl cursor-pointer">
                <span>Github Repository</span>
                <div className="lg:hidden">
                    <FaGithub size={20}></FaGithub>
                </div>
                <div className="hidden lg:block">
                    <FaGithub size={35}></FaGithub>
                </div>
            </div>


        </div>
    )
}