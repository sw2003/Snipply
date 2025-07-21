import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import ReactMarkdown   from 'react-markdown';
import remarkGfm       from 'remark-gfm';
import rehypeRaw       from 'rehype-raw';
import rehypeSanitize  from 'rehype-sanitize';

export default function MarkdownContainer({ markdown, onClick }) {
  const boxRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [open, setOpen] = useState(false);

  /* -------------------------------------------------
   * 1️⃣  Overflow check.
   *     We do it in useLayoutEffect so measurement
   *     runs *after* the DOM is painted but before
   *     the browser draws another frame.
   * ------------------------------------------------- */
  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return;

    const check = () => {
      setIsOverflowing(el.scrollHeight > el.clientHeight);
    };

    check();                       // initial pass

    // If images/tables load later, watch size mutations:
    const ro = new ResizeObserver(check);
    ro.observe(el);

    return () => ro.disconnect();
  }, [markdown]);                  // re‑measure when content changes

  /* -------------------------------------------------
   * 2️⃣  Render
   * ------------------------------------------------- */
  return (
    <div className="relative">
      <div
        ref={boxRef}
        className={`markdown transition-max-h duration-200 ease-in-out cursor-pointer ${
          open
            ? 'max-h-none'               // fully open
            : 'max-h-[100px] overflow-hidden' // collapsed
        }`}
        onClick={onClick}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeSanitize]}
        >
          {markdown}
        </ReactMarkdown>
      </div>

      {/* Fade at bottom when collapsed (optional eye‑candy) */}
      {!open && isOverflowing && (
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-6
                        bg-gradient-to-t from-white/90 dark:from-black/90 to-transparent" />
      )}

      {/* 3️⃣  Toggle button */}
     
        <button
          className="mt-2 text-sm font-medium text-blue-600 hover:underline"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Show less ▲' : 'Show more ▼'}
        </button>
    </div>
  );
}
