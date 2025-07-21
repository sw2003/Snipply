import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CiBookmark } from 'react-icons/ci';
import { useStore } from '../store';
import TurndownService from 'turndown';   // ESM or CJS build
import { nanoid } from 'nanoid';
import './topbar.css';

const turndownService = new TurndownService({
    headingStyle: "atx",  // optional tweaks
    bulletListMarker: "-", // "- " instead of "* "
});

function getChildJustInsideMarkdown(el) {
    let previous = null;          // will hold the node right before the markdown div
    let current = el;

    while (current) {
        // Stop when we reach a <div class="markdown">
        if (
            current.tagName === 'DIV' &&
            current.classList.contains('markdown')
        ) {
            return previous;          // the node just inside the markdown container
        }
        // Move up one level, keeping track of where we were
        previous = current;
        current = current.parentElement;
    }

    // No markdown container found in the ancestry
    return null;
}

function getIndexWithinMarkdown(el) {
    if (!el || !el.parentElement) return -1;

    const parent = el.parentElement;

    // Confirm we’re really inside the markdown container
    if (!(parent.tagName === 'DIV' && parent.classList.contains('markdown')))
        return -1;

    // HTMLCollection → Array so we can use indexOf
    return Array.from(parent.children).indexOf(el);
}

export default function Topbar() {
    const [isCodeBlock, setIsCodeBlock] = useState(false)
    const bookmarkBtnRef = useRef(null);

    const isSelected = useStore((s) => s.isSelected);
    const setSelected = useStore((s) => s.setSelected);
    const setBookmarkData = useStore((s) => s.setBookmarkData);
    const bookmarkData = useStore((s) => s.bookmarkData)

    const mouseDown = useRef(false);
    const isSelecting = useRef(false);
    const isCollapsed = useRef(false);
    const selectedElement = useRef(null)
    const selectedElement2 = useRef(null)
    const sel = useRef(null);
    const HIGHLIGHT_CLASS = 'bookmark-hover-highlight';

    function highlightRange(container, start, end) {
        // guard · convert live HTMLCollection → real array
        const kids = Array.from(container?.children ?? []);
        if (!kids.length) return;

        // clear old highlight first
        kids.forEach((el) => el.classList.remove(HIGHLIGHT_CLASS));

        // clamp & slice inclusive
        const from = Math.max(0, Math.min(start, end));
        const to = Math.min(kids.length - 1, Math.max(start, end));

        kids.slice(from, to + 1).forEach((el) => {
            // add to the element itself
            el.classList.add(HIGHLIGHT_CLASS);

            // add to every descendant inside that element
            el.querySelectorAll('*').forEach((node) =>
                node.classList.add(HIGHLIGHT_CLASS)
            );
        });


        //kids.slice(from, to + 1).forEach((el) => el.classList.add(HIGHLIGHT_CLASS));
    }

    function clearHighlight(container) {
        container?.querySelectorAll(`.${HIGHLIGHT_CLASS}`)
            .forEach((el) => el.classList.remove(HIGHLIGHT_CLASS));
    }

    /* -------------- your hover handler -------------- */
    const handleHover = () => {
        /* …all the code you already have … */
        const markdownContainer = selectedElement.current?.closest('.markdown')

        const childInsideMarkdownAnchor = getChildJustInsideMarkdown(selectedElement.current)
        const childInsideMarkdownFocus = getChildJustInsideMarkdown(selectedElement2.current)
        const childPositionAnchor = getIndexWithinMarkdown(childInsideMarkdownAnchor);
        const childPositionFocus = getIndexWithinMarkdown(childInsideMarkdownFocus)

        let startIdx = 0
        let endIdx = 0

        if (childPositionFocus === -1) {
            startIdx = childPositionAnchor
            endIdx = childPositionAnchor
        }
        else {
            startIdx = Math.min(childPositionAnchor, childPositionFocus);
            endIdx = Math.max(childPositionAnchor, childPositionFocus);
        }


        if (markdownContainer) {
            highlightRange(markdownContainer, startIdx, endIdx);
        }
    };

    /* -------------- undo on mouse‑leave -------------- */
    const handleLeave = () => clearHighlight(
        selectedElement.current?.closest('.markdown')
    );


    useEffect(() => {
        const handleMouseDown = (e) => {
            mouseDown.current = true;

            // 1.  Get the full event path; this **crosses shadow boundaries**
            //     so it works even when the button lives in a shadow-root.
            const path = e.composedPath ? e.composedPath() : [e.target];

            // 2.  If the click happened **inside** the bookmark button, bail out.
            //     `path.includes()` is enough because we handed React the real DOM
            //     element via `bookmarkBtnRef`.
            if (bookmarkBtnRef.current && path.includes(bookmarkBtnRef.current)) {
                const article = selectedElement.current?.closest('article')
                if (article) {
                    handleLeave()
                    const currentUrl = location.href;
                    const match = currentUrl.match(/\/c\/([0-9a-fA-F-]{36})/);

                    const uuid = match ? match[1] : null;

                    const articleId = article?.getAttribute('data-testid');

                    const markdownContainer = selectedElement.current?.closest('.markdown')

                    const childInsideMarkdownAnchor = getChildJustInsideMarkdown(selectedElement.current)
                    const childInsideMarkdownFocus = getChildJustInsideMarkdown(selectedElement2.current)
                    const childPositionAnchor = getIndexWithinMarkdown(childInsideMarkdownAnchor);
                    const childPositionFocus = getIndexWithinMarkdown(childInsideMarkdownFocus)

                    let startIdx = 0
                    let endIdx = 0

                    if (childPositionFocus === -1) {
                        startIdx = childPositionAnchor
                        endIdx = childPositionAnchor
                    }
                    else {
                        startIdx = Math.min(childPositionAnchor, childPositionFocus);
                        endIdx = Math.max(childPositionAnchor, childPositionFocus);
                    }

                    const htmlChunk = Array.from(markdownContainer.children)
                        .slice(startIdx, endIdx + 1)          // inclusive
                        .map(node => node.outerHTML)          // keep each node’s full markup
                        .join("");


                    const markdown = turndownService.turndown(htmlChunk);
                    const id = nanoid();
                    setBookmarkData({ type: 'appendToList', key: uuid, data: { id: id, markdown: markdown, startIndex: startIdx, endIndex: endIdx, articleId: articleId } })
                }
                return;
            }

            // 3.  For every other click, clear the selection if it is active.
            if (isSelected) {
                setSelected(false);
            }
        }

        const handleMouseUp = () => {
            mouseDown.current = false;
            const okToSelect =
                selectedElement.current?.closest('article') &&   // ← one line!
                isSelecting.current &&
                !isCollapsed.current &&
                sel.current;

            if (okToSelect) setSelected(true);

            if (selectedElement.current?.closest('code')) {
                setIsCodeBlock(true)
            }
            else {
                setIsCodeBlock(false)
            }

            isSelecting.current = false;
        };

        const handleSelectionChange = () => {
            const currentSel = document.getSelection();
            sel.current = currentSel;
            isSelecting.current = true;
            isCollapsed.current = currentSel ? currentSel.isCollapsed : true;

            if (currentSel && !currentSel.isCollapsed) {
                const node = currentSel.anchorNode;
                const end_node = currentSel.focusNode;

                selectedElement.current =
                    node?.nodeType === 3 ? node.parentElement : node; // text → parent

                selectedElement2.current =
                    end_node?.nodeType === 3 ? end_node.parentElement : end_node;

            } else {
                selectedElement.current = null; // no active selection
                selectedElement2.current = null;
            }
        };

        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('selectionchange', handleSelectionChange);

        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('selectionchange', handleSelectionChange);
        };
    }, [setSelected, isSelected]);

    return (
        <>
            {
                isSelected && (
                    <div className='p-1 rounded-lg  mt-4 flex gap-2 dark:bg-[#303030] ' ref={bookmarkBtnRef}>
                        <div
                            className='flex gap-1 items-center p-1  hover:dark:bg-[#ffffff1a] rounded-lg cursor-pointer text-sm'
                            onMouseEnter={handleHover}     // 🔆 highlight range
                            onMouseLeave={handleLeave}     // 🚫 un‑highlight

                        >
                            <CiBookmark size={20}></CiBookmark>
                            <span className='text-sm'>Bookmark</span>
                        </div>
                        {
                            isCodeBlock && (
                                <div className='flex gap-1 items-center p-1  hover:dark:bg-[#ffffff1a] rounded-lg cursor-pointer text-sm'>
                                    <CiBookmark size={20}></CiBookmark>
                                    <span className='text-sm'>Bookmark Code</span>
                                </div>
                            )
                        }
                    </div>
                )
            }
        </>
    )
}