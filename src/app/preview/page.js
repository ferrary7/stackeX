"use client";

import { Suspense } from "react";

export default function Preview() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold mt-6 md:mt-10 mb-5">📜 Installation Script Preview</h1>
      <Suspense fallback={<p className="mt-4 text-gray-300">Loading...</p>}>
        <PreviewContent />
      </Suspense>
    </div>
  );
}

// Separated component that uses useSearchParams
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

function PreviewContent() {
  const searchParams = useSearchParams();
  const stack = searchParams.get("stack")?.split(",") || [];
  const os = searchParams.get("os");
  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [error, setError] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);

  useEffect(() => {
    if (stack.length === 0 || hasFetched || !os) return;

    const fetchScript = async () => {
      setLoading(true);
      try {
        const response = await axios.post("/api/generate-script", { stack, os });
        setScript(response.data.script);
        if (response.data.script.includes("Error generating script")) {
          setError(true);
        }
      } catch (error) {
        console.error("Error fetching script:", error);
        setScript("# Error generating script. Please try again.");
        setError(true);
      }
      setLoading(false);
      setHasFetched(true);
    };

    fetchScript();
  }, [stack, os, hasFetched]);

  const downloadScript = () => {
    if (!script || error) return;
    const filename = os === "windows" ? "install.ps1" : "install.sh";
    const blob = new Blob([script], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // ✅ Show "Thank You" message
    setDownloadStarted(true);

    // ⏳ Hide message after 3 seconds
    setTimeout(() => setDownloadStarted(false), 3000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(script).then(() => {
      alert("Copied to clipboard!");
    });
  };

  return (
    <>
      {loading ? (
        <p className="mt-4 text-gray-300">Generating script...</p>
      ) : (
        <>
          <div className="relative mt-4">
            <button
              onClick={copyToClipboard}
              className="cursor-pointer absolute top-2 right-2 px-2 py-1 md:px-3 md:py-1 bg-blue-600 text-xs md:text-sm rounded-md hover:bg-blue-700"
            >
              Copy
            </button>
            <pre className="bg-gray-800 p-3 md:p-4 rounded-xl overflow-x-auto text-sm md:text-base">
              <code>{script}</code>
            </pre>
          </div>

          {!error && (
            <>
              <div className="flex flex-col sm:flex-row mt-6 gap-3">
                <button
                  onClick={downloadScript}
                  className="cursor-pointer px-4 py-2 md:px-6 md:py-3 rounded-lg text-base md:text-lg font-semibold bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                >
                  Download {os === "windows" ? ".ps1 (Windows)" : ".sh (Linux/macOS)"}
                </button>

                <button
                  onClick={() => window.location.href = "/select"}
                  className="cursor-pointer px-4 py-2 md:px-6 md:py-3 rounded-lg text-base md:text-lg font-semibold bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                >
                  Select Another Stack
                </button>
              </div>

              {downloadStarted && (
                <p className="mt-4 text-green-400 text-base md:text-lg transition-opacity duration-500 ease-in-out">
                  ✅ Thank you! Your download has started.
                </p>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
