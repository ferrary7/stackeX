"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import {
  MicrophoneIcon,
  PaperAirplaneIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";

export default function PromptStack() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [stackPrompt, setStackPrompt] = useState("");
  const [os, setOS] = useState("");
  const [error, setError] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [showOSModal, setShowOSModal] = useState(false);

  const modalRef = useRef(null);

  const handleGenerateScript = () => {
    if (!stackPrompt.trim()) {
      setError("Please enter a tech stack.");
      return;
    }
    if (!os) {
      setError("Please select an OS.");
      return;
    }

    if (status === "loading") return;

    const redirectUrl = `/preview?stack=${encodeURIComponent(
      stackPrompt
    )}&os=${encodeURIComponent(os)}`;

    if (!session) {
      signIn(undefined, { callbackUrl: redirectUrl });
      return;
    }

    router.push(redirectUrl);
  };

  // Voice Input
  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setStackPrompt(transcript);
    };

    recognition.start();
  };

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowOSModal(false);
      }
    }

    if (showOSModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOSModal]);

  return (
    <div className="w-full max-w-5xl p-3 md:p-6">
      <h2 className="text-lg md:text-xl font-bold text-white ml-1 md:ml-2 mb-3 md:mb-4">
        Let AI architect your perfect dev environment
      </h2>

      {/* Input Box */}
      <div className="relative">
        <textarea
          className="w-full p-2 md:p-4 bg-gray-800 text-white rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner text-sm md:text-base"
          placeholder="Tell me about your stack, and I'll generate the perfect setup. (e.g., Next.js, FastAPI)..."
          rows={4}
          value={stackPrompt}
          onChange={(e) => setStackPrompt(e.target.value)}
        ></textarea>

        {/* Action Buttons */}
        <div className="absolute bottom-3 md:bottom-6 right-3 md:right-4 flex space-x-1 md:space-x-2">
          {/* OS Selection Button */}
          <button
            onClick={() => setShowOSModal(!showOSModal)}
            className="cursor-pointer bg-gray-700 text-white px-2 py-1 md:px-2 rounded-lg flex items-center hover:bg-gray-600 transition text-xs md:text-sm"
          >
            {os ? os : "Select OS"}
            <ChevronDownIcon className="w-3 h-3 md:w-4 md:h-4 ml-1" />
          </button>

          {/* Voice Input */}
          <button
            onClick={handleVoiceInput}
            className={`cursor-pointer bg-gray-700 text-white p-1 md:p-2 rounded-lg ${
              isListening ? "bg-red-500" : "hover:bg-gray-600"
            } transition`}
          >
            <MicrophoneIcon className="w-3 h-3 md:w-4 md:h-4" />
          </button>

          {/* Send Button */}
          <button
            onClick={handleGenerateScript}
            className="cursor-pointer bg-green-500 text-white p-1 md:p-2 rounded-lg hover:bg-green-600 transition"
          >
            <PaperAirplaneIcon className="w-3 h-3 md:w-4 md:h-4" />
          </button>
        </div>

        {/* OS Selection Modal */}
        {showOSModal && (
          <div
            ref={modalRef}
            className="absolute bottom-12 right-3 bg-gray-900 border border-gray-700 rounded-lg shadow-lg w-40 p-2 z-10"
          >
            {["Windows", "Linux", "macOS"].map((option) => (
              <button
                key={option}
                className="cursor-pointer block w-full px-3 py-2 text-left rounded-l text-white hover:bg-gray-800 transition text-sm"
                onClick={() => {
                  setOS(option);
                  setShowOSModal(false);
                }}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}
    </div>
  );
}
