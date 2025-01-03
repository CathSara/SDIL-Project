"use client";

import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import Link from "next/link";

/* Used help in ChatGPT to add simple toggle bars for FAQ and the links to Take/Donate page as well as its hovering effects */
export default function Page() {

  /* Toggle bar with question opened or closed? */
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

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
          {/* About Us */}
          <h1 className="text-2xl font-bold mb-6">About Us</h1>
          <h1 className="text-xl mb-2">We are a group of students of the University of Cologne that has dedicated this project to create an innovative solution for a more sustainable future.</h1>
          <h1 className="text-xl mb-2">The smart giveaway box is a prototype that aims to increase the life cycle of products, reduce waste and promote community sharing.</h1>
          <h1 className="text-xl mb-2">Do you have any items that you do no longer need and might be more useful for others? Do you want to collect any free items? Or do you just want to make our world a little bit more sustainable?</h1>
          <h1 className="text-xl mb-2">In any case, you are at the right place!</h1>
          <h1 className="text-xl mb-2">Whether you want to donate or take items for your own purpose or for supporting sustainability, we are excited to see you joining our community!</h1>
          <h1 className="text-xl mb-2"></h1>
          <h1 className="text-xl font-bold mb-2">Project Team:</h1>
          <h1 className="text-xl mb-2">Tim Hebestreit, Chiara Seidenath, Johannes Simon, Max Unterbusch and Leonard Glock</h1>
          <h1 className="text-2xl font-bold mb-6"></h1>
          {/* FAQ */}
          <h1 className="text-2xl font-bold mb-6">FAQ</h1>
          <div>
          <button
            className="text-xl mb-6 font-bold w-full border-2 border-white text-left p-4 bg-blue-700 hover:bg-blue-800"
            onClick={() => toggleFAQ(1)}
          >
            What is the smart giveaway box?
          </button>
          {activeIndex === 1 && (
            <p className="text-xl mb-6 p-4 bg-blue-800">It is a combination of: <li>the usage of common giveaway boxes,</li> <li>the design and location of public bookcases and</li> <li>technological components that provide security and smart inventory management.</li> </p>
          )}
        </div>
        <div>
          <button
            className="text-xl mb-6 font-bold w-full border-2 border-white text-left p-4 bg-blue-700 hover:bg-blue-800"
            onClick={() => toggleFAQ(2)}
          >
            How can I donate an item?
          </button>
          {activeIndex === 2 && (
            <p className="text-xl mb-6 p-4 bg-blue-800">After you have logged in, please open the page {" "}
            <Link href="/box_interaction/take_or_donate" className="text-white underline hover:text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-500">
              "Take/Donate an Item",
            </Link>{" "} click on the button "Donate Item" and then follow the instructions on the website.</p>
          )}
        </div>
        <div>
          <button
            className="text-xl mb-6 font-bold w-full border-2 border-white text-left p-4 bg-blue-700 hover:bg-blue-800"
            onClick={() => toggleFAQ(3)}
          >
            Which items are allowed to be put into the box?
          </button>
          {activeIndex === 3 && (
            <p className="text-xl mb-6 p-4 bg-blue-800">You are allowed to donate material goods that are not in poor condition. You are not allowed to donate any food items. Before you are able to donate, the box scans your item to check these conditions.</p>
          )}
        </div>
        <div>
          <button
            className="text-xl mb-6 font-bold w-full border-2 border-white text-left p-4 bg-blue-700 hover:bg-blue-800"
            onClick={() => toggleFAQ(4)}
          >
            How does the box recognize whether my item is allowed to be put into the box?
          </button>
          {activeIndex === 4 && (
            <p className="text-xl mb-6 p-4 bg-blue-800">Once you put your item into the upper shelf of the box, it takes a picture of the item and sends it to the server for the recognition. You will then see the result on the website.</p>
          )}
        </div>
        <div>
          <button
            className="text-xl mb-6 font-bold w-full border-2 border-white text-left p-4 bg-blue-700 hover:bg-blue-800"
            onClick={() => toggleFAQ(5)}
          >
            How can I take an item from the box?
          </button>
          {activeIndex === 5 && (
            <p className="text-xl mb-6 p-4 bg-blue-800">After you have logged in, please open the page {" "}
            <Link href="/box_interaction/take_or_donate" className="text-white underline hover:text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-500">
              "Take/Donate an Item",
            </Link>{" "} click on the button "Take Item" and then follow the instructions on the website.</p>
          )}
        </div>
        <div>
          <button
            className="text-xl mb-6 font-bold w-full border-2 border-white text-left p-4 bg-blue-700 hover:bg-blue-800"
            onClick={() => toggleFAQ(6)}
          >
           Can I take items from the box for free?
          </button>
          {activeIndex === 6 && (
            <p className="text-xl mb-6 p-4 bg-blue-800">Yes, you can!</p>
          )}
        </div>
        <div>
          <button
            className="text-xl mb-6 font-bold w-full border-2 border-white text-left p-4 bg-blue-700 hover:bg-blue-800"
            onClick={() => toggleFAQ(7)}
          >
           Can I also give a tip after taking an item?
          </button>
          {activeIndex === 7 && (
            <p className="text-xl mb-6 p-4 bg-blue-800">This is currently in work. Find out more soon!</p>
          )}
        </div>
        <div>
          <button
            className="text-xl mb-6 font-bold w-full border-2 border-white text-left p-4 bg-blue-700 hover:bg-blue-800"
            onClick={() => toggleFAQ(8)}
          >
           How do I contact the support in case there is a problem?
          </button>
          {activeIndex === 8 && (
            <p className="text-xl mb-6 p-4 bg-blue-800">Feel free to send us your questions, comments or feedback through the {" "}
            <Link href="/support" className="text-white underline hover:text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-500">
              Support page.
            </Link>{" "} We look forward to hearing from you!</p>
          )}
        </div>
        <h1 className="mb-2">More frequently asked questions might be added soon.</h1>
      </div>
    );
  }