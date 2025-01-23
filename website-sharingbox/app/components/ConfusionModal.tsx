import React, { useState } from "react";
import Image from "next/image";

interface ConfusionModalProps {
  isOpen: boolean;
  items: {
    id: number;
    image_path: string;
    title: string;
    description: string;
  }[];
  onItemSelect: (selectedItemId: number | null) => void;
  confusion_source: string;
}

const ConfusionModal: React.FC<ConfusionModalProps> = ({
  isOpen,
  items,
  onItemSelect,
  confusion_source,
}) => {
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  if (!isOpen) return null;

  function handleItemClick(itemId: number) {
    setSelectedItemId((prev) => (prev === itemId ? null : itemId)); // Toggle selection
  }

  function handleSubmit() {
    if (selectedItemId) {
      onItemSelect(selectedItemId);
    } else {
      alert("Please select an item before submitting.");
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-4xl mx-4 p-6 rounded shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Select an Item</h2>
        {confusion_source === "picked" && (
          <p className="mb-3">
            Please tell us which item you picked from the storage compartment.
          </p>
        )}
        {confusion_source === "stored" && (
          <p className="mb-3">
            Please tell us which item you returned to the storage compartment.
          </p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className={`border-2 rounded-lg p-2 cursor-pointer ${
                selectedItemId === item.id
                  ? "border-dark-green"
                  : "border-gray-300"
              }`}
              onClick={() => handleItemClick(item.id)}
            >
              <Image
                src={item.image_path}
                alt={item.title}
                className="object-cover w-[350px] h-[200px]"
                width={350}
                height={350}
              />
              <h3 className="text-lg font-semibold mt-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
        <button
          onClick={handleSubmit}
          className="mt-6 bg-dark-green text-white font-bold py-2 px-4 rounded w-full"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ConfusionModal;
