"use client";

import React from 'react';
import Link from "next/link";

/* Used help in ChatGPT to add link to the button */
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
        <h1 className="text-2xl font-bold mb-6">The door has been closed.</h1>
        <h1 className="text-2xl mb-6">Thank you for interacting with the smart giveaway box and contributing to reducing waste!</h1>
        <h1 className="text-2xl mb-6">We hope we will see you again soon!</h1>
        <h1 className="text-2xl font-bold mb-6"></h1>
        <div className="space-x-8">
        <Link
            href="/inventory"
            className="text-2xl mb-6 px-6 py-3 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
          >
            Go Back To Homepage
          </Link>
        </div>
      </div>
    );
  }