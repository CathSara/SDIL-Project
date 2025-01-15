"use client";

import React, { useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ReturnButton from "../components/ReturnButton";

const ProblemReportPage: React.FC = () => {
  const [problemCategory, setProblemCategory] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-r bg-mint-green flex flex-col items-center justify-center">
      {/* Header Section */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center container mx-auto px-8 py-4">
        <ReturnButton></ReturnButton>
        <div className="bg-white shadow-2xl rounded-lg p-5 transform transition duration-500 hover:scale-105 w-full max-w-lg my-4">
          <h2 className="text-dark- font-bold text-3xl mb-6 text-center">
            Report a Problem
          </h2>

          <form>
            {/* Problem Category Dropdown */}
            <div className="mb-6">
              <label
                htmlFor="item-choice"
                className="block text-gray-700 font-medium mb-3 text-lg"
              >
                What is your problem? Please choose a category.
              </label>
              <select
                id="item-choice"
                name="item-choice"
                value={problemCategory}
                onChange={(e) => setProblemCategory(e.target.value)}
                className="w-full px-6 py-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-dark-green"
              >
                <option value="" disabled>
                  Problem with...
                </option>
                <option value="account">My Account</option>
                <option value="inventory">Inventory</option>
                <option value="item_view">Viewing Item Details</option>
                <option value="item_reservation">Reserving Items</option>
                <option value="item_scan">Scanning Items</option>
                <option value="item_condition">Item Condition</option>
                <option value="box_condition">Box Condition</option>
                <option value="box_location">Box Location Tracking</option>
                <option value="others">Others</option>
              </select>
            </div>

            {/* Message Input */}
            <div className="mb-6">
              <label
                htmlFor="message"
                className="block text-gray-700 font-medium mb-3 text-lg"
              >
                Please describe your problem:
              </label>
              <textarea
                id="message"
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={10}
                className="w-full px-6 py-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-dark-green"
                placeholder="Type your message here..."
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-dark-green text-white py-3 px-6 rounded-lg text-lg hover:bg-dark-green-hover focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3"
            >
              Send Request
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProblemReportPage;
