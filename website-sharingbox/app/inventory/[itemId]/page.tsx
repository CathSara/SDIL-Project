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
  const [isReserved, setIsReserved] = useState<boolean>(false);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const router = useRouter();
  const itemIdRef = useRef<string | null>(null);

  // Replace with actual user ID
  const userId = 1; // Hardcoded for now, replace with actual user ID from context or authentication.

  // Fetch item details
  useEffect(() => {
    if (!itemId || itemIdRef.current === itemId) return;

    itemIdRef.current = itemId;
    fetch(`http://127.0.0.1:5000/inventory/item?item_id=${itemId}`)
      .then((response) => response.json())
      .then((data) => setItemDetail(data))
      .catch((error) => console.error("Error fetching item details:", error));
  }, [itemId]);

  // Fetch box details
  useEffect(() => {
    if (itemDetail?.box_id) {
      fetch(`http://127.0.0.1:5000/inventory/box?box_id=${itemDetail.box_id}`)
        .then((response) => response.json())
        .then((data) => setBox(data.name))
        .catch((error) => console.error("Error fetching box details:", error));
    }
  }, [itemDetail]);

  // Fetch reservation status
  useEffect(() => {
    fetch(`http://127.0.0.1:5000/inventory/is_reserved?item_id=${itemId}`)
      .then((response) => response.json())
      .then((data) => {
        setIsReserved(data.reserved);
      })
      .catch((error) => console.error("Error fetching reservation status:", error));
  }, [itemDetail]);

  // Fetch favorite status
  useEffect(() => {
    fetch(`http://127.0.0.1:5000/inventory/is_favorized?item_id=${itemId}&user_id=${userId}`)
      .then((response) => response.json())
      .then((data) => setIsFavorited(data.item_favorited))
      .catch((error) => console.error("Error fetching favorite status:", error));
  }, [itemId]);

  const handleReserve = () => {
    fetch(`http://127.0.0.1:5000/inventory/reserve?item_id=${itemId}&user_id=${userId}`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then(() => setIsReserved(true))
      .catch((error) => console.error("Error reserving item:", error));
  };

  const handleUnreserve = () => {
    fetch(`http://127.0.0.1:5000/inventory/unreserve?item_id=${itemId}&user_id=${userId}`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then(() => setIsReserved(false))
      .catch((error) => console.error("Error unreserving item:", error));
  };

  const handleLike = () => {
    fetch(`http://127.0.0.1:5000/inventory/favorize?item_id=${itemId}&user_id=${userId}`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then(() => setIsFavorited(true))
      .catch((error) => console.error("Error liking item:", error));
  };

  const handleUnlike = () => {
    fetch(`http://127.0.0.1:5000/inventory/defavorize?item_id=${itemId}&user_id=${userId}`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then(() => setIsFavorited(false))
      .catch((error) => console.error("Error unliking item:", error));
  };

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

          {/* Like/Unlike and Reserve/Unreserve buttons */}
          <div className="flex space-x-4 mb-4">
            <button
              onClick={isFavorited ? handleUnlike : handleLike}
              className={`px-6 py-2 font-bold rounded-md ${isFavorited ? 'bg-red-600' : 'bg-blue-600'} text-white`}
            >
              {isFavorited ? 'Unlike' : 'Like'}
            </button>
            <button
              onClick={isReserved ? handleUnreserve : handleReserve}
              className={`px-6 py-2 font-bold rounded-md ${isReserved ? 'bg-red-600' : 'bg-green-600'} text-white`}
            >
              {isReserved ? 'Unreserve' : 'Reserve'}
            </button>
          </div>

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
