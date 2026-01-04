#ifndef ACTIVECOMMAND_H
#define ACTIVECOMMAND_H

#include "Command.h"
#include "DroneProperty.h"

class ActiveCommand: public Command{
    /*
    Active commands are a type of command that pass a parameter to the 
    drone. Active commands are those associated with the following drone 
    operations:
        - SET
        - RESET
    
    Active commands have a string format of
    [TIME] [DRONEOPERATION] [DRONEPARAMETER] [VALUE]
    Where value is a double
    */
    
    public:
        /*
        The property within the dronestate that will be effected by the command
        */
        DroneProperty property;

        /*
        The value that the property will be set to or reset to 
        */
        double value;

        
        ActiveCommand(int time, DroneOperation operation, DroneProperty property, double value);

        String toPrettyString();
};

#endif