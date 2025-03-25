"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <nav
      className={`${
        pathname === "/select" || pathname === "/" ? "bg-gray-950" : "bg-gray-900"
      } text-white sticky p-4 flex justify-between items-center top-0 left-0 px-5 w-full z-50 shadow-md transition-all`}
    >
      {/* Logo */}
      <h1
        className="text-2xl font-bold cursor-pointer hover:text-gray-400 transition"
        onClick={() => (window.location.href = "/")}
      >
        stackeX
      </h1>

      {/* User Authentication Section */}
      <div className="flex items-center space-x-4">
        {session ? (
          <>
            <span className="text-gray-300 hidden sm:inline-block">
              Welcome, {session.user.name}
            </span>
            <button
              onClick={() => signOut()}
              className="cursor-pointer bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => signIn("google")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
          >
            Login with Google
          </button>
        )}
      </div>
    </nav>
  );
}
