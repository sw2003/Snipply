import React from "react";
import { createRoot } from 'react-dom/client';
import MyWidget from './components/timelineWidget';
import Topbar from "./components/topbar";

runAfterHydration(() => {
  /* ----- your existing mount / shadow-DOM code here ----- */

  // ---- Globals ----
  let savedRange = null;   // precise range of the selection
  let savedElement = null;   // nearest element that holds the selection

  const mount = document.createElement('div');
  Object.assign(mount.style, {
    position: 'absolute',  // or 'absolute' if you prefer relative to main
    top: '65px',
    right: '25px',
    zIndex: '9999',
    margin: '0',  // This sets the margin-right to 0
  });

  document.body.appendChild(mount);

  const shadowRoot = mount.attachShadow({ mode: 'open' });

  // Create a container for your React app inside the shadow root
  const shadowContainer = document.createElement('div');
  shadowRoot.appendChild(shadowContainer);

  const style = document.createElement('style');
  style.textContent = /* css */ `
/* ─── Base markdown text (≈ ‑30 %) ───────────────────────── */
.markdown { font-size: 0.56rem !important; }   /* up from 0.40rem */

/* ─── Headings ───────────────────────────────────────────── */
.markdown h1:first-child { margin-top: 0 !important; }
.markdown h1 { font-weight: 600 !important; margin-top: 0 !important; font-size: 0.88rem !important; }
.markdown h2 { font-size: 0.68rem !important; font-weight: 600 !important; }
.markdown h3 { font-size: 0.56rem !important; font-weight: 600 !important; }

/* ─── Lists ──────────────────────────────────────────────── */
.markdown ol           { list-style-type: decimal !important; padding-left: 2.225em !important; }
.markdown ol li        { margin: 0.5em 0 !important; }

.markdown ul           { list-style-type: disc !important;   padding-left: 2.225em !important; }
.markdown ul li::marker{ unicode-bidi: isolate !important;   font-variant-numeric: tabular-nums !important; }
.markdown ul li        { margin: 0.5em 0 !important; }

/* ─── Tables ─────────────────────────────────────────────── */
.markdown table        { width: 100% !important; margin-top: 8px !important; border-spacing: 0 !important; padding: 4px !important; }
.markdown th, .markdown td { border-width: 1px !important; }
.markdown th:first-child { border-radius: 5px !important; }
.markdown th:last-child,
.markdown td:last-child { border-right-width: 1px !important; border-left-width: 1px !important; }

/* ─── Inline code ────────────────────────────────────────── */
.markdown code {
  background-color: #2d2d2d;
  color: #f2f3f5;
  border-radius: 5px;
  padding: 0.15em 0.45em;
  font-family: SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 0.52em !important;      /* up from 0.375em */
  line-height: 1.35;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

/* ─── Block code fences ─────────────────────────────────── */
.markdown pre > code {
  display: block;
  background-color: #1e1e1e;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 0.52rem !important;     /* up from 0.375rem */
}
`;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = chrome.runtime.getURL('output.css'); // or 'dist/output.css' if that’s your structure
  shadowRoot.appendChild(link);

  shadowRoot.prepend(style);


  /*
  const link_markdown = document.createElement('link');
  link_markdown.rel = 'stylesheet';
  link_markdown.href = chrome.runtime.getURL('markdown.css'); // or 'dist/output.css' if that’s your structure
  shadowRoot.appendChild(link);
  */

  // Mount your React component
  const root = createRoot(shadowContainer);
  root.render(
    <MyWidget />
  );
  const main = document.getElementById('main');

  if (main) {
    // 2. Create a fixed div
    const rect = main.getBoundingClientRect();
    const header = document.getElementById("page-header");
    const headerHeight = header.offsetHeight;
    const extraSpacing = 20; // adjust as needed (in pixels)

    const mount = document.createElement('div');
    mount.style.position = 'fixed';
    mount.style.top = `${headerHeight + extraSpacing}px`;
    mount.style.left = `${rect.left + rect.width / 2}px`;
    mount.style.zIndex = '9999';
    mount.style.transform = 'translate(-50%, -50%)';

    document.body.appendChild(mount);

    const shadowRoot = mount.attachShadow({ mode: 'open' });

    // Create a container for your React app inside the shadow root
    const shadowContainer = document.createElement('div');
    shadowRoot.appendChild(shadowContainer);
    //shadowContainer.id = 'topbar-container';
    shadowRoot.id = 'topbar-container'

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = chrome.runtime.getURL('output.css'); // or 'dist/output.css' if that’s your structure
    shadowRoot.appendChild(link);


    // 4. Create the React root and render into the div
    const root = createRoot(shadowRoot);
    root.render(<Topbar />);
  } else {
    console.error('No element with id="main" found.');
  }
});

function runAfterHydration(cb) {
  if (document.readyState === 'complete') {
    // All scripts (including the page’s React bundle) have run.
    requestIdleCallback(cb);          // give React a beat to hydrate
  } else {
    window.addEventListener('load', () => requestIdleCallback(cb));
  }
}
