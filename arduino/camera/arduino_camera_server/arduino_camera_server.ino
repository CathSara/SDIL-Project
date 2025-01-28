// Main sketch for the ESP32-CAM board and camera.
// This code is already loaded onto the camera and starts a webserver at the specified port.
// A capture can then be taken by visiting the /capture path. Afterwards the image can be saved.
// Playing around with the parameters results in different image sizes, resolutions, compression etc.

// The only other relevant file in this folder is the arduino_secrets.h specifying the network credentials.
// All other files are generated when compiling this sketch and do not need to be modified.

// Author: Tim Hebestreit

#include "esp_camera.h"
#include <WiFi.h>
#define CAMERA_MODEL_AI_THINKER
#include "camera_pins.h"
#include "arduino_secrets.h"

const char *ssid = SECRET_SSID;
const char *password = SECRET_PASS;

WiFiServer server(80);

void controlFlash(bool state) {
  // Turns the flash LED on or off depending on the state variable
  if (LED_GPIO_NUM >= 0) {
    pinMode(LED_GPIO_NUM, OUTPUT);
    digitalWrite(LED_GPIO_NUM, state ? HIGH : LOW);
  }
}

void handleClient() {
  WiFiClient client = server.available();

  if (!client) {
    return;
  }

  Serial.println("New Client connected");
  String header = client.readStringUntil('\r');
  client.flush();

  if (header.indexOf("GET /capture") >= 0) {
    controlFlash(true);
    delay(200);

    camera_fb_t *fb = esp_camera_fb_get();
    if (!fb) {
      Serial.println("Camera capture failed");
      client.println("HTTP/1.1 500 Internal Server Error");
      client.println("Content-Type: text/plain");
      client.println();
      client.println("Failed to capture image");
    } else {
      client.println("HTTP/1.1 200 OK");
      client.println("Content-Type: image/jpeg");
      client.println("Content-Disposition: inline; filename=\"photo.jpg\"");
      client.println("Content-Length: " + String(fb->len));
      client.println();
      client.write(fb->buf, fb->len);
      esp_camera_fb_return(fb);
      Serial.println("Photo sent to client");
    }
    delay(50);
    controlFlash(false);

  } else {
    client.println("HTTP/1.1 200 OK");
    client.println("Content-Type: text/html");
    client.println();
    client.println("<!DOCTYPE html>");
    client.println("<html>");
    client.println("<head><title>ESP32-CAM Photo</title></head>");
    client.println("<body>");
    client.println("<h1>ESP32-CAM Photo Server</h1>");
    client.println("<p><a href=\"/capture\">Take Photo</a></p>");
    client.println("</body>");
    client.println("</html>");
  }

  delay(1);
  client.stop();
  Serial.println("Client disconnected");
}

void setup() {
  Serial.begin(115200);
  Serial.setDebugOutput(true);
  Serial.println();

  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sccb_sda = SIOD_GPIO_NUM;
  config.pin_sccb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;
  config.frame_size = FRAMESIZE_UXGA;
  config.jpeg_quality = 10;
  config.fb_count = 2;
  config.fb_location = CAMERA_FB_IN_PSRAM;
  config.grab_mode = CAMERA_GRAB_LATEST;

  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Camera init failed with error 0x%x\n", err);
    return;
  }

  WiFi.begin(ssid, password);
  WiFi.setSleep(false);

  Serial.print("WiFi connecting");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println(WiFi.localIP());

  server.begin();
}

void loop() {
  handleClient();
}
