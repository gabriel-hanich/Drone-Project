#ifndef CONTROLSETCOMMAND_H
#define CONTROLSETCOMMAND

#include "Command.h"

class SetValueCommand : public Command{
    /*
    The SetValue Command is a command which sets a certain type
    of value used within a given subsystem. They can be used to 
    set constants within a control system, or set the value of a
    given flag. Applicable DroneOperations for a SetValueCommand
    is:
    - CONTROL_SET
    - FLAG_SET

    SetValueCommands have the following format
    [time] [DroneOperation] [Key] [Value]
    */

    public:
        /*
        Key is the value within the given subsystem (either control 
        system or flag that corresponds to the value you want to 
        change)
        */
        String key;

        /*
        Value is the value that the key will be set to once the command
        is applied
        */
        double value;

        SetValueCommand(int issueTime, DroneOperation operation, String key, double value);

        String toPrettyString();

        DroneState enactCommand(DroneState currentState);



};

#endif