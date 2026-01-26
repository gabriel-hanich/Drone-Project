#ifndef WEBMANAGER_H
#define WEBMANAGER_H

#include <Wifi.h>


#include "../ConnectionManager.h"


class WebManager: public ConnectionManager{
    /*
    This class manaages the web server's operation, including initialising
    the web server and handling sending and getting new data
    */

    public:
        WebManager(const char* ssid, const char* password, int port);


        /*
        Initialises the web server. After this command is run, the drone
        is able to be connected to, and transmit data
        */
        bool initialise();


        /*
        Recieves a client who made a request to the drone and provides the
        client with the drone data.
        ** MUST BE CALLED REGULARLY INSIDE OF loop() **
        */
        void tick();



        /*
        Uses HTTP to deterimne the time, enabling the board's time to 
        accurately match UTC
        */
        void syncTime();

        


    private:
        const char* ssid; // The ssid of the wifi network that the drone will connect to 
        const char* password; // The password of the wifi network
        int port; // The port that the web server will operate over

        WiFiServer webServer;

       
        // This is a function that sends a connected client the value stored in 'currentDroneState' 
        void sendDroneState(WiFiClient client);


        // This function handles when a POST request containing a new command is made to the drone
        void handlePostRequest(WiFiClient client, String headers);


        // This method returns a HTTP error in the case that the http request was incorrect 
        void sendErrorHTTP(WiFiClient client);
};


#endif