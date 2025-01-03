"use client";

import React from 'react';
import Navigation from '../components/Navigation';

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
          <label className="text-2xl font-bold mb-2" htmlFor="item-choice">What is your problem? Please choose a category.</label>
            <select className="text-2xl mb-6 text-black" id="item-choice" name="item-choice" defaultValue="">
              <option value="" disabled>Problem with...</option>
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
          <label className="text-2xl font-bold mb-2" htmlFor="message">Please describe us your problem:</label>
            <textarea className="text-2xl mb-6 text-black" id="message" name="message" rows={10} cols={75} placeholder="Type your message here..."></textarea>
            <button className="text-2xl mb-6 px-6 py-3 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300">
            Send Request
            </button>
      </div>
    );
  }