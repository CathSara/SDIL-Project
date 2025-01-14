"use client";

import React, { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";

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

interface User {
  first_name: string;
  profile_picture_path: string;
  last_name: string;
}

interface Box {
  box_picture_path: string;
  name: string;
  id: string;
  location: string;
  maps_link: string;
}

export default function ItemDetailPage({
  params,
}: {
  params: Promise<{ itemId: string }>;
}) {
  const { itemId } = use(params);
  const [itemDetail, setItemDetail] = useState<ItemDetail | null>(null);
  const [box, setBox] = useState<Box>();
  const [donor, setDonor] = useState<User>();
  const [isReserved, setIsReserved] = useState<boolean>(false);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const router = useRouter();
  const itemIdRef = useRef<string | null>(null);
  const userId = getCookie("user_id");

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
        .then((data) => setBox(data))
        .catch((error) => console.error("Error fetching box details:", error));
    }
  }, [itemDetail]);

  useEffect(() => {
   if (itemDetail?.created_by_id) {
    fetch(`http://127.0.0.1:5000/user/get?user_id=${itemDetail?.created_by_id}`)
      .then((response) => response.json())
      .then((data) => setDonor(data))
      .catch((error) => console.error("Error fetching donor:", error));
   }
  })

  // Fetch reservation status
  useEffect(() => {
    fetch(`http://127.0.0.1:5000/inventory/is_reserved?item_id=${itemId}`)
      .then((response) => response.json())
      .then((data) => {
        setIsReserved(data.reserved);
      })
      .catch((error) =>
        console.error("Error fetching reservation status:", error)
      );
  }, [itemDetail]);

  // Fetch favorite status
  useEffect(() => {
    fetch(
      `http://127.0.0.1:5000/inventory/is_favorized?item_id=${itemId}&user_id=${userId}`
    )
      .then((response) => response.json())
      .then((data) => setIsFavorited(data.item_favorited))
      .catch((error) =>
        console.error("Error fetching favorite status:", error)
      );
  }, [itemId]);

  const handleReserve = () => {
    fetch(
      `http://127.0.0.1:5000/inventory/reserve?item_id=${itemId}&user_id=${userId}`,
      {
        method: "POST",
      }
    )
      .then((response) => response.json())
      .then(() => setIsReserved(true))
      .catch((error) => console.error("Error reserving item:", error));
  };

  const handleUnreserve = () => {
    fetch(
      `http://127.0.0.1:5000/inventory/unreserve?item_id=${itemId}&user_id=${userId}`,
      {
        method: "POST",
      }
    )
      .then((response) => response.json())
      .then(() => setIsReserved(false))
      .catch((error) => console.error("Error unreserving item:", error));
  };

  const handleLike = () => {
    fetch(
      `http://127.0.0.1:5000/inventory/favorize?item_id=${itemId}&user_id=${userId}`,
      {
        method: "POST",
      }
    )
      .then((response) => response.json())
      .then(() => setIsFavorited(true))
      .catch((error) => console.error("Error liking item:", error));
  };

  const handleUnlike = () => {
    fetch(
      `http://127.0.0.1:5000/inventory/defavorize?item_id=${itemId}&user_id=${userId}`,
      {
        method: "POST",
      }
    )
      .then((response) => response.json())
      .then(() => setIsFavorited(false))
      .catch((error) => console.error("Error unliking item:", error));
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

  if (!itemDetail) {
    return (
      <p className="text-white text-center text-xl">Loading item details...</p>
    );
  }

  return (
    <div className="min-h-screen bg-mint-green flex flex-col items-center">
      <Header></Header>

      <main className="flex-grow container mx-auto px-6 py-3">
        <div className="relative">
          <button
            onClick={() => router.back()}
            className="absolute top-0 left-0 px-6 py-2 bg-dark-green text-white font-bold rounded-md hover:bg-dark-green-hover"
          >
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
                d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
              />
            </svg>
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-lg sm:px-6 px-2 py-2 max-w-2xl mx-auto lg:mt-0 mt-12 mb-5">
          <div className="w-full flex items-center justify-between my-2">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6 text-black"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>

              <h1 className="text-2xl text-gray-700">{itemDetail.category}</h1>
            </div>

            <button
              onClick={isFavorited ? handleUnlike : handleLike}
              className={`flex items-center justify-center font-bold rounded-md ${
                isFavorited ? "text-red-800" : "text-black"
              }`}
            >
              {isFavorited ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-8 h-8"
                >
                  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                  />
                </svg>
              )}
            </button>
          </div>
          <div className="flex sm:flex-row flex-col items-stretch">
            <div className="rounded-md mb-4 relative overflow-hidden">
              <Image
                src={itemDetail.image_path}
                alt={itemDetail.title}
                className="object-cover md:w-[350px] md:h-[350px] w-[350px] h-[350px]"
                width={350}
                height={350}
              />
            </div>
            <div className="sm:ml-3 flex flex-col justify-between flex-grow">
              <div>
                <p className="text-black text-3xl mb-1">
                  <strong>{itemDetail.title}</strong>
                </p>
                <p className="text-black text-xl mb-3">
                  {itemDetail.description}
                </p>
              </div>
              <div className="flex items-center">
                <Image
                  src={donor?.profile_picture_path || "/profiles/dana.jpg"}
                  className="rounded-full object-cover w-[40px] h-[40px]"
                  width={40}
                  height={40}
                  alt={""}
                />
                <div>
                  <p className="text-black text-xs ml-2">Donated by:</p>
                  <p className="text-black text-l ml-2">
                    {donor?.first_name} {donor?.last_name}
                  </p>
                </div>
              </div>

              <hr className="border-gray-400 my-3" />

              <div className="flex items-center text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="size-4 mr-2"
                >
                  <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                  <path
                    fillRule="evenodd"
                    d="M1.38 8.28a.87.87 0 0 1 0-.566 7.003 7.003 0 0 1 13.238.006.87.87 0 0 1 0 .566A7.003 7.003 0 0 1 1.379 8.28ZM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{itemDetail.number_of_views}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="size-4 mr-2"
                >
                  <path d="M5.75 7.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM5 10.25a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0ZM10.25 7.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM7.25 8.25a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0ZM8 9.5A.75.75 0 1 0 8 11a.75.75 0 0 0 0-1.5Z" />
                  <path
                    fillRule="evenodd"
                    d="M4.75 1a.75.75 0 0 0-.75.75V3a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2V1.75a.75.75 0 0 0-1.5 0V3h-5V1.75A.75.75 0 0 0 4.75 1ZM3.5 7a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v4.5a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1V7Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{itemDetail.created_at}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="size-4 mr-2"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 4a.75.75 0 0 1 .738.616l.252 1.388A1.25 1.25 0 0 0 6.996 7.01l1.388.252a.75.75 0 0 1 0 1.476l-1.388.252A1.25 1.25 0 0 0 5.99 9.996l-.252 1.388a.75.75 0 0 1-1.476 0L4.01 9.996A1.25 1.25 0 0 0 3.004 8.99l-1.388-.252a.75.75 0 0 1 0-1.476l1.388-.252A1.25 1.25 0 0 0 4.01 6.004l.252-1.388A.75.75 0 0 1 5 4ZM12 1a.75.75 0 0 1 .721.544l.195.682c.118.415.443.74.858.858l.682.195a.75.75 0 0 1 0 1.442l-.682.195a1.25 1.25 0 0 0-.858.858l-.195.682a.75.75 0 0 1-1.442 0l-.195-.682a1.25 1.25 0 0 0-.858-.858l-.682-.195a.75.75 0 0 1 0-1.442l.682-.195a1.25 1.25 0 0 0 .858-.858l.195-.682A.75.75 0 0 1 12 1ZM10 11a.75.75 0 0 1 .728.568.968.968 0 0 0 .704.704.75.75 0 0 1 0 1.456.968.968 0 0 0-.704.704.75.75 0 0 1-1.456 0 .968.968 0 0 0-.704-.704.75.75 0 0 1 0-1.456.968.968 0 0 0 .704-.704A.75.75 0 0 1 10 11Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Condition: {itemDetail.condition}</span>
              </div>
              <hr className="border-gray-400 my-3" />
              <button
                onClick={isReserved ? handleUnreserve : handleReserve}
                className={`px-6 py-2 font-bold rounded-md w-full flex justify-center mb-4 ${
                  isReserved
                    ? "bg-mint-green text-dark-green"
                    : "bg-dark-green text-mint-green"
                }`}
              >
                {!isReserved ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                    />
                  </svg>
                )}

                {isReserved ? "Unreserve" : "Reserve"}
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-lg sm:px-6 px-2 py-2 max-w-2xl mx-auto lg:mt-0 mt-10">
          <div className="w-full flex items-center justify-between my-2 text-black">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                />
              </svg>

              <h1 className="text-2xl text-gray-700">Location</h1>
            </div>
          </div>
          <div className="text-black flex justify-between">
            <div className="flex flex-col mt-5">
              <p>Box name: {box?.name}</p>
              <p>Address: {box?.location}</p>
              <a
                className="mt-4"
                href={box?.maps_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="mt-2 px-12 py-2 bg-dark-green text-white rounded-md">
                  <strong>Directions</strong>
                </button>
              </a>
            </div>

            <div className="rounded-md mb-4 relative overflow-hidden">
              <Image
                src={box?.box_picture_path || "/boxes/uni.jpg"}
                alt={itemDetail.title}
                className="object-cover w-[150px] h-[150px]"
                width={150}
                height={150}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer></Footer>
    </div>
  );
}
