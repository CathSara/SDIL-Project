"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Navigation from '../components/Navigation';

interface Item {
  id: number;
  image_path: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  is_taken: boolean;
}

interface Box {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

//const categories = ['Electronics', 'Books', 'Clothing', 'Furniture', 'Other']; // Example categories

export default function Page() {
  const [items, setItems] = useState<Item[]>([]);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchString, setSearchString] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBox, setSelectedBox] = useState('');

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

  const handleSearch = () => {
    fetchItems();
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col items-center">
      {/* Header Section */}
      <header className="w-full bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-5xl font-extrabold text-center">Sharing Box Köln!</h1>
        </div>
      </header>
      <Navigation />
      {/* Search Bar */}
      <div className="w-full bg-white py-4 px-8 shadow-md flex justify-center">
        <div className="sm:space-x-4">
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
            className="w-full sm:w-auto px-4 py-2 border rounded-md mb-4 sm:mb-0"
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
            className="w-full sm:w-auto px-4 py-2 border rounded-md mb-4 sm:mb-0"
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
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow-2xl rounded-lg p-6 transform transition duration-500 hover:scale-105"
            >
              <Image
                src={item.image_path}
                alt={item.title}
                className="w-full h-40 object-cover rounded-md mb-4"
                width="300"
                height="300"
              />
              <h2 className="text-gray-800 font-bold text-2xl mb-2">{item.title}</h2>
              <p className="text-gray-600 text-lg">{item.description}</p>
              <p className="text-gray-500 text-sm mt-2">
                <strong>Category:</strong> {item.category}
              </p>
              <p className="text-gray-500 text-sm">
                <strong>Condition:</strong> {item.condition}
              </p>
              <p className={`text-sm mt-4 ${item.is_taken ? 'text-red-500' : 'text-green-500'}`}>
                {item.is_taken ? 'Taken' : 'Available'}
              </p>
            </div>
          ))
        ) : (
          <p className="text-white text-center text-xl">No items found.</p>
        )}
      </main>
    </div>
  );
}
