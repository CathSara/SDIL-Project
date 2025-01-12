"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Navigation from '../components/Navigation';
import Link from 'next/link';

interface Item {
  id: number;
  image_path: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  box_id: number;
}

interface Box {
  id: number;
  name: string;
  location: string;
}

interface Category {
  id: number;
  name: string;
}

export default function Page() {
  const [items, setItems] = useState<Item[]>([]);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchString, setSearchString] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBox, setSelectedBox] = useState('');
  const userId = getCookie('user_id')

  useEffect(() => {
    // Fetch initial items
    fetchItems();

    // Fetch boxes
    fetch('http://127.0.0.1:5000/inventory/boxes')
      .then((response) => response.json())
      .then((data: Box[]) => setBoxes(data))
      .catch((error) => console.error('Error fetching boxes:', error));

    // Fetch categories
    fetch('http://127.0.0.1:5000/inventory/categories')
      .then((response) => response.json())
      .then((data: Category[]) => setCategories(data))
      .catch((error) => console.error('Error fetching categories:', error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchItems = () => {
    const params = new URLSearchParams();
    if (searchString) params.append('search_string', searchString);
    if (selectedCategory) params.append('category', selectedCategory);
    if (selectedBox) params.append('box_id', selectedBox);

    fetch(`http://127.0.0.1:5000/inventory/items?${params.toString()}`)
      .then((response) => response.json())
      .then((data: Item[]) => setItems(data))
      .catch((error) => console.error('Error fetching items:', error));
  };

  const fetchReservedItems = () => {
    if (!userId) return;
    fetch(`http://127.0.0.1:5000/inventory/get_reserved?user_id=${userId}`)
      .then((response) => response.json())
      .then((data: Item[]) => setItems(data))
      .catch((error) => console.error('Error fetching reserved items:', error));
  };

  const fetchLikedItems = () => {
    if (!userId) return;
    fetch(`http://127.0.0.1:5000/inventory/get_favorites?user_id=${userId}`)
      .then((response) => response.json())
      .then((data: Item[]) => setItems(data))
      .catch((error) => console.error('Error fetching liked items:', error));
  };

  const handleSearch = () => {
    fetchItems();
  };

  function getCookie(name: string) {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
      const [key, value] = cookie.split('=');
      if (key === name) {
        return value;
      }
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-mint-green flex flex-col items-center">
      {/* Header Section */}
      <header className="w-full bg-mint-green text-dark-green">
        <div className="container mx-auto px-10 py-16">
          <h1 className="text-5xl font-extrabold text-center">Your Smart Giveaway Box</h1>
        </div>
      </header>
      <Navigation />
      {/* Search Bar */}
      <div className="w-full bg-mint-green white py-4 px-8 shadow-md flex justify-center">
        <div className="sm:space-x-4 flex flex-col justify-center sm:flex-row sm:items-center w-full max-w-screen-lg">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search items..."
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 border rounded-md mb-4 sm:mb-0"
          />

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto bg-white px-4 py-2.5 border rounded-md mb-4 sm:mb-0"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.name} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>

          {/* Box Dropdown */}
          <select
            value={selectedBox}
            onChange={(e) => setSelectedBox(e.target.value)}
            className="w-full sm:w-auto  bg-white px-4 py-2.5 border rounded-md mb-4 sm:mb-0"
          >
            <option value="">All Boxes</option>
            {boxes.map((box) => (
              <option key={box.id} value={box.id}>
                {box.name}
              </option>
            ))}
          </select>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="w-full sm:w-auto px-6 py-2 bg-dark-green text-white font-bold rounded-md hover:bg-lighter-green mb-4 sm:mb-0"
          >
            Search
          </button>

          {/* Reserved and Liked Items Buttons */}
          <div className="flex flex-row justify-center">
            <button
              onClick={fetchReservedItems}
              className="flex flex-col items-center text-black text-sm rounded-md hover:bg-gray-100 mb-0 ml-0 sm:ml-16 mr-8 p-1"
            >
              <div className="mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </div>
              <span>Reserved</span>
            </button>

            <button
              onClick={fetchLikedItems}
              className="flex flex-col items-center text-black text-sm rounded-md hover:bg-gray-100 mr-4 p-1"
            >
              <div className="mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
              </div>
              <span>Liked</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.length > 0 ? (
          items.map((item) => {
            const box = boxes.find((box) => box.id === item.box_id);

            return (
              <Link key={item.id} href={`/inventory/${item.id}`}>
                <div className="bg-white shadow-lg rounded-lg p-6 transform transition duration-500 hover:scale-105 cursor-pointer">
                  <div className="w-full h-64 bg-gray-100 rounded-md mb-4 relative overflow-hidden">
                    <Image
                      src={item.image_path}
                      alt={item.title}
                      className="object-cover w-full h-full"
                      width="300"
                      height="300"
                    />
                  </div>
                  <h2 className="text-gray-800 font-semibold text-xl mb-2">{item.title}</h2>
                  {box && (
                    <p className="text-gray-600 text-md">
                      <strong>Located in:</strong> {box.name}
                    </p>
                  )}
                </div>
              </Link>
            );
          })
        ) : (
          <p className="text-white text-center text-xl">No items found.</p>
        )}
      </main>

    </div>
  );
}
