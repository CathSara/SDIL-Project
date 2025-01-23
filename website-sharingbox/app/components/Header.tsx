import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import ConfusionModal from "./ConfusionModal";
import { useRouter } from "next/navigation";
import ScanModal from "./ScanModal";

const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL);

export default function Header() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confusionItems, setConfusionItems] = useState([]);
  const [confusionSource, setConfusionSource] = useState("");
  const openedBoxId = getCookie("opened_box_id");
  const userId = getCookie("user_id");

  useEffect(() => {
    socket.on("confused", (data) => {
      console.log("received item_update confused");
      if (openedBoxId) {
        if (data.data.status === "confused") {
          console.log("if works");
          setConfusionItems(data.data.items);
          setConfusionSource(data.data.confusion_source);
          setIsModalOpen(true); // Open the modal
        }
        localStorage.setItem("confusionData", JSON.stringify(data.data)); // Save data for persistence
      }
    });

    // Check for persisted confusion state on page load
    const savedConfusionData = localStorage.getItem("confusionData");
    if (savedConfusionData) {
      const parsedData = JSON.parse(savedConfusionData);
      setConfusionItems(parsedData.items);
      setConfusionSource(parsedData.confusion_source);
      if (openedBoxId) {
        setIsModalOpen(true); // Open the modal
      }
    }

    socket.on("open", (data) => {
      console.log("box has been opened");
      const openedBoxId = data.data.box_id;
      const openedBoxUserId = data.data.user_id;
      if (openedBoxUserId == userId) {
        document.cookie = `opened_box_id=${openedBoxId}; path=/;`;
        router.push("/inventory");
      }
    });

    socket.on("close", (data) => {
      console.log("box has been opened");
      const openedBoxId = data.data.box_id;
      const openedBoxIdCookie = getCookie("opened_box_id");
      if (openedBoxId == openedBoxIdCookie) {
        console.log("the opened_box_id cookie should now be deleted");
        document.cookie =
          "opened_box_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        router.push("/inventory");
      }
    });

    return () => {
      socket.off("confused");
      socket.off("open");
      socket.off("close");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleItemSelect(itemId: number | null) {
    if (itemId === null) {
      console.warn("No item selected.");
      return;
    }
    console.log("Selected item ID:", itemId);
    setIsModalOpen(false);
    localStorage.removeItem("confusionData"); // Clear persistence

    // Notify the backend of the selection
    fetch(
      `${API_BASE_URL}/inventory/resolve_conflict?item_id=${itemId}&confusion_source=${confusionSource}`,
      {
        method: "POST",
      }
    )
      .then((response) => response.json())
      .catch((error) => console.error("Error resolving item conflict:", error));
  }

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
    <>
      <header className="w-full bg-mint-green text-dark-green shadow-lg">
        <div className="container mx-auto px-10 py-3">
          <h1 className="text-5xl font-extrabold text-center">
            Your Smart Giveaway Box
          </h1>
        </div>
        {openedBoxId && userId ? (
          <div className="top-0 left-0 w-full bg-dark-green text-white text-center py-2 font-bold z-50">
            The box is open - please close it after you are done.
          </div>
        ) : (
          <div></div>
        )}
      </header>

      <ConfusionModal
        isOpen={isModalOpen}
        items={confusionItems}
        onItemSelect={handleItemSelect}
        confusion_source={confusionSource}
      />

      <ScanModal
        isOpen={false}
        id={1}
        image_path={"/uploads/mug.jpg"}
        category={"Dishes"}
        title={"Snoopy"}
        description={"Snoopy Mug"}
        condition={"flawless"}
      />
    </>
  );
}
