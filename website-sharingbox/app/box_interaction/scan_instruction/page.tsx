"use client";

import React from 'react';

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
        <h1 className="text-2xl font-bold mb-6">The door has opened.</h1>
        <h1 className="text-2xl mb-6">Please put your item on the upper shelf of the box.</h1>
        <h1 className="text-2xl mb-6">It will automatically scan it and check if your item is allowed.</h1>
        <div className="space-x-8">
        </div>
      </div>
    );
  }