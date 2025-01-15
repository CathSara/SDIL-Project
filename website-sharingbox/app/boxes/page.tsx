"use client";

import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import ReturnButton from "@/app/components/ReturnButton";

interface Box {
  box_picture_path: string;
  name: string;
  id: string;
  location: string;
  maps_link: string;
}

export default function Page() {
  const [boxes, setBoxes] = useState<Box[]>([]);

  const fetchBoxes = () => {
    fetch("http://127.0.0.1:5000/inventory/boxes")
      .then((response) => response.json())
      .then((data: Box[]) => setBoxes(data))
      .catch((error) => console.error("Error fetching boxes:", error));
  };

  useEffect(() => {
    fetchBoxes();
  }, []);

  return (
    <div className="min-h-screen bg-mint-green flex flex-col items-center">
      <Header />

      <main className="flex-grow container mx-auto px-6 py-3 flex flex-col items-center">
        <ReturnButton></ReturnButton>
        {boxes.map((box) => (
          <div
            key={box.id}
            className="mb-8 border border-gray-300 rounded-md p-4 bg-white shadow-md w-[500px] max-w-full"
          >
            <div className="flex justify-between">
              <div className="flex flex-col">
                <p>Box name: {box.name}</p>
                <p>Address: {box.location}</p>
                <a
                  className="mt-4"
                  href={box.maps_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="mt-2 px-12 py-2 bg-dark-green text-white rounded-md">
                    <strong>Directions</strong>
                  </button>
                </a>
              </div>

              <div className="rounded-md relative overflow-hidden">
                <Image
                  src={box.box_picture_path || "/boxes/uni.jpg"}
                  alt={box.name}
                  className="object-cover w-[150px] h-[150px]"
                  width={150}
                  height={150}
                />
              </div>
            </div>
          </div>
        ))}
      </main>

      <Footer />
    </div>
  );
}
