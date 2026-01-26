#ifndef ESP_CONNECTION_H
#define ESP_CONNECTION_H


#include <esp_now.h>
#include "../ConnectionManager.h"

typedef struct NOWMsg {
  char a[32];
  int b;
  float c;
  bool d;
};


class ESPNowConnection : public ConnectionManager{
    /*
    Handles communication with another ESP over the ESP-NOW
    framework. 
    NOT COMPLETED YET
    */
    public:
        ESPNowConnection();
        
        /*
        Initialises the connection to the other ESP32
        - recieverMac is the Mac Address of the reciever board
        */
        bool initialise(uint8_t recieverMac);


        /*
        Sends data to the other ESP32, and listens for new 
        commands
        */
        void tick();

    protected:
        String macAddress; // The macAddress of THIS ESP
        esp_now_peer_info_t peerData; // The data required to connect to a peer


};

#endif