"use client";

import React from 'react';
import Link from 'next/link';
import Navigation from '../../components/Navigation';

/* Used help in ChatGPT to add links to the buttons */
export default function Page() {
    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col items-center">
          {/* Header Section */}
          <header className="w-full bg-blue-600 text-white shadow-lg">
            <div className="container mx-auto px-10 py-16">
              <h1 className="text-5xl font-extrabold text-center">Sharing Box Köln!</h1>
            </div>
          </header>
          <Navigation />
          {/* Main Content */}
          <h1 className="text-2xl font-bold mb-6"></h1>
        <h1 className="text-2xl font-bold mb-6">Do you want to take or donate an item?</h1>
        <h1 className="text-2xl font-bold mb-6"></h1>
        <div className="space-x-8">
          <Link
            href="/box_interaction/take_instruction"
            className="text-2xl mb-6 px-6 py-3 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
          >
            Take Item
          </Link>
          <Link
            href="/box_interaction/scan_instruction"
            className="text-2xl mb-6 px-6 py-3 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
          >
            Donate Item
          </Link>
        </div>
      </div>
    );
  }