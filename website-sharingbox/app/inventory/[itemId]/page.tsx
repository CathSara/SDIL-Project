"use client";

import React, { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface ItemDetail {
  id: number;
  image_path: string;
  category: string;
  title: string;
  description: string;
  condition: string;
  weight: string;
  box_id: number;
  number_of_views: number;
  created_by_id: number;
  created_at: string;
  reserved_by_id: number | null;
  reserved_until: string | null;
  taken_by_id: number | null;
  taken_at: string | null;
}

export default function ItemDetailPage({ params }: { params: Promise<{ itemId: string }> }) {
  const { itemId } = use(params);
  const [itemDetail, setItemDetail] = useState<ItemDetail | null>(null);
  const [box, setBox] = useState<string>("");
  const router = useRouter();
  const itemIdRef = useRef<string | null>(null); // Use ref to store itemId

  // Use effect for fetching item details
  useEffect(() => {
    // Check if itemId is already loaded or being fetched
    if (!itemId || itemIdRef.current === itemId) return;

    itemIdRef.current = itemId; // Update the ref to reflect the current itemId
    fetch(`http://127.0.0.1:5000/inventory/item?item_id=${itemId}`)
      .then((response) => response.json())
      .then((data) => setItemDetail(data))
      .catch((error) => console.error("Error fetching item details:", error));
  }, [itemId]);

  // Use effect for fetching box details
  useEffect(() => {
    if (itemDetail?.box_id) {
      fetch(`http://127.0.0.1:5000/inventory/box?box_id=${itemDetail.box_id}`)
        .then((response) => response.json())
        .then((data) => setBox(data.name))
        .catch((error) => console.error("Error fetching box details:", error));
    }
  }, [itemDetail]);

  if (!itemDetail) {
    return <p className="text-white text-center text-xl">Loading item details...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col items-center">
      <header className="w-full bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-5xl font-extrabold text-center">{itemDetail.title}</h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-8 py-12">
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl mx-auto">
          <div className="w-full h-64 bg-gray-100 rounded-md mb-4 relative overflow-hidden">
            <Image
              src={itemDetail.image_path}
              alt={itemDetail.title}
              className="object-cover w-full h-full"
              width="300"
              height="300"
            />
          </div>
          <h2 className="text-gray-800 font-semibold text-xl mb-2">{itemDetail.title}</h2>
          <p className="text-gray-600 text-md mb-4">
            <strong>Category:</strong> {itemDetail.category}
          </p>
          <p className="text-gray-600 text-md mb-4">
            <strong>Condition:</strong> {itemDetail.condition}
          </p>
          <p className="text-gray-600 text-md mb-4">
            <strong>Weight:</strong> {itemDetail.weight}
          </p>
          <p className="text-gray-600 text-md mb-4">
            <strong>Located in:</strong> {box}
          </p>
          <p className="text-gray-600 text-md mb-4">
            <strong>Description:</strong> {itemDetail.description}
          </p>
          <p className="text-gray-600 text-md mb-4">
            <strong>Views:</strong> {itemDetail.number_of_views}
          </p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700"
          >
            Back
          </button>
        </div>
      </main>
    </div>
  );
}
