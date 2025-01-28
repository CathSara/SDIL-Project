"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ReturnButton from "../components/ReturnButton";

/* Used help in ChatGPT to add simple toggle bars for FAQ and the links to Take/Donate page as well as its hovering effects */
export default function Page() {
  /* Toggle bar with question opened or closed? */
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r bg-mint-green flex flex-col items-center justify-center">
      {/* Header Section */}
      <Header></Header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-4">
        <ReturnButton></ReturnButton>

        <h1 className="text-2xl font-bold my-4">About Us</h1>
        <p className="text-xl mb-4">
          We are a group of students at the University of Cologne dedicated to
          creating an innovative solution for a more sustainable future.
        </p>
        <p className="text-xl mb-4">
          The smart giveaway box is a prototype designed to increase the
          lifecycle of products, reduce waste, and promote community sharing.
        </p>
        <p className="text-xl mb-4">
          Have items you no longer need? Want to collect free items or make our
          world more sustainable? You’re in the right place!
        </p>
        <p className="text-xl mb-4">
          Whether you want to donate or take items, we’re excited to welcome you
          to our community!
        </p>

        <h2 className="text-2xl font-bold mb-6">Project Team:</h2>
        <p className="text-xl mb-6">
          Tim Hebestreit, Chiara Seidenath, Johannes Simon, Max Unterbusch,
          Leonard Glock
        </p>

        {/* FAQ Section */}
        <h1 className="text-2xl font-bold mb-6">FAQ</h1>

        <div className="space-y-4 w-full max-w-3xl">
          {/* FAQ Item */}
          {[
            {
              question: "What is the smart giveaway box?",
              answer: (
                <>
                  It combines:
                  <ul className="list-disc pl-6">
                    <li>Common giveaway boxes</li>
                    <li>The design and location of public bookcases</li>
                    <li>
                      Technological components providing security and smart
                      inventory management
                    </li>
                  </ul>
                </>
              ),
            },
            {
              question: "How can I open the box?",
              answer: (
                <>
                  Scan the QR code on the box. This will redirect you to a page
                  where you can unlock this specific box if you are logged in.
                  Press on the button "Unlock" and open the door within 15 seconds.
                  You should then be redirected to the inventory page of this
                  specific box and be able to take or donate an item.
                </>
              ),
            },
            {
              question: "How can I donate an item?",
              answer: (
                <>
                  Once you have opened the box, you are required to put the item
                  on the <b>scan shelf</b> first to let the box take a picture of
                  the item, save its weight and automatically recognize the item.
                  If the item is allowed, put it on the <b>storage shelf</b> of the
                  box and it will be saved in the inventory. 
                </>
              ),
            },
            {
              question: "Which items are allowed to be put into the box?",
              answer: (
                <>
                  You can donate material goods that are in good condition. Food
                  items are not allowed. The box scans your item to verify its
                  condition.
                </>
              ),
            },
            {
              question:
                "How does the box recognize whether my item is allowed?",
              answer: (
                <>
                  When you place your item on the scan shelf, the box takes a
                  picture and sends it to the server to recognize the item.
                  The allowance of an item is determined by this integrated
                  item recognition by OpenAI.
                </>
              ),
            },
            {
              question: "How can I take an item?",
              answer: (
                <>
                  Once you have opened the box and take an item out of it,
                  the inventory will automatically recognize the item by its
                  weight and mark it as "taken" as long as you keep it. When
                  you close the door, the item will be fully removed from the
                  inventory. 
                </>
              ),
            },
            {
              question: "Can I take items from the box for free?",
              answer: "Yes, you can!",
            },
            {
              question: "Can I also give a tip after taking an item?",
              answer:
                "This feature is currently under development. Stay tuned for more!",
            },
            {
              question: "How do I contact support in case of a problem?",
              answer: (
                <>
                  Send your questions or feedback via the{" "}
                  <Link
                    href="/support"
                    className="text-white underline hover:text-yellow-300"
                  >
                    Support page
                  </Link>
                  . We look forward to hearing from you!
                </>
              ),
            },
          ].map((faq, index) => (
            <div key={index} className="border-b-2 border-dark-green">
              <button
                className="text-xl text-white font-bold w-full text-left p-4 bg-green-900 hover:bg-green700 transition-all"
                onClick={() => toggleFAQ(index)}
              >
                {faq.question}
              </button>
              {activeIndex === index && (
                <p className="text-xl text-white mb-6 p-4 bg-green-700">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>

        <h1 className="text-xl text-center mt-6">
          More frequently asked questions might be added soon.
        </h1>
      </div>
      <Footer></Footer>
    </div>
  );
}
