"use client";

import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import LoginForm from "@/app/components/LoginForm";
import React, { use, useEffect, useState } from "react";

interface Box {
  box_picture_path: string;
  name: string;
  id: string;
  location: string;
  maps_link: string;
  opened_at: string;
  opened_by_id: string;
}

export default function Page({
  params,
}: {
  params: Promise<{ boxId: string }>;
}) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { boxId } = use(params);
  const [userId, setUserId] = useState("");
  const [box, setBox] = useState<Box>();

  const handleLoginSuccess = (status: boolean) => {
    if (status) {
      getUserId();
    }
  };

  useEffect(() => {
    getUserId();

    fetch(`${API_BASE_URL}/inventory/box?box_id=${boxId}`)
      .then((response) => response.json())
      .then((data) => setBox(data))
      .catch((error) => console.error("Error fetching box details:", error));
  });

  const getUserId = () => {
    const user_id_from_cookie = getCookie("user_id");
    setUserId(user_id_from_cookie);
  };

  const openBox = () => {
    console.log()
  };

  function getCookie(name: string) {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [key, value] = cookie.split("=");
      if (key === name) {
        return value;
      }
    }
    return "";
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header></Header>
      {/* Main Content */}
      <div className="bg-mint-green h flex-grow pt-20">
        <main className="flex-grow flex flex-col items-center justify-center container mx-auto px-8 py-8">
          <div className="bg-white shadow-2xl rounded-lg p-5 transform transition duration-500 hover:scale-105 w-full max-w-sm">
            {userId ? (
              <div>
                <h2 className="text-dark- font-bold text-3xl mb-3 text-center">
                  Take & Donate
                </h2>
                {box?.opened_by_id === userId ? (
                  <p className="text-center">
                    Please wait until the other user is done and closed the box.
                  </p>
                ) : (
                  <div>
                    <p className="text-center">
                      You are about to open the <strong>{box?.name}</strong>.
                    </p>
                    <div className="flex justify-center">
                      <button
                        onClick={openBox}
                        className="px-20 bg-dark-green text-white py-3 px-6 rounded-lg text-lg hover:bg-dark-green-hover focus:outline-none focus:ring-2 focus:ring-dark-green mt-5"
                      >
                        Open Box
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h2 className="text-dark- font-bold text-3xl mb-6 text-center">
                  Login
                </h2>
                <LoginForm onLoginSuccess={handleLoginSuccess}></LoginForm>
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer></Footer>
    </div>
  );
}
