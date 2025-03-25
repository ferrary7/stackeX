"use client";

import { useRouter } from "next/navigation";
import { FaBolt, FaDesktop, FaCogs, FaBrain } from "react-icons/fa"; // Feature icons
import PromptStack from "../components/PromptStack";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-950 text-white px-4 md:px-6">
      {/* Hero Section - Centered */}
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white px-4 md:px-6">
        <div className="w-full flex flex-col items-center py-12 md:py-25">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="text-5xl sm:text-7xl md:text-9xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text text-center">
              StackeX
            </h1>
          </motion.div>
          <p className="text-xl md:text-2xl text-gray-300 mt-2 text-center">
            AI-Powered Stack Generator
          </p>
          <p className="mt-4 text-base md:text-lg text-gray-400 text-center max-w-md md:max-w-xl mx-auto">
            Set up your dev stack up and running—fast and hassle-free!
          </p>
          <button
            onClick={() => router.push("/select")}
            className="mt-6 px-6 py-2 md:px-8 md:py-3 cursor-pointer bg-blue-600 rounded-xl text-base md:text-lg font-semibold shadow-md hover:bg-blue-700 transition-all duration-300"
          >
            Get Started
          </button>
        </div>
        {/* PromptStack Section */}
        <PromptStack />
      </div>

      {/* Features Section */}
      <div className="mt-16 md:mt-32 w-full flex flex-col items-center">
        <h1 className="text-2xl md:text-4xl font-bold text-white text-center mb-8 md:mb-14">
          Smarter. Faster. Automated.
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 max-w-7xl">
          {[
            {
              icon: <FaBolt className="text-blue-400 text-3xl md:text-4xl" />,
              title: "Blazing Fast",
              description:
                "AI-driven automation generates installation scripts in seconds.",
            },
            {
              icon: <FaDesktop className="text-purple-400 text-3xl md:text-4xl" />,
              title: "Cross-Platform",
              description: "Seamlessly works with Windows, Linux, and macOS.",
            },
            {
              icon: <FaCogs className="text-green-400 text-3xl md:text-4xl" />,
              title: "Fully Customizable",
              description:
                "Select your own stack and fine-tune configurations effortlessly.",
            },
            {
              icon: <FaBrain className="text-yellow-400 text-3xl md:text-4xl" />, // AI Feature Icon
              title: "AI-Powered Optimization",
              description:
                "Leverages AI to suggest the best configurations for your tech stack.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-gray-900 p-6 md:p-8 rounded-lg shadow-lg border border-gray-800 text-center transform hover:scale-[1.02] md:hover:scale-[1.05] transition-all duration-300"
            >
              <div className="mb-3 md:mb-4">{feature.icon}</div>
              <h3 className="text-xl md:text-2xl font-semibold text-white text-left">
                {feature.title}
              </h3>
              <p className="mt-2 md:mt-3 text-gray-400 text-base md:text-lg text-left">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="my-24 md:my-60 max-w-4xl w-full flex flex-col items-center px-4">
        <h2 className="text-2xl md:text-4xl font-bold text-white text-center mb-8 md:mb-14">
          How stackeX Works?
        </h2>

        <div className="relative space-y-8 md:space-y-12 border-l-2 md:border-l-4 border-blue-500 pl-6 md:pl-8.5">
          {[
            {
              step: "1",
              title: "Select your tech stack / Prompt the AI Assistant",
              description:
                "Manually pick your stack or let our AI recommend the best setup.",
              icon: "🛠️",
            },
            {
              step: "2",
              title: "Select your target OS and click on generate",
              description:
                "Choose between Windows, macOS, or Linux for an optimized script.",
              icon: "💻",
            },
            {
              step: "3",
              title: "Our AI auto-generates an optimized installation script",
              description:
                "AI-powered automation ensures a seamless setup experience.",
              icon: "🤖",
            },
            {
              step: "4",
              title:
                "Download the script and place it inside your project folder",
              description: "Simply move the file to your project directory.",
              icon: "📂",
            },
            {
              step: "5",
              title: "Run the script, sit back, and relax!",
              description:
                "The script will install all dependencies quickly and efficiently.",
              icon: "🚀",
            },
            {
              step: "6",
              title: "Start coding and building your next big project!",
              description: (
                <>
                  <button
                    onClick={() => router.push("/select")}
                    className="px-6 py-2 md:px-8 md:py-3 cursor-pointer bg-blue-600 rounded-xl text-sm md:text-md font-semibold shadow-md hover:bg-blue-700 text-white transition-all duration-300 mt-4"
                  >
                    Get Started
                  </button>
                </>
              ),
              icon: "💡",
            },
          ].map((item, index) => (
            <div key={index} className="relative flex items-start">
              {/* Step Number */}
              <div className="absolute -left-12 md:-left-16 flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-full bg-linear-to-bl from-blue-400 to-blue-800 text-white font-semibold text-sm md:text-lg shadow-lg">
                {item.step}
              </div>

              {/* Step Content */}
              <div className="ml-2 md:ml-6 p-4 md:p-6 bg-gray-900 rounded-lg shadow-md border border-gray-700 w-full hover:scale-[1.01] md:hover:scale-102 transition-transform duration-300">
                <h3 className="text-lg md:text-2xl font-semibold text-white flex items-center gap-2">
                  <span className="text-xl md:text-3xl">{item.icon}</span> {item.title}
                </h3>
                <p className="mt-2 text-sm md:text-base text-gray-400">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contribute to StackeX Section */}
      <div className="mt-16 md:mt-24 w-full flex flex-col items-center text-center text-gray-400 px-4 pb-16">
        <h3 className="text-2xl md:text-3xl font-bold text-white">Contribute to StackeX</h3>
        <p className="mt-2 text-base md:text-lg max-w-xs sm:max-w-md md:max-w-2xl">
          Have ideas, feedback, or want to improve StackeX? Feel free to
          contribute or reach out!
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <a
            href="https://github.com/ferrary7/stackeX"
            target="_blank"
            className="px-6 py-3 bg-gray-800 text-white rounded-lg 
            hover:bg-gray-700 transition-all duration-300 text-center"
          >
            Contribute on GitHub
          </a>
          <a
            href="mailto:ary7sharma@gmail.com"
            className="px-6 py-3 bg-gray-800 text-white rounded-lg 
            hover:bg-gray-700 transition-all duration-300 text-center"
          >
            Email Me
          </a>
        </div>
      </div>
    </div>
  );
}
