"use client";
import "./globals.css";
import Navbar from "../components/Navbar";

import { SessionProvider } from "next-auth/react";
import Head from "next/head";

export default function RootLayout({ children }) {
  return (
    <SessionProvider>
      <Navbar />
      <html lang="en">
        <Head>
          <title>stackeX</title>
        </Head>
        <body>{children}
          <div className="w-full h-40 bg-gradient-to-b from-gray-950 to-black"></div>
        </body>
      </html>
    </SessionProvider>
  );
}
