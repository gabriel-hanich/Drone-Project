#ifndef WEBMANAGER_H
#define WEBMANAGER_H

#include <Wifi.h>
#include "../DroneState.h"
#include "../Commands/Command.h"
#include "../Commands/PassiveCommand.h"
#include "../DroneOperation.h"


class WebManager{
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
        void initialise();


        /*
        Uses HTTP to deterimne the time, enabling the board's time to 
        accurately match UTC
        */
       void syncTime();

        /*
        Recieves a client who made a request to the drone and provides the
        client with the drone data.
        ** MUST BE CALLED REGULARLY INSIDE OF loop() **
        */
        void tick();

        /*
        Changes the drone state data that will be sent out to any device
        which request it over http. newState is the most recent version of
        the drones state
        */
        void updateDroneState(DroneState newState);

        /*
        Returns the most recent command recieved by the drone
        */
        Command getLastCommand();



    private:
        const char* ssid; // The ssid of the wifi network that the drone will connect to 
        const char* password; // The password of the wifi network
        int port; // The port that the web server will operate over

        WiFiServer webServer;

        DroneState currentDroneState; // The most recent drone state, to be communicated to 
                                      // whichever device makes a GET request
        Command lastRecievedCommand = PassiveCommand(0, EMERGENCY_STOP); // The last command which was recieved by the server


        // This is a function that sends a connected client the value stored in 'currentDroneState' 
        void sendDroneState(WiFiClient client);


        // This method returns a HTTP error in the case that the http request was incorrect 
        void sendErrorHTTP(WiFiClient client);
};


#endif