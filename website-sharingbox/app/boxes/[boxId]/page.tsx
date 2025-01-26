"use client";

import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import LoginForm from "@/app/components/LoginForm";
import React, { use, useEffect, useState } from "react";
import { arduinoIP } from '../config';

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
  const [pendingOpenRequest, setPendingOpenRequest] = useState<boolean>(false);

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
    fetch(`${API_BASE_URL}/inventory/open?box_id=${boxId}&user_id=${userId}`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then(() => setPendingOpenRequest(true))
      .catch((error) => console.error("Error opening box:", error));
  };

  // Used help in ChatGPT and https://arduinogetstarted.com/tutorials/arduino-controls-door-lock-via-web
  // to create the function for a button that correctly connects with the Arduino UNO R4 Wifi and posts requests to it to control the lock
  const unlockDoor = async () => {
      try {
        const lockStatus = 'door/unlock'
        const response = await fetch(`${arduinoIP}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lockStatus }),
        });
    
        if (response.ok) {
          console.log(`Door interaction to "${lockStatus}" was successful`);
           //window.location.href = nextPage;
         } else {
           console.error("Failed to control the door");
        }
       } catch (error) {
         console.error("Error communicating with the Arduino:", error);
       }
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
                  <>
                    {pendingOpenRequest == false ? (
                      <div>
                        <p className="text-center">
                          You are about to unlock the{" "}
                          <strong>{box?.name}</strong>.
                        </p>
                        <div className="flex justify-center">
                          <button
                            onClick={(e) => {
                              e.preventDefault(); // Prevent default behavior
                              openBox(); // Call openBox
                              unlockDoor(); // Call unlockDoor
                            }}
                            className="px-20 bg-dark-green text-white py-3 px-6 rounded-lg text-lg hover:bg-dark-green-hover focus:outline-none focus:ring-2 focus:ring-dark-green mt-5"
                          >
                            Unlock
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <strong>The door is unlocked, please open it.</strong>
                        <p className="mt-3">
                          Otherwise, the door will lock after 15 seconds.
                        </p>
                      </div>
                    )}
                  </>
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
