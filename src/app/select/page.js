"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { RiCloseCircleFill } from "react-icons/ri";
import {
  FaWindows,
  FaLinux,
  FaApple,
  FaCaretDown,
} from "react-icons/fa";
import * as FaIcons from "react-icons/fa";
import * as SiIcons from "react-icons/si";
import { HiOutlineMenu } from "react-icons/hi";
import stackOptionsData from "../../lib/stackOptions.json";
import PromptStack from "../../components/PromptStack";

export default function SelectStack() {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedStack, setSelectedStack] = useState([]);
  const [os, setOS] = useState("");
  const [popularStacks, setPopularStacks] = useState([]);
  const [userStacks, setUserStacks] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Languages");
  const [selectedVersions, setSelectedVersions] = useState({});
  const [versionModal, setVersionModal] = useState({ open: false, tech: null, position: { top: 0, left: 0 } });

  useEffect(() => {
    // Fetch Popular Stacks from Session Storage or API
    const storedPopularStacks = sessionStorage.getItem("popularStacks");
    if (storedPopularStacks) {
      setPopularStacks(JSON.parse(storedPopularStacks));
    } else {
      async function fetchPopularStacks() {
        try {
          const response = await fetch("/api/popular-stack");
          const data = await response.json();
          if (data.popularStacks) {
            setPopularStacks(data.popularStacks);
            sessionStorage.setItem("popularStacks", JSON.stringify(data.popularStacks));
          }
        } catch (error) {
          console.error("Error fetching popular stacks:", error);
        }
      }
      fetchPopularStacks();
    }
  
    // Fetch Previous Stacks Only When Session is Available
    if (session?.user?.id) {
      fetchUserStacks();
    }
  }, [session]); // Dependency array ensures the session is available before fetching  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (versionModal.open && !event.target.closest('.version-modal')) {
        closeVersionModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [versionModal]);

  const toggleSelection = (tech) => {
    setSelectedStack((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
    if (!selectedVersions[tech]) {
      setSelectedVersions((prev) => ({
        ...prev,
        [tech]: "latest",
      }));
    }
  };

  const toggleStack = (stackTechs) => {
    // Check if all techs in the stack are already selected
    const allSelected = stackTechs.every(tech => selectedStack.includes(tech));
    
    if (allSelected) {
      // If all are selected, remove them
      setSelectedStack(prev => prev.filter(tech => !stackTechs.includes(tech)));
    } else {
      // Otherwise add any missing techs
      const techsToAdd = stackTechs.filter(tech => !selectedStack.includes(tech));
      setSelectedStack(prev => [...prev, ...techsToAdd]);
      
      // Set versions for all techs in the stack
      const newVersions = { ...selectedVersions };
      stackTechs.forEach(tech => {
        if (!newVersions[tech]) {
          newVersions[tech] = "latest";
        }
      });
      setSelectedVersions(newVersions);
    }
  };

  const openVersionModal = (tech, event) => {
    event.stopPropagation(); // Prevent triggering parent click handlers
    
    // Get position of the clicked element
    const rect = event.currentTarget.getBoundingClientRect();
    
    // Calculate initial position (below the dropdown button)
    let modalTop = rect.bottom + window.scrollY;
    let modalLeft = rect.left + window.scrollX;
    
    // Check if modal would go off-screen to the right
    const modalWidth = 256; // 256px (w-64)
    if (modalLeft + modalWidth > window.innerWidth) {
      modalLeft = window.innerWidth - modalWidth - 16; // 16px padding from edge
    }
    
    // Check if modal would go off-screen at the bottom
    const estimatedModalHeight = 300; // Estimate modal height
    if (modalTop + estimatedModalHeight > window.innerHeight + window.scrollY) {
      modalTop = rect.top + window.scrollY - estimatedModalHeight - 8; // Position above the button
    }
    
    setVersionModal({
      open: true,
      tech,
      position: { top: modalTop, left: modalLeft },
    });
  };

  const closeVersionModal = () => {
    setVersionModal({ open: false, tech: null, position: { top: 0, left: 0 } });
  };

  const selectVersion = (version) => {
    setSelectedVersions((prev) => ({
      ...prev,
      [versionModal.tech]: version,
    }));
    if (!selectedStack.includes(versionModal.tech)) {
      setSelectedStack((prev) => [...prev, versionModal.tech]);
    }
    closeVersionModal();
  };

  const handleGenerate = async () => {
    if (!os) {
      alert("Please select your OS before proceeding.");
      return;
    }
    
    // Save stack to database if user is logged in
    if (session?.user?.id && selectedStack.length > 0) {
      try {
        await fetch("/api/save-stack", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: session.user.id,
            stacks: selectedStack,
          }),
        });
        
        // Refresh user stacks in the background
        fetchUserStacks();
      } catch (error) {
        console.error("Error saving stack:", error);
        // Continue with navigation even if save fails
      }
    }
    
    // Navigate to preview page
    const stackWithVersions = selectedStack.map((tech) => ({
      name: tech,
      version: selectedVersions[tech] || "latest",
    }));
    router.push(`/preview?stack=${JSON.stringify(stackWithVersions)}&os=${os}`);
  };

  // Extract fetchUserStacks as a separate function to reuse
  const fetchUserStacks = async () => {
    if (!session?.user?.id) return;
    
    try {
      const res = await fetch(`/api/get-stacks?userId=${session.user.id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch user stacks");
      }
      const data = await res.json();
      if (data.stacks) {
        const uniqueStacks = data.stacks.filter((stack, index, self) =>
          index === self.findIndex((s) => s.name === stack.name && JSON.stringify(s.stacks) === JSON.stringify(stack.stacks))
        );
        setUserStacks(uniqueStacks);
      }
    } catch (error) {
      console.error("Error fetching user stacks:", error);
    }
  };

  // Also update the saveStack function to use fetchUserStacks
  const saveStack = async () => {
    if (!session?.user?.id) {
      alert("Please log in to save your stack.");
      return;
    }
    
    if (selectedStack.length === 0) {
      alert("Please select at least one technology to save.");
      return;
    }
    
    try {
      const response = await fetch("/api/save-stack", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id,
          stacks: selectedStack,
        }),
      });
      
      if (response.ok) {
        // Refresh user stacks after saving
        await fetchUserStacks();
        alert("Stack saved successfully!");
      } else {
        console.error("Failed to save stack");
        alert("Failed to save stack. Please try again.");
      }
    } catch (error) {
      console.error("Error saving stack:", error);
      alert("An error occurred while saving the stack.");
    }
  };

  const handleDelete = async (tech) => {
    try {
      const response = await fetch("/api/save-stack", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stackId: tech._id }),
      });
  
      if (response.ok) {
        setUserStacks((prev) => prev.filter((stack) => stack._id !== tech._id));
      } else {
        console.error("Failed to delete stack");
      }
    } catch (error) {
      console.error("Error deleting stack:", error);
    }
  };

  const stackOptions = stackOptionsData;

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      {/* Mobile Sidebar Toggle Button - Make more visible */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-16 left-4 z-50 md:hidden bg-blue-600 p-2 rounded-full shadow-lg"
      >
        <HiOutlineMenu className="text-white text-xl" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 w-64 sm:w-72 md:w-92 h-full bg-gray-900 p-3 md:p-6 flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 z-40 md:z-50 shadow-lg overflow-y-auto`}
      >
        <div>
          <h1
            className="text-xl md:text-2xl font-semibold cursor-pointer hover:text-gray-300 transition mb-6 md:mb-8"
            onClick={() => router.push("/")}
          >
            stackeX
          </h1>

          {/* Category Navigation */}
          <h2 className="text-base md:text-lg font-medium mb-2 md:mb-3">Stack Categories</h2>
          <nav className="space-y-1 md:space-y-2">
            {["Languages", "Frameworks", "Databases", "Tools"]
              .concat(session ? ["Previous Stacks", "Popular Stacks"] : ["Popular Stacks"])
              .concat(["AI Assistant"])
              .map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`cursor-pointer w-full text-left px-3 md:px-4 py-2 rounded-md transition text-sm md:text-base ${
                    selectedCategory === category
                      ? "bg-gray-700 text-white font-semibold"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >                  
                  {category}
                </button>
              ))}
          </nav>
        </div>

        {/* OS Selection & Generate Button */}
        <div>
          <h2 className="text-base md:text-lg font-medium mb-2 md:mb-3">Select Your OS</h2>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
            {[
              { name: "Windows", icon: FaWindows },
              { name: "Linux", icon: FaLinux },
              { name: "macOS", icon: FaApple },
            ].map(({ name, icon: Icon }) => (
              <button
                key={name}
                onClick={() => setOS(name.toLowerCase())}
                className={`cursor-pointer p-2 md:p-3 flex items-center rounded-md transition w-full justify-center text-sm md:text-base ${
                  os === name.toLowerCase()
                    ? "bg-blue-500 border-blue-600 text-white"
                    : "bg-gray-700 border-gray-600 hover:bg-gray-600"
                }`}
              >
                <Icon className="mr-1 md:mr-2" />
                {name}
              </button>
            ))}
          </div>

          <button
            className="cursor-pointer w-full px-3 md:px-4 py-2 md:py-3 bg-green-500 rounded-md text-base md:text-lg font-semibold transition hover:bg-green-600 disabled:opacity-50 mb-2 md:mb-3"
            onClick={handleGenerate}
            disabled={selectedStack.length === 0}
          >
            Generate Script
          </button>
          
          {session && (
            <button
              className="cursor-pointer w-full px-3 md:px-4 py-2 md:py-3 bg-blue-500 rounded-md text-base md:text-lg font-semibold transition hover:bg-blue-600 disabled:opacity-50"
              onClick={saveStack}
              disabled={selectedStack.length === 0}
            >
              Save Stack
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 ml-0 md:ml-94 transition-all pt-16 md:pt-8">
        <h1 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6">{selectedCategory}</h1>

        {/* Stack Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {selectedCategory === "Previous Stacks" && userStacks.map((stack, index) => (
            <div key={`previous-${index}`} className="relative">
              <button
                onClick={() => toggleStack(stack.stacks)}
                className={`cursor-pointer p-3 md:p-4 w-full flex items-center justify-center space-x-1 md:space-x-2 rounded-md transition border text-sm md:text-base ${
                  stack.stacks.every(tech => selectedStack.includes(tech))
                    ? "bg-blue-500 border-blue-600 text-white"
                    : "bg-gray-800 border-gray-700 hover:bg-gray-700"
                }`}
              >
                <span className="line-clamp-1">{stack.stacks.join(", ")}</span>
              </button>
              <RiCloseCircleFill
                onClick={() => handleDelete(stack)}
                className="absolute top-1 right-1 text-red-500 h-5 w-5 md:h-6 md:w-6 cursor-pointer"
              />
            </div>
          ))}
          
          {selectedCategory === "Popular Stacks" && popularStacks.map((stack, index) => (
            <button
              key={`popular-${index}`}
              onClick={() => toggleSelection(stack.name || stack)}
              className={`cursor-pointer p-3 md:p-4 flex items-center justify-center space-x-1 md:space-x-2 rounded-md transition border text-sm md:text-base ${
                selectedStack.includes(stack.name || stack)
                  ? "bg-blue-500 border-blue-600 text-white"
                  : "bg-gray-800 border-gray-700 hover:bg-gray-700"
              }`}
            >
              <span>{stack.name || stack}</span>
            </button>
          ))}
          
          {stackOptions[selectedCategory]?.map(({ name, icon, versions }) => {
            const IconComponent = FaIcons[icon] || SiIcons[icon];
            const selectedVersion = selectedVersions[name];
            return (
              <div 
                key={name} 
                className="relative bg-gray-800 rounded-lg shadow-lg p-3 md:p-4 cursor-pointer"
                onClick={() => toggleSelection(name)}
              >
                <div className="flex flex-col items-center">
                  <div className="mb-3 md:mb-4">
                    {IconComponent && <IconComponent className="text-4xl md:text-6xl" />}
                  </div>
                  <div className="flex justify-between w-full items-center">
                    <div className="truncate max-w-[75%]">
                      <span className="text-sm md:text-base">{name}{selectedVersion ? ` (v${selectedVersion})` : ""}</span>
                    </div>
                    <div>
                      <FaCaretDown
                        onClick={(e) => openVersionModal(name, e)}
                        className="cursor-pointer ml-1"
                      />
                    </div>
                  </div>
                </div>
                {selectedStack.includes(name) && (
                  <div className="absolute inset-0 bg-blue-500 opacity-20 rounded-lg"></div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* PromptStack Component */}
        {selectedCategory === "AI Assistant" && (
          <div className="flex flex-col mt-4 md:mt-120 w-full bg-gray-950 shadow-lg">
            <PromptStack />
           </div>
        )}
      </main>

      {/* Version Modal - Improved for Mobile */}
      {versionModal.open && (
        <div 
          className="version-modal fixed sm:absolute bg-gray-800 rounded-lg shadow-xl border border-gray-700 w-3/4 sm:w-64 overflow-hidden z-50 left-1/2 top-1/2 sm:top-auto sm:left-auto transform -translate-x-1/2 -translate-y-1/2 sm:transform-none"
          style={{ 
            top: window.innerWidth > 640 ? versionModal.position.top : '50%',
            left: window.innerWidth > 640 ? versionModal.position.left : '50%',
            maxHeight: '60vh',
            animation: 'modalFadeIn 0.2s ease-out'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-700">
            <h2 className="text-base md:text-lg font-medium text-white">Select Version</h2>
            <button 
              onClick={closeVersionModal}
              className="text-gray-400 hover:text-white focus:outline-none transition-colors"
            >
              <RiCloseCircleFill className="h-5 w-5 cursor-pointer" />
            </button>
          </div>
          <div className="p-4 max-h-[40vh] overflow-y-auto">
            <p className="text-xs md:text-sm text-gray-400 mb-3">{versionModal.tech}</p>
            <div className="space-y-1.5">
              {stackOptions[selectedCategory]
                .find((tech) => tech.name === versionModal.tech)
                ?.versions.map((version) => (
                  <button
                    key={version}
                    onClick={() => selectVersion(version)}
                    className={`cursor-pointer w-full text-left px-3 py-2 rounded-md transition-colors text-xs md:text-sm flex items-center justify-between ${
                      selectedVersions[versionModal.tech] === version
                        ? "bg-blue-600/40 text-white"
                        : "text-gray-300 hover:bg-gray-700/50"
                    }`}
                  >
                    <span>{version}</span>
                    {selectedVersions[versionModal.tech] === version && (
                      <span className="text-blue-400">✓</span>
                    )}
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Overlay for version modal on mobile */}
      {versionModal.open && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50" 
          onClick={closeVersionModal}
        ></div>
      )}

      {/* Add this CSS for the modal animation */}
      <style jsx global>{`
        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
