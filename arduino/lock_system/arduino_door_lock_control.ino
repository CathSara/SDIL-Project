/*
This script controls the solenoid lock through the relay module. It waits for POST requests by the website to lock or unlock the lock.
When the lock is unlocked, the reed switch checks when the door has been closed. Once it closes, it sends a signal to lock the lock.

Attribution:
  Solenoid Lock: Used help in ChatGPT to adapt the tutorial code in https://arduinogetstarted.com/tutorials/arduino-controls-door-lock-via-web so that it can receive POST requests from the website and handle them correctly.
  Reed Switch: Extended tutorial code, adapted from https://careers.resmed.com/stem-activity/arduino-door-sensor/
  Used help in ChatGPT to fix CORS (Cross-Origin Resource Sharing) issue (see headers in HTTP response)
*/

#include <WiFiS3.h>
#include "arduino_secrets.h"

#define RELAY_PIN 7  // Arduino pin connected to the solenoid lock via relay
#define DOOR_SENSOR_PIN 10 // Arduino pin connected to the reed switch (door sensor)

// Access network SSID and password through environment variables in arduino_secrets.h
const char ssid[] = SECRET_SSID;  // Change your network SSID (name)
const char pass[] = SECRET_PASS;  // Change your network password (use for WPA, or use as key for WEP)

int status = WL_IDLE_STATUS;
int doorState = LOW;
int doorSensorState = LOW;

bool doorOpened = false;

WiFiServer server(80);

void setup() {
  // Initialize serial and wait for port to open:
  Serial.begin(9600);
  pinMode(RELAY_PIN, OUTPUT);  // Set Arduino pin to output mode
  pinMode(DOOR_SENSOR_PIN, INPUT_PULLUP); // set arduino pin to input pull-up mode

  String fv = WiFi.firmwareVersion();
  if (fv < WIFI_FIRMWARE_LATEST_VERSION) {
    Serial.println("Please upgrade the firmware");
  }

  // Attempt to connect to WiFi network:
  while (status != WL_CONNECTED) {
    Serial.print("Attempting to connect to SSID: ");
    Serial.println(ssid);
    status = WiFi.begin(ssid, pass);  // Connect to WPA/WPA2 network
    delay(10000);  // Wait 10 seconds for connection
  }

  server.begin();
  printWifiStatus();  // Print connection details
}

void loop() {
  // Reed switch control
  doorSensorState = digitalRead(DOOR_SENSOR_PIN); // Read state
  if (doorState == HIGH) {  // Only use reed switch when the lock has been unlocked (door opened), lock should always be locked if door is closed
    if (doorSensorState == LOW && !doorOpened) {  // Variable 'doorOpened' (initially false) prevents the lock to lock itself immediately after the door has opened, wait until reed switch detects opened door
      doorOpened = true;
      Serial.println("User has opened the door. Wait for the user to close the door.");
    } else if (doorSensorState == HIGH && doorOpened) {  // After door has been opened (door sensor high -> low) and reed switch detects closed door, signal to relay module to lock the lock
      delay(1000);  // Wait 1s so that lock does not lock itself too early
      doorOpened = false;
      doorState = LOW;
      digitalWrite(RELAY_PIN, doorState);  // Lock the door
      Serial.println("The door is closed");
    }
  }
  
  // Solenoid lock and relay module control
  WiFiClient client = server.available();  // Listen for incoming clients
  if (client) {
    String HTTP_req = "";
    while (client.connected()) {
      if (client.available()) {
        HTTP_req = client.readStringUntil('\n');  // Read the first line of the request
        break;
      }
    }

    // Process POST requests for door control
    if (HTTP_req.indexOf("POST") == 0) {  // Check if request method is POST
      String body = "";
      while (client.available()) {
        char c = client.read();
        body += c;  // Read the request body
      }

      // Check if the request body contains the correct box interaction (unlock or lock)
      if (body.indexOf("door/unlock") > -1) {  // Check the path
        doorState = HIGH;
        digitalWrite(RELAY_PIN, doorState);  // Unlock the door
        Serial.println("Unlock the door");
      } else if (body.indexOf("door/lock") > -1) {  // Check the path
        doorState = LOW;
        digitalWrite(RELAY_PIN, doorState);  // Lock the door
        Serial.println("Lock the door");
      } else {
        Serial.println("No command");
      }
    }

    // Send the HTTP response
    // Send the HTTP response header
    client.println("HTTP/1.1 200 OK");
    client.println("Content-Type: text/plain");
    client.println("Connection: close");  // The connection will be closed after completion of the response
    // Fix CORS issue so that request and fetch does not get blocked
    client.println("Access-Control-Allow-Origin: *");
    client.println("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    client.println("Access-Control-Allow-Headers: Content-Type");
    client.println();  // The separator between HTTP header and body
    // Send the HTTP response body
    client.println("Box interaction successful");
    client.flush();
    // Give the web browser time to receive the data
    delay(10);
    // Close the connection
    client.stop();
  }
}

void printWifiStatus() {
  // Print your board's IP address
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
  // Print the received signal strength
  Serial.print("Signal strength (RSSI):");
  Serial.print(WiFi.RSSI());
  Serial.println(" dBm");
}

