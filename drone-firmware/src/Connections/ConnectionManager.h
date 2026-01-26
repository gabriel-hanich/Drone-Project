#ifndef CONNECTION_MANAGER_H
#define CONNECTION_MANAGER_H

#include "../DroneState.h"
#include "../Commands/Command.h"
#include "../Commands/PassiveCommand.h"

class ConnectionManager{
    /*
    This is an abstract class which handles communicating with
    the backend software. It should be extended by any class which
    attempts to communicate the current state of the drone or recieve
    commands from the drone. Unlike control systems. Connection
    Managers are not hot-swappable at run-time
    */
   public:

        ConnectionManager();

        /*
        This function should be run once to initiate the connection with
        whatever other device is used by the Connection Manager. The function
        should use Serial.print to communicate what the drone is connecting to,
        as well as information regarding how to connect to the drone (i.e port 
        numbers or IP Adresses). 
        Returns true if the connection was a success
        Returns false if the connection was a failure
        */
        bool virtual initialise() = 0;


        /*
        tick allows the connection manager to handle incoming requests. It should
        be called regularly (within loop()). 
        */
        virtual void tick() = 0;


        /*
        Changes the drone state data that will be sent out to any device
        which request it over http. newState is the most recent version of
        the drones state
        */
        void updateDroneState(DroneState newState);

        /*
        Returns the most recent command recieved by the connection manager
        */
        Command* getLastCommand();

        /*
        Returns whether or not the connection manager has a command which 
        has not yet been read
        */
        bool hasNewCommand();

        /*
        Returns the millis time when the drone last communicated with 
        a server to ensure that that the connection is still viable
        */
        int getLastContactTime();

    protected:
        /*
        The most recent drone state, which is sent whenever a request for
        the drone state is recieved
        */
        DroneState currentDroneState;
        
        /*
        The last command that was recieved by the connection manager
        */
        Command* lastRecievedCommand = new PassiveCommand(0, EMERGENCY_STOP);
                              
        /*
        A boolean describing whether or not the connection manager has 
        recieved a command which has not yet been accessed through `getLastCommand`
        */
        bool isNewCommand = false;

        /*
        The millis time during which the drone was last contacted by the server
        Used to automatically disarm, and then potentially emergency-stop the
        drone if it fails to communicate with the server
        */
        int lastContactTime = 0; 

};                                  



#endif