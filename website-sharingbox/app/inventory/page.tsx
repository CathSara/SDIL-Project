"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ProfileMenu from "../components/ProfileMenu";

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

interface User {
  first_name: string;
  profile_picture_path: string;
  last_name: string;
}

export default function Page() {
  const [items, setItems] = useState<Item[]>([]);
  const [user, setUser] = useState<User>();
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchString, setSearchString] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBox, setSelectedBox] = useState("");
  const userId = getCookie("user_id");
  const [viewName, setViewName] = useState("All Items");

  useEffect(() => {
    // Fetch initial items
    fetchItems();

    // Fetch boxes
    fetch("http://127.0.0.1:5000/inventory/boxes")
      .then((response) => response.json())
      .then((data: Box[]) => setBoxes(data))
      .catch((error) => console.error("Error fetching boxes:", error));

    // Fetch categories
    fetch("http://127.0.0.1:5000/inventory/categories")
      .then((response) => response.json())
      .then((data: Category[]) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));

    fetchUser();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchItems = () => {
    const params = new URLSearchParams();
    if (searchString) params.append("search_string", searchString);
    if (selectedCategory) params.append("category", selectedCategory);
    if (selectedBox) params.append("box_id", selectedBox);

    fetch(`http://127.0.0.1:5000/inventory/items?${params.toString()}`)
      .then((response) => response.json())
      .then((data: Item[]) => setItems(data))
      .catch((error) => console.error("Error fetching items:", error));

    let viewName = "";
    if (searchString) {
      viewName += "'" + searchString + "'";
    }
    if (selectedCategory) {
      viewName += " in " + selectedCategory;
    }
    if (selectedBox) {
      const box = boxes.find((box) => String(box.id) === selectedBox);
      viewName += " at " + box?.name;
    }
    if (viewName === "") {
      viewName = "All items";
    }
    setViewName(viewName);
  };

  const fetchReservedItems = () => {
    if (!userId) return;
    fetch(`http://127.0.0.1:5000/inventory/get_reserved?user_id=${userId}`)
      .then((response) => response.json())
      .then((data: Item[]) => setItems(data))
      .catch((error) => console.error("Error fetching reserved items:", error));
      setViewName("Your Reservations");
  };

  const fetchLikedItems = () => {
    if (!userId) return;
    fetch(`http://127.0.0.1:5000/inventory/get_favorites?user_id=${userId}`)
      .then((response) => response.json())
      .then((data: Item[]) => setItems(data))
      .catch((error) => console.error("Error fetching liked items:", error));
    setViewName("Your Favorites");
  };

  const fetchUser = () => {
    if (!userId) return;
    fetch(`http://127.0.0.1:5000/user/get?user_id=${userId}`)
      .then((response) => response.json())
      .then((data: User) => setUser(data))
      .catch((error) => console.error("Error fetching liked items:", error));
  };

  const handleSearch = () => {
    fetchItems();
  };

  function getCookie(name: string) {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [key, value] = cookie.split("=");
      if (key === name) {
        return value;
      }
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-mint-green flex flex-col items-center">
      {/* Header Section */}
      <Header></Header>
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
            <ProfileMenu
              onReservedClick={fetchReservedItems}
              onLikedClick={fetchLikedItems}
              name={user?.first_name || "Name"}
              path={user?.profile_picture_path || "/boxes/sülz.jpeg"} // fallback
              id={userId || "0"}
            ></ProfileMenu>
          </div>
        </div>
      </div>

      <div className="w-full px-8 py-2 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>

        <h1 className="text-2xl text-gray-700">{viewName}</h1>
      </div>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-8 pb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <h2 className="text-gray-800 font-semibold text-xl mb-2">
                    {item.title}
                  </h2>
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
          <p className="text-dark-green text-center text-xl">No items found.</p>
        )}
      </main>

      {/* Footer */}
      <Footer></Footer>
    </div>
  );
}
