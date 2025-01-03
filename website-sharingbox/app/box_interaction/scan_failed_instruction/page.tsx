"use client";

import React from 'react';
import Link from "next/link";

/* Used help in ChatGPT to add the links to the FAQ and support pages as well as its hovering effects */
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
        <h1 className="text-2xl font-bold mb-6">The scan has failed...</h1>
        <h1 className="text-2xl mb-6">Your item is not allowed to be put into the box.</h1>
        <h1 className="text-2xl mb-6">Please refer to the {" "}
        <Link href="/about_us_and_faq" className="text-white underline hover:text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-500">
          FAQ page
        </Link>{" "} to check which type of items are allowed.</h1>
        <h1 className="text-2xl mb-6">If you think your item fits the description of an allowed item, please try to scan it again or contact us through the <Link href="/support" className="text-white underline hover:text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-500">
          support page
        </Link>{" "} if there are problems.</h1>
        <h1 className="text-2xl mb-6"></h1>
        <div className="space-x-8">
        <Link
            href="/box_interaction/scan_instruction"
            className="text-2xl mb-6 px-6 py-3 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
          >
            Try Again
          </Link>
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