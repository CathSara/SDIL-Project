import React, { useState } from "react";
import Image from "next/image";

interface SlideTourModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const SlideTourModal: React.FC<SlideTourModalProps> = ({
  isOpen,
  closeModal,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Thank you for helping to extend product lifecycles! Since you’re new to the smart giveaway box, we’ll quickly explain how to use it.",
    "Let’s start with <b>picking an item</b>.",
    "<b>What to do:</b> Choose the item you want! The picked item will be tracked by its weight and displayed here:",
    "Sometimes the box might get confused about which item you took. In that case, please select the correct item from the list shown:",
    "To avoid confusion: <b>Please take only one item at a time!</b>",
    "Next, let’s talk about <b>donating an item</b>.",
    "First, place your item in the upper scanning compartment. The photo and details will be filled in automatically! <b>You can edit the details if needed:</b>",
    "Then, <b>place the item into the storage box!</b>",
    "That’s it – you’re all set to use the box!",
  ];


  const images = [
    null,
    null,
    "/tour/picked.png",
    "/tour/conflict.png",
    null,
    null,
    "/tour/scanned.png",
    null,
    "/landing.webp",
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    closeModal();
    setCurrentStep(0); // Reset tour steps when modal is closed
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-xl mx-4 p-6 rounded shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {currentStep === steps.length - 1
            ? "Ready!"
            : "Getting Started"}
        </h2>

        <div className="mb-4 mb-1">
          <p dangerouslySetInnerHTML={{ __html: steps[currentStep] }} />
        </div>

        {images[currentStep] && (
          <Image
            src={images[currentStep] || ""}
            className="rounded-md mb-4"
            width={1000}
            height={1000}
            style={{ width: "100%", height: "auto" }}
            alt={""}
          />
        )}

        <div className="flex justify-end">
          <button
            onClick={handleBack}
            className={`px-4 py-2 rounded-md bg-gray-200 mr-2 ${
              currentStep === 0 && "opacity-50 cursor-not-allowed"
            }`}
            disabled={currentStep === 0}
          >
            Back
          </button>
          {currentStep === steps.length - 1 ? (
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-dark-green text-white rounded-md"
            >
              Understood
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-dark-green text-white rounded-md"
            >
              Next
            </button>
          )}
        </div>
        <div className="flex justify-center items-center mt-4">
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full ${
                  index === currentStep ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideTourModal;
