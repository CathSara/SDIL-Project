"use client";

import React from 'react';
import { FadeLoader } from 'react-spinners';

export default function Page() {
    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col items-center">
          {/* Header Section */}
          <header className="w-full bg-blue-600 text-white shadow-lg">
            <div className="container mx-auto px-10 py-16">
              <h1 className="text-5xl font-extrabold text-center">Sharing Box Köln!</h1>
            </div>
          </header>
    
          {/* Main Content */}
          <h1 className="text-2xl font-bold mb-6"></h1>
          <FadeLoader color="white" /> {/* Loading animation, more can be found on: https://www.davidhu.io/react-spinners/ */}
          <h1 className="text-2xl font-bold mb-6"></h1>
        <h1 className="text-2xl mb-6">Your item is being scanned right now! Please wait a few seconds.</h1>
        <div className="space-x-8">
        </div>
      </div>
    );
  }