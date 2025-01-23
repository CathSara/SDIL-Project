"use client";

import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import React, { use, useEffect, useState } from "react";
import Image from "next/image";
import ReturnButton from "@/app/components/ReturnButton";

interface User {
  first_name: string;
  profile_picture_path: string;
  last_name: string;
}

export default function Page({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { userId } = use(params);
  const [user, setUser] = useState<User>();

  const fetchUser = () => {
    if (!userId) return;
    fetch(`${API_BASE_URL}/user/get?user_id=${userId}`)
      .then((response) => response.json())
      .then((data: User) => setUser(data))
      .catch((error) => console.error("Error fetching liked items:", error));
  };

  useEffect(() => {
    fetchUser();
  });

  return (
    <div>
      <Header></Header>
      {/* Main Content */}
      <div className=" bg-mint-green">
        <main className="flex-grow flex flex-col items-center justify-center container mx-auto px-8 py-8">
          <ReturnButton></ReturnButton>
          <div className="bg-white shadow-2xl rounded-lg p-5 transform transition duration-500 hover:scale-105 w-full max-w-sm">
            <h2 className="text-dark- font-bold text-3xl mb-6 text-center">
              {user?.first_name} {user?.last_name}
              <Image
                src={user?.profile_picture_path || "/profiles/default.png"}
                className="rounded-full mt-5"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: "100%", height: "auto" }}
                alt={""}
              />
            </h2>
          </div>
        </main>

        <Footer></Footer>
      </div>
    </div>
  );
}
