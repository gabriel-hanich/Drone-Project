

#include "WiFi.h"
#include "ESPNowConnection.h"

ESPNowConnection::ESPNowConnection()
    : ConnectionManager() {};

void onDataSent(const uint8_t *mac_addr, esp_now_send_status_t status){
    if(status != ESP_NOW_SEND_SUCCESS){
        Serial.println("FAILED TO SEND ESP-NOW PACKET");
    }
}

bool ESPNowConnection::initialise(uint8_t recieverMac){
    // Get the ESP's MAC Address
    WiFi.mode(WIFI_MODE_STA);
    this->macAddress = WiFi.macAddress();

    esp_now_register_send_cb(onDataSent);



};

