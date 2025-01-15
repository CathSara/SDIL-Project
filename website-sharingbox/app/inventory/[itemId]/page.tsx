"use client";

import React, { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import Link from "next/link";
import { Span } from "next/dist/trace";

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

interface Category {
  id: number;
  name: string;
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
  const [reservationStatus, setReservationStatus] = useState<string>("");
  const router = useRouter();
  const itemIdRef = useRef<string | null>(null);
  const userId = getCookie("user_id");
  const [timeIn20Minutes, setTimeIn20Minutes] = useState<string>("time");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [categoryEdit, setCategoryEdit] = useState<string>();
  const [titleEdit, setTitleEdit] = useState<string>();
  const [descriptionEdit, setDescriptionEdit] = useState<string>();
  const [conditionEdit, setConditionEdit] = useState<string>();
  const [categories, setCategories] = useState<Category[]>([]);

  const conditions = ["new", "flawless", "used", "worn"]

  // Fetch item details
  useEffect(() => {
    if (!itemId || itemIdRef.current === itemId) return;

    itemIdRef.current = itemId;
    fetch(`http://127.0.0.1:5000/inventory/item?item_id=${itemId}`)
      .then((response) => response.json())
      .then((data) => {
        setItemDetail(data);
        setCategoryEdit(data.category);
        setTitleEdit(data.title);
        setDescriptionEdit(data.description);
        setConditionEdit(data.condition);

        setTimeIn20Minutes("Reserved until: " + data.reserved_until);

        // Set reservation status based on reserved_by_id
        if (data.reserved_by_id === null) {
          setReservationStatus("not reserved");
        } else if (data.reserved_by_id == userId) {
          setReservationStatus("self-reserved");
        } else {
          setReservationStatus("reserved");
        }
      })
      .catch((error) => console.error("Error fetching item details:", error));

      fetch("http://127.0.0.1:5000/inventory/categories")
        .then((response) => response.json())
        .then((data: Category[]) => setCategories(data))
        .catch((error) => console.error("Error fetching categories:", error));
  }, [itemId, userId]);

  // Fetch details
  useEffect(() => {
    if (itemDetail?.box_id) {
      fetch(`http://127.0.0.1:5000/inventory/box?box_id=${itemDetail.box_id}`)
        .then((response) => response.json())
        .then((data) => setBox(data))
        .catch((error) => console.error("Error fetching box details:", error));
    }
    if (itemDetail?.created_by_id) {
      fetch(
        `http://127.0.0.1:5000/user/get?user_id=${itemDetail?.created_by_id}`
      )
        .then((response) => response.json())
        .then((data) => setDonor(data))
        .catch((error) => console.error("Error fetching donor:", error));
    }
    fetch(`http://127.0.0.1:5000/inventory/is_reserved?item_id=${itemId}`)
      .then((response) => response.json())
      .then((data) => {
        setIsReserved(data.reserved);
      })
      .catch((error) =>
        console.error("Error fetching reservation status:", error)
      );

    fetch(
      `http://127.0.0.1:5000/inventory/is_favorized?item_id=${itemId}&user_id=${userId}`
    )
      .then((response) => response.json())
      .then((data) => setIsFavorited(data.item_favorited))
      .catch((error) =>
        console.error("Error fetching favorite status:", error)
      );
  }, [itemDetail]);


  const handleReserve = () => {
    fetch(
      `http://127.0.0.1:5000/inventory/reserve?item_id=${itemId}&user_id=${userId}`,
      {
        method: "POST",
      }
    )
      .then((response) => response.json())
      .then(() => {
        setIsReserved(true);
        setTimeIn20Minutes("Reserved for 20 Minutes");
      })
      .catch((error) => console.error("Error reserving item:", error));
    setReservationStatus("self-reserved");
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
    setReservationStatus("not reserved");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Construct the payload
    const payload = {
      item_id: itemDetail?.id,
      title: titleEdit,
      description: descriptionEdit,
      category: categoryEdit,
      condition: conditionEdit,
    };

    console.log("payload:", payload)

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/inventory/update",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        setItemDetail(await response.json())
        setIsEditing(false)
      } else {
        const error = await response.json();
        console.error("Error saving changes:", error);
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  };

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
            {isEditing ? (
              <h1 className="text-2xl text-gray-700">Edit Mode</h1>
            ) : (
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

                <h1 className="text-2xl text-gray-700">
                  {itemDetail.category}
                </h1>
              </div>
            )}

            <div className="flex">
              {isEditing ? (
                <div></div>
              ) : (
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
              )}

              {String(itemDetail.created_by_id) == userId ? (
                <button
                  onClick={() =>
                    isEditing ? setIsEditing(false) : setIsEditing(true)
                  }
                  className={`flex items-center justify-center font-bold rounded-md${
                    isFavorited ? "text-red-800" : "text-black"
                  }`}
                >
                  {isEditing ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-8"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  )}
                </button>
              ) : (
                <div></div>
              )}
            </div>
          </div>
          {isEditing ? (
            <div>
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label
                    htmlFor="title"
                    className="block text-gray-700 font-medium mb-1 text-lg"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className="w-full px-6 py-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-dark-green"
                    placeholder="Enter your title"
                    value={titleEdit || ""}
                    onChange={(e) => setTitleEdit(e.target.value)}
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="description"
                    className="block text-gray-700 font-medium mb-1 text-lg"
                  >
                    Description
                  </label>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    className="w-full px-6 py-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-dark-green"
                    placeholder="Enter your description"
                    value={descriptionEdit || ""}
                    onChange={(e) => setDescriptionEdit(e.target.value)}
                  />
                </div>

                <div className="flex">
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-gray-700 font-medium mb-1 text-lg"
                    >
                      Category
                    </label>
                    <select
                      value={categoryEdit}
                      id="category"
                      name="category"
                      onChange={(e) => setCategoryEdit(e.target.value)}
                      className="w-60 bg-white px-4 py-2.5 border rounded-md mb-4 sm:mb-0"
                    >
                      {categories.map((category) => (
                        <option key={category.name} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="ml-4">
                    <label
                      htmlFor="condition"
                      className="block text-gray-700 font-medium mb-1 text-lg"
                    >
                      Condition
                    </label>
                    <select
                      value={conditionEdit}
                      id="condition"
                      name="condition"
                      onChange={(e) => setConditionEdit(e.target.value)}
                      className="w-60 bg-white px-4 py-2.5 border rounded-md mb-4 sm:mb-0"
                    >
                      {conditions.map((conditions) => (
                        <option key={conditions} value={conditions}>
                          {conditions}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-center mb-4">
                  <button
                    type="submit"
                    className="px-20 bg-dark-green text-white py-3 px-6 rounded-lg text-lg hover:bg-dark-green-hover focus:outline-none focus:ring-2 focus:ring-dark-green mt-5"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="flex sm:flex-row flex-col items-stretch">
              <div className="rounded-md mb-4 relative overflow-hidden">
                {reservationStatus === "reserved" && (
                  <div className="absolute top-0 left-0 w-full bg-red-500 text-white text-center py-2 font-bold">
                    Reserved
                  </div>
                )}
                {reservationStatus === "self-reserved" && (
                  <div className="absolute top-0 left-0 w-full bg-dark-green text-white text-center py-2 font-bold">
                    {timeIn20Minutes}
                  </div>
                )}
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
                  <Link
                    href={`/profile/${itemDetail.created_by_id}`}
                    className="block px-4 py-2 flex items-center"
                  >
                    <Image
                      src={
                        donor?.profile_picture_path || "/profiles/default.png"
                      }
                      className="rounded-full object-cover w-[40px] h-[40px]"
                      width={40}
                      height={40}
                      alt={""}
                    />
                    <div>
                      <p className="text-black text-xs ml-2">Donated by:</p>
                      {String(itemDetail.created_by_id) == userId ? (
                        <p className="text-black text-l ml-2">
                          {donor?.first_name} {donor?.last_name} (You)
                        </p>
                      ) : (
                        <p className="text-black text-l ml-2">
                          {donor?.first_name} {donor?.last_name}
                        </p>
                      )}
                    </div>
                  </Link>
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
                  disabled={reservationStatus == "reserved"}
                  className={`px-6 py-2 font-bold rounded-md w-full flex justify-center mb-4 ${
                    reservationStatus == "self-reserved"
                      ? "bg-mint-green text-dark-green"
                      : reservationStatus == "not reserved"
                      ? "bg-dark-green text-mint-green"
                      : "bg-gray-400 text-mint-green"
                  }`}
                >
                  {reservationStatus == "not reserved" ? (
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

                  {reservationStatus == "not reserved"
                    ? "Reserve"
                    : reservationStatus == "self-reserved"
                    ? "Unreserve"
                    : "Reserved"}
                </button>
              </div>
            </div>
          )}
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
