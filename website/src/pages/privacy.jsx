export default function Privacy() {
    return (
      <main className="mx-auto max-w-2xl p-6 text-sm leading-relaxed text-gray-800">
        <h1 className="text-3xl font-semibold mb-4 text-gray-900">Snipply Privacy Policy</h1>
        <p className="mb-4 text-gray-700">
          <strong>Last updated:</strong> {new Date().toLocaleDateString()}
        </p>
  
        <p className="mb-4">
          Snipply is a Chrome extension that lets you bookmark and organize ChatGPT prompts.
          We respect your privacy and built Snipply so that all data stays on <em>your</em> device.
        </p>
  
        <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-900">What We Store</h2>
        <p className="mb-4">
          Snipply stores your bookmarks, notes, and settings locally in your browser’s storage.
          This data never leaves your computer.
        </p>
  
        <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-900">No Data Collection</h2>
        <p className="mb-4">
          We do not collect, transmit, sell, or share any personal or sensitive information.
          Snipply does not use external servers, analytics, tracking scripts, or cookies.
        </p>
  
        <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-900">Your Control</h2>
        <p className="mb-4">
          You can delete all Snipply data at any time by removing the extension or clearing your
          browser’s site data/storage.
        </p>
  
        <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-900">Changes</h2>
        <p className="mb-4">
          If this policy ever changes, we will update this page. Continued use after changes
          constitutes acceptance of the updated policy.
        </p>
  
        <p className="mt-8 text-gray-700">
          If you have questions, please open an issue on the project repository.
        </p>
      </main>
    );
  }
  