# Camera System Guide

This README documents the hard- and software components used for the camera system, as well as its functionalities.

## Required Hardware Components
- [ESP32 CAM Board with Wi-Fi](https://www.amazon.de/ESP32-CAM-Bluetooth-Entwicklungsplatine-Schnittstelle-kompatibel/dp/B0CSZ8HPJ2/ref=sr_1_1_sspa?__mk_de_DE=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=B4Z98LMZ1LOT&dib=eyJ2IjoiMSJ9.UCE12gZhdtibr8m_hOSyWm2AAK8xQk11jABV8Ar9UokWPhhkv--RHmxWCdu_HladP2lCY44SrwPE2dv3SfAA--vWWUDBqGZGotV4eVr_fEQO04PIxy-oUjRyY-5o1nZ-EGZheH4bF-LZldaB_tkV5q10vw9FMVvbuUX6-QkqTRJGKcKYHQ1OZhGYRYZlXyJgrIlO9iqS3ueL3cpCi0JCM4HhUMmTWpttW_gtEETUdsc.CNxW9M26eFWRVAXFhfNyvn8_LVeGvdn_VpTn_VsNxb4&dib_tag=se&keywords=esp32%2Bcam%2Bboard&qid=1738067554&sprefix=esp32%2Bcam%2Bboard%2Caps%2C87&sr=8-1-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1)
- 5V USB Power Adapter
- USB to Micro USB cable

## Required Software

- [Arduino IDE](https://www.arduino.cc/en/software)
- Smart Giveaway Box Website (see README's of [Frontend](https://github.com/CathSara/SDIL-Project/tree/main/website-sharingbox) and [Backend](https://github.com/CathSara/SDIL-Project/tree/main/backend) for more information)

## Cable Connections

No cable connections are required as the ESP32 camera module is already connected to the ESP32 board and has integrated WiFi. The Micro USB is the only cable needed.

## Build Instructions

- In the Arduino IDE and open File > Preferences.
- Add the URL: https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json to the "Additional Board Manager URLs" field and click "OK".
- Go to Tools > Board > Boards Manager. Search for "esp32" and install the package by Espressif Systems.
- Connect the Arduino ESP32 Cam Board with WiFi to your PC with the Micro USB Cable.
- Select Tools > Board > ESP32 Arduino > AI Thinker ESP32-CAM.
- Open Tools > Port and select the COM port that is connected to the ESP32 Board.
- Open the file `arduino_camera_server.ino` with the Arduino IDE. Click on "OK" when the pop up message appears to create a sketch folder and move the file.
- In the same folder, create the file `arduino_secrets.h`, add the following code and change the SSID, password and IP address to yours:
```
//arduino_secrets.h header file
#define SECRET_SSID "YOUR_SSID" // Change your network SSID (name)
#define SECRET_PASS "YOUR_PASSWORD" // Change your network password (use for WPA, or use as key for WEP)
#define SECRET_IP "CAMERA_IP_ADDRESS" // Replace with the camera's IP address which you can obtain in the following step.
```
- Click on the upload button (with arrow) to upload the code to your ESP32 Board. Then, open the Serial Monitor and check if an IP address appears. This is the IP address of the ESP32 camera server that is started using the code. If no IP address appears, press the 'Reset' button on the side of the ESP32 Board and check again if the server is started correctly. Resetting the camera is usually a good troubleshooting practice in the event where something does not work as expected.
- Note: The files in this folder that were not referenced in this README are generated automatically and can be ignored for the camera setup.

## How it works

- Run the frontend and backend of the website.
- Now, when a new item is placed into a box, the camera automatically takes an image of the item.
- The code in the `capture.py` file specifies how this is done. Afterwards, the taken image is encoded to a Base64 image and sent to the OpenAI Vision API, where the item features are automatically detected. The image is then cropped to the center coordinates of the object in the image, and item information are updated so that the item can be included in the inventory of the box.