import React from 'react';
import { arduinoIP } from '../../config';

// Used help in ChatGPT and https://arduinogetstarted.com/tutorials/arduino-controls-door-lock-via-web
// to create a button that correctly connects with the Arduino UNO R4 Wifi and posts requests to it to control the lock
const BoxInteractionButton = ({lockStatus, nextPage, buttonText}) => {
    const handleLock = async () => {
        try {
          const response = await fetch(`${arduinoIP}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lockStatus }),
          });
  
          if (response.ok) {
            console.log(`Door interaction to "${lockStatus}" was successful`);
            window.location.href = nextPage;
          } else {
            console.error("Failed to control the door");
          }
        } catch (error) {
          console.error("Error communicating with the Arduino:", error);
        }
      };

      return (
        <button
            className="text-2xl mb-6 px-6 py-3 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
            onClick={(e) => {
              e.preventDefault(); // Required to post request to Arduino, prevents default link behavior
              handleLock();
            }}
          >
            {buttonText}
        </button>
      )
}

export default BoxInteractionButton