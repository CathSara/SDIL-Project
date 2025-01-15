#include "WiFiS3.h"
#include "arduino_secrets.h"

// Replace with your WiFi credentials in the arduino_secrets.h file
char ssid[] = SECRET_SSID;       
char pass[] = SECRET_PASS;      
int keyIndex = 0;

int status = WL_IDLE_STATUS;
char server[] = "172.20.10.2"; // Replace with the local IP of your backend server // STARTEN MIT DIESEM BEFEHL: "flask run --host=0.0.0.0 --port=5001"
int port = 5001;                // Port number for your backend server

WiFiClient client;

void setup() {
  Serial.begin(9600);
  while (!Serial) {
    ; // Wait for serial port to connect
  }

  if (WiFi.status() == WL_NO_MODULE) {
    Serial.println("Communication with WiFi module failed!");
    while (true);
  }

  String fv = WiFi.firmwareVersion();
  if (fv < WIFI_FIRMWARE_LATEST_VERSION) {
    Serial.println("Please upgrade the firmware");
  }

  while (status != WL_CONNECTED) {
    Serial.print("Attempting to connect to SSID: ");
    Serial.println(ssid);
    status = WiFi.begin(ssid, pass);
    delay(10000);
  }

  printWifiStatus();

  Serial.println("\nStarting connection to server...");
  if (client.connect(server, port)) {
    Serial.println("Connected to server");
    // Send HTTP GET request
    client.println("GET /inventory/item?item_id=1 HTTP/1.1"); // HIER STECKT DER GET REQUEST DRIN
    client.println("Host: 172.20.10.2"); // Update with your server IP or hostname
    client.println("Connection: close");
    client.println();
  } else {
    Serial.println("Connection to server failed.");
  }
}

void read_response() {
  uint32_t received_data_num = 0;
  while (client.available()) {
    char c = client.read();
    Serial.print(c);
    received_data_num++;
    if (received_data_num % 80 == 0) {
      Serial.println();
    }
  }
}

void loop() {
  read_response();

  if (!client.connected()) {
    Serial.println();
    Serial.println("Disconnecting from server.");
    client.stop();

    while (true);
  }
}

void printWifiStatus() {
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);

  long rssi = WiFi.RSSI();
  Serial.print("Signal strength (RSSI):");
  Serial.print(rssi);
  Serial.println(" dBm");
}
