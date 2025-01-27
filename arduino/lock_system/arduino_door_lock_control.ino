/*
This script controls the solenoid lock through the relay module. It waits for POST requests by the website to lock or unlock the lock.
When the lock is unlocked, the reed switch checks when the door has been closed. Once it closes, it sends a signal to lock the lock.

Attribution:
  Solenoid Lock: Used help in ChatGPT to adapt the tutorial code in https://arduinogetstarted.com/tutorials/arduino-controls-door-lock-via-web so that it can receive POST requests from the website and handle them correctly.
  Reed Switch: Extended tutorial code, adapted from https://careers.resmed.com/stem-activity/arduino-door-sensor/
  Backend Notification: Used help in ChatGPT to implement correct backend connection and POST requests to it
  Used help in ChatGPT to fix CORS (Cross-Origin Resource Sharing) issue (see headers in HTTP response)
*/

#include <WiFiS3.h>
#include "arduino_secrets.h"

#define RELAY_PIN 7  // Arduino pin connected to the solenoid lock via relay
#define DOOR_SENSOR_PIN 10 // Arduino pin connected to the reed switch (door sensor)

// Access network SSID and password through environment variables in arduino_secrets.h
const char ssid[] = SECRET_SSID;  // Change your network SSID (name)
const char pass[] = SECRET_PASS;  // Change your network password (use for WPA, or use as key for WEP)

const char backend_ip[] = SECRET_BACKEND_IP;  // Replace with your IP address
const int backend_port = 5000;          // Replace with your backend port
const char endpoint_open[] = "/box/notify_open";
const char endpoint_close[] = "/box/notify_closed";

int status = WL_IDLE_STATUS;
int doorState = LOW;
int doorSensorState = LOW;

bool doorOpened = false;

unsigned long timeUnlocked = 0; // Time when door has been unlocked
bool doorUnlocked = false;

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
  if (doorState == HIGH && doorSensorState == HIGH && !doorOpened) {  // Only start using reed switch when the door is unlocked and the reed switch detects that the door has actually been opened
    doorOpened = true;
    Serial.println("User has opened the door.");
    notifyBackend(backend_ip, backend_port, endpoint_open, "1");  // Notify backend that door has been opened by the user
  } else if (doorSensorState == LOW && doorOpened) {  // Only after door has been opened, wait for reed switch to detect closed door
    delay(1000);  // Wait 1s so that lock does not lock itself too early
    doorOpened = false;
    Serial.println("The door is closed");
    notifyBackend(backend_ip, backend_port, endpoint_close, "1");  // Notify backend that door has been closed by the user
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

      // Check if the request body contains the correct path "door/unlock"
      if (body.indexOf("door/unlock") > -1) {  // Check the path
        doorState = HIGH;
        digitalWrite(RELAY_PIN, doorState);  // Unlock the door
        Serial.println("Unlock the door");
        timeUnlocked = millis();  // Save time where door has been unlocked
        doorUnlocked = true;
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

  // Lock door again after timer runs out
  if(doorUnlocked && millis() - timeUnlocked >= 15000){ // When door has been unlocked for at least 15s, lock it
      doorState = LOW;
      digitalWrite(RELAY_PIN, doorState);  // Lock the door
      Serial.println("Lock the door");
      doorUnlocked = false;
  }
}

// Send POST request to server of website (functions: notify_box_open() or notify_box_closed())
void notifyBackend(const char* ip, int port, const char* endpoint, const char* box_id) {
  WiFiClient client;

  Serial.print("Connecting to backend at ");
  Serial.print(ip);
  Serial.print(":");
  Serial.println(port);

  if (client.connect(ip, port)) {  // Connect to the backend
    Serial.println("Connected to backend!");
    
    // Construct HTTP POST request
    String query = String(endpoint) + "?box_id=" + String(box_id);
    Serial.println(query);
    client.print("POST ");
    client.print(query);
    client.println(" HTTP/1.1");
    client.print("Host: ");
    client.println(ip);
    client.println("Content-Type: application/json");
    client.println("Connection: close");
    client.println();  // End of headers
    client.println("{}");  // Empty JSON body

    // Wait for server response
    while (client.connected() || client.available()) {
      if (client.available()) {
        String response = client.readString();
        Serial.println("Response from backend: ");
        Serial.println(response);
        break;
      }
    }

    client.stop();  // Disconnect from server
    Serial.println("Connection closed.");
  } else {
    Serial.println("Connection to backend failed.");
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

