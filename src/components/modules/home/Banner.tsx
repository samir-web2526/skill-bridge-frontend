"use client";

import { Button } from "@/components/ui/button";
import React from "react";

export default function Banner() {
  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat rounded-2xl shadow-2xl overflow-hidden h-[600px] sm:h-[550px] lg:h-[650px]"
      style={{
        backgroundImage: `url('https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg')`,
      }}
    >

      {/* Decorative Shapes */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 sm:px-12 lg:px-24">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 animate-fadeIn">
          Welcome to Skill Bridge
        </h1>
        <p className="text-lg sm:text-xl lg:text-2xl mb-8 max-w-3xl text-gray-800 font-semibold animate-fadeIn delay-200">
          Connect with expert tutors and elevate your skills to the next level.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-6 animate-fadeIn delay-400">
          <Button
            variant="default"
            size="lg"
            className="shadow-lg hover:scale-105 transition-transform duration-300"
          >
            Get Started
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white/20 hover:scale-105 transition-all duration-300"
          >
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
}