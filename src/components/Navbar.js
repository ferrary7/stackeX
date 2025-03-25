"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Track pathname changes to simulate loading
  useEffect(() => {
    // Start loading when pathname changes
    setLoading(true);
    setProgress(10);

    const incrementInterval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 90) {
          clearInterval(incrementInterval);
          return 90;
        }
        return prevProgress + 10;
      });
    }, 100);

    // Complete loading after pathname change is done
    const completeTimeout = setTimeout(() => {
      setProgress(100);
      
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 200);
    }, 500);

    return () => {
      clearInterval(incrementInterval);
      clearTimeout(completeTimeout);
    };
  }, [pathname]);

  return (
    <nav
      className={`${
        pathname === "/select" || pathname === "/" ? "bg-gray-950" : "bg-gray-900"
      } text-white sticky p-3 md:p-4 flex justify-between items-center top-0 left-0 px-4 md:px-5 w-full z-50 shadow-md transition-all`}
    >
      {/* Logo */}
      <h1
        className="text-xl md:text-2xl font-bold cursor-pointer hover:text-gray-400 transition"
        onClick={() => (window.location.href = "/")}
      >
        stackeX
      </h1>

      {/* User Authentication Section */}
      <div className="flex items-center space-x-2 md:space-x-4">
        {session ? (
          <>
            <span className="text-gray-300 hidden sm:inline-block text-sm md:text-base">
              Welcome, {session.user.name}
            </span>
            <button
              onClick={() => signOut()}
              className="cursor-pointer bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition text-sm md:text-base"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => signIn("google")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition text-sm md:text-base whitespace-nowrap"
          >
            Login with Google
          </button>
        )}
      </div>
      
      {/* Loading Bar */}
      <div className="absolute z-100 bottom-0 left-0 h-0.5 md:h-1 w-full bg-transparent">
        <div 
          className={`h-full bg-white transition-all duration-300 ease-in-out ${loading ? 'opacity-100' : 'opacity-0'}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </nav>
  );
}
