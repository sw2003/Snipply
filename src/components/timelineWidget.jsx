import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CiBookmark } from 'react-icons/ci';
import { useStore } from '../store';
import { shallow } from 'zustand/shallow';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import MarkdownContainer from './markdownContainer';
import { FaTrash, FaGoogle } from "react-icons/fa";
import { FaSortAmountDown } from "react-icons/fa";
import { FaSync } from "react-icons/fa";
import { IoHelpCircle } from "react-icons/io5";

const EMPTY = [];


function scrollChildIntoView(container, child, { align = "start", smooth = true } = {}) {
  if (!container || !child) return;

  // distance from the top edge of the container *content* to the top of `child`
  const offset =
    child.getBoundingClientRect().top   // distance to viewport
    - container.getBoundingClientRect().top // subtract container's viewport distance
    + container.scrollTop;                  // add current scroll position

  // adjust for alignment
  const top =
    align === "center"
      ? offset - (container.clientHeight / 2 - child.offsetHeight / 2)
      : align === "end"
        ? offset - (container.clientHeight - child.offsetHeight)
        : offset; // "start" (default)

  container.scrollTo({
    top,
    behavior: smooth ? "smooth" : "auto",
  });
}

function scrollToConversationFragment(articleId, startIndex) {
  if (!articleId && startIndex == null) return;

  const teststr = `article[data-testid="${articleId}"]`

  const article = document.querySelector(
    teststr
  );


  if (!article) {
    console.warn("Bookmark: article not found →", articleId);
    return;
  }

  /* 2️⃣  Find the markdown container inside that article */
  const markdown = article.querySelector(".markdown");
  if (!markdown) {
    console.log("scroll using the article worst case!")
    // Worst-case fallback – at least bring the article into view
    article.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  /* 3️⃣  Grab the N-th child element inside the markdown container */
  const target = markdown.children?.[startIndex];
  const el = target || markdown;

  const container = document.querySelector("#thread > div > div.flex.basis-auto.flex-col.-mb-\\(--composer-overlap-px\\).\\[--composer-overlap-px\\:55px\\].grow.overflow-hidden > div > div")

  scrollChildIntoView(container, el, { align: "center" })
}

const MyWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const setCurrentUuid = useStore((state) => state.setCurrentUuid);
  const currentUuid = useStore((state) => state.currentUuid);

  const iconRef = useRef(null);
  const popoverRef = useRef(null);
  const bookmarkData = useStore((s) => s.bookmarkData)
  const removeBookmarkById = useStore((state) => state.removeBookmarkById);

  const bookmarksForCurrent = useStore(
    (s) => (s.currentUuid ? s.bookmarkData[s.currentUuid] ?? EMPTY : EMPTY),
    shallow                                   // <── 2️⃣ shallow equality
  );

  useEffect(() => {
    console.log(bookmarksForCurrent)
    console.log(bookmarkData)
    console.log(currentUuid)
  }, [bookmarksForCurrent, currentUuid, bookmarkData])

  /* ------------ improved click-outside handler ------------ */
  const handleGlobalClick = useCallback((e) => {
    const path = e.composedPath
      ? e.composedPath()          // works across Shadow DOM
      : (e.target ? [e.target] : []);

    // Close only if the click is *not* on the icon *and* not in the popover
    if (!path.includes(iconRef.current) && !path.includes(popoverRef.current)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    // Use 'click', not 'mousedown', so the icon’s onClick runs first
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [handleGlobalClick]);

  useEffect(() => {
    let lastUrl = location.href;
    const currentUrl = location.href;
    const match = currentUrl.match(/\/c\/([0-9a-fA-F-]{36})/);

    const uuid = match ? match[1] : null;
    setCurrentUuid(uuid)

    const observer = new MutationObserver(() => {
      const currentUrl = location.href;
      if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        const match = currentUrl.match(/\/c\/([0-9a-fA-F-]{36})/);

        const uuid = match ? match[1] : null;
        setCurrentUuid(uuid)
        // 🔧 do something on URL change here
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect(); // 🧹 tidy up when the component unmounts
    };
  }, []);

  /* -------------------------------------------------------- */

  return (
    <div className="relative h-25vh p-1 z-[9999]">
      {/* icon */}
      <button
        ref={iconRef}
        onClick={() => setIsOpen((open) => !open)}
        className="p-2 rounded-full flex items-center justify-center dark:bg-[#303030] hover:dark:bg-[#ffffff1a] cursor-pointer"
      >
        <CiBookmark size={25} className="text-white" />
      </button>


      {/* pop-over */}
      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute top-14 right-0 w-[500px] h-[400px]
          rounded-lg bg-white shadow-lg p-2 z-50 dark:bg-[#2f2f2f] flex flex-col"
        >
          <div className='w-full flex justify-between mb-4'>
            <div className='flex gap-2 items-center'>

            </div>
            <div></div>
            <div className='flex gap-1 justify-center items-center '>
              {
                /*
                <button
                  className='bg-neutral-700 cursor-pointer px-1 py-1 rounded'
                  title='sort'
                >
                  <FaSortAmountDown size={20}></FaSortAmountDown>
                </button>
                */
              }

              {
                /*
                <button
                  className=' px-1 py-1 rounded flex gap-2 items-center bg-neutral-700  cursor-pointer'
                  title='sign in'
                >
                  <FaGoogle size={20}></FaGoogle>
                  <span className='text-xs'>Sign in with Google</span>
                </button>
                */
              }
              <a
                href="http://localhost:5173"
                target="_blank"
                rel="noopener noreferrer"
                className="px-1 py-1 rounded-full flex gap-2 items-center bg-neutral-700 cursor-pointer"
                title="help"
              >
                <IoHelpCircle size={20} />
              </a>
            </div>
          </div>
          <div className=' overflow-y-auto h-full w-full dark:bg-[#2f2f2f]'>


            {/* demo content */}
            {bookmarksForCurrent.length ? (
              bookmarksForCurrent.map(({ id, markdown, articleId, startIndex }) => (
                <div
                  key={id} className="mb-2 px-1 py-0.5 rounded hover:bg-black/5 leading-snug max-w-none"

                >
                  <div className='flex gap-2 w-full'>
                    <div className='w-5/6'>
                      <MarkdownContainer markdown={markdown} onClick={() => scrollToConversationFragment(articleId, startIndex)}></MarkdownContainer>
                    </div>
                    <div className=' w-1/6 flex justify-between'>
                      <div></div>
                      <div
                        className='flex flex-col items-center justify-center cursor-pointer hover:text-red-300'
                        onClick={(e) => {
                          removeBookmarkById(currentUuid, id); // ✨ delete array item
                        }}
                      >
                        <FaTrash size={20}></FaTrash>
                      </div>

                      <div className=' w-2 h-full bg-red-300 rounded flex justify-center items-center'>

                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm italic text-gray-500 dark:text-gray-400">
                No bookmarks for this conversation yet.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyWidget;

//prose prose-sm dark:prose-invert