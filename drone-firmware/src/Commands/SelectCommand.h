#ifndef SELECTCOMMAND_H
#define SELECTCOMMAND_H

#include "Command.h"

class SelectCommand : public Command{
    /*
    A select command is used to select a value from a
    list of possible values. It is used with the following
    DroneOperation types:
    - CONTROL_SELECT

    It takes the format
    [time] [DroneOperation] [Selected Value]
    */

    public:
        /*
        SelectedValue is the chosen value from the list of possible
        operations. In the case of a CONTROL_SELECT command, it 
        is the name of the chosen control system. 
        */
        String selectedValue;

        SelectCommand(int issueTime, DroneOperation op, String selectedValue);

        String toPrettyString();
};

#endif