import { useState } from 'react';
import logo from '../assets/logo.svg';
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";
import { Routes, Route, Link } from 'react-router-dom';

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between p-4 lg:px-8 lg:py-4 bg-white">
        <div className="flex gap-2 items-center lg:gap-3">
          <Link to={'/'}>
            <img src={logo} alt="Logo" className="h-10 w-10 lg:h-14 lg:w-14" />
          </Link>

          <Link to={'/'}>
            <div className='hidden md:flex flex-col cursor-pointer'>
              <div className='text-xl lg:text-3xl relative'>
                <div>Snipply</div>
                <div className='text-xs lg:text-base absolute -bottom-3 lg:-bottom-5 ml-4 lg:ml-7 whitespace-nowrap'>
                  for <span className='font-bold text-green-600'>chatgpt</span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          aria-label="Open menu"
          className='md:hidden'
          onClick={() => setOpen(true)}
        >
          <GiHamburgerMenu size={30} />
        </button>

        {/* Desktop buttons */}
        <div className='gap-2 items-center p-4 hidden md:flex lg:gap-3'>
          <Link to={'/privacy'}>
            <div className='rounded-xl text-base px-4 py-2 hover:bg-neutral-100 cursor-pointer lg:text-xl'>
              Privacy
            </div>
          </Link>
          <a
            href="https://chrome.google.com/webstore" // replace with real URL
            target="_blank"
            rel="noopener noreferrer"
            className='px-6 py-2 rounded-xl border-2 border-pink-600 bg-pink-100 text-neutral-800 cursor-pointer hover:bg-pink-300 transition-all hover:text-white lg:text-xl'
          >
            Install Snipply
          </a>
        </div>
      </header>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* Sidebar / Drawer */}
      <div
        className={`
          fixed top-0 right-0 h-full w-72 max-w-full bg-white shadow-lg z-50 md:hidden
          transform transition-transform duration-300
          ${open ? 'translate-x-0' : 'translate-x-full'}
        `}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="h-8 w-8" />
            <span className="text-lg font-semibold">Snipply</span>
          </div>
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="p-1 rounded hover:bg-neutral-100"
          >
            <AiOutlineClose size={24} />
          </button>
        </div>

        <div className="p-4 flex flex-col gap-4">
          <a
            href="https://chrome.google.com/webstore" // replace with real URL
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center px-4 py-2 rounded-lg bg-pink-500 text-white font-medium hover:bg-pink-600"
          >
            Install for Chrome
          </a>
          <a
            href="https://github.com/your/repo" // replace with real URL
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center px-4 py-2 rounded-lg border border-neutral-300 hover:bg-neutral-100"
          >
            GitHub Repository
          </a>
          <Link
            to="/privacy"
            onClick={() => setOpen(false)}
            className="underline text-sm text-neutral-600"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </>
  );
}
