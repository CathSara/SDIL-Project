import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import ConfusionModal from "./ConfusionModal";
import { useRouter } from "next/navigation";
import ScanModal from "./ScanModal";
import AlertModal from "./AlertModal";
import SlideTourModal from "./SlideTourModal";

interface Item {
  id: number;
  image_path: string;
  category: string;
  title: string;
  description: string;
  condition: string;
}

const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL);

export default function Header() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();
  const [isConfusionModalOpen, setIsConfusionModalOpen] = useState(false);
  const [confusionItems, setConfusionItems] = useState([]);
  const [confusionSource, setConfusionSource] = useState("");
  const [isScanModalOpen, setScanIsModalOpen] = useState(false);
  const [scannedItem, setScannedItem] = useState<Item>();
  const [isAlertModalOpen, setAlertModalOpen] = useState(false);
  const [alertModalMessage, setAlertModalMessage] = useState("");
  const [isTourModalVisible, setTourModalVisible] = useState(false);
  const openedBoxId = getCookie("opened_box_id");
  const userId = getCookie("user_id");

  const defaultItem: Item = {
    id: 0,
    image_path: "",
    category: "",
    title: "",
    description: "",
    condition: "",
  };

  useEffect(() => {
    if (!getCookie("tutorial_seen") && openedBoxId) {
      setTourModalVisible(true);
    }

    socket.on("confused", (data) => {
      console.log("received item_update confused");
      if (openedBoxId) {
        if (data.data.status === "confused") {
          console.log("if works");
          setConfusionItems(data.data.items);
          setConfusionSource(data.data.confusion_source);
          setIsConfusionModalOpen(true); // Open the modal
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
        setIsConfusionModalOpen(true); // Open the modal
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

    socket.on("item_scan", (data) => {
      console.log("received item scan", data.data.image_path);
      setScannedItem(data.data);
      setScanIsModalOpen(true);
      localStorage.setItem("itemScanData", JSON.stringify(data.data));
    });

    // Check for persisted confusion state on page load
    const savedItemScanData = localStorage.getItem("itemScanData");
    if (savedItemScanData) {
      const parsedData = JSON.parse(savedItemScanData);
      setScannedItem(parsedData);
      setScanIsModalOpen(true);
    }

    socket.on("item_scan_stored", () => {
      console.log("item scan has been stored");
      setScanIsModalOpen(false);
      localStorage.removeItem("itemScanData");
    });

    socket.on("alert", (data) => {
      console.log("alert should be triggered");
      setAlertModalMessage(data.data.message);
      setAlertModalOpen(true);
    });

    return () => {
      socket.off("confused");
      socket.off("open");
      socket.off("close");
      socket.off("item_scan");
      socket.off("item_scan_stored");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleItemSelect(itemId: number | null) {
    if (itemId === null) {
      console.warn("No item selected.");
      return;
    }
    console.log("Selected item ID:", itemId);
    setIsConfusionModalOpen(false);
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

  function saveTutorialDone() {
    document.cookie = `tutorial_seen=true; path=/;`;
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
        isOpen={isConfusionModalOpen}
        items={confusionItems}
        onItemSelect={handleItemSelect}
        confusion_source={confusionSource}
      />

      <ScanModal isOpen={isScanModalOpen} item={scannedItem || defaultItem} />

      <AlertModal
        isOpen={isAlertModalOpen}
        text={alertModalMessage}
        closeModal={() => setAlertModalOpen(false)}
      ></AlertModal>

      <SlideTourModal
        isOpen={isTourModalVisible}
        closeModal={() => {setTourModalVisible(false); saveTutorialDone();}}
      ></SlideTourModal>
    </>
  );
}
