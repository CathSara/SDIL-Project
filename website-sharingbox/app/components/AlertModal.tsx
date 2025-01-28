import React from "react";

interface ConfusionModalProps {
  isOpen: boolean;
  text: string;
  closeModal: () => void;
}

const AlertModal: React.FC<ConfusionModalProps> = ({
  isOpen,
  text,
  closeModal,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-xl mx-4 p-6 rounded shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Oops!</h2>
        <p>{text}</p>
        <div className="flex justify-center mt-6">
          <button
            onClick={closeModal}
            className="bg-dark-green text-white py-2 px-4 rounded-lg text-lg hover:bg-dark-green-hover focus:outline-none focus:ring-2 focus:ring-dark-green"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
