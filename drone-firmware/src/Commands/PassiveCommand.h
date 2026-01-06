#ifndef PASSIVECOMMAND_H
#define PASSIVECOMMAND_H

#include "Command.h"

class PassiveCommand: public Command{
    /*
    A passive command is a command which does not require any extra 
    information besides the operation type. Appropriate DroneOperation 
    types for a PassiveCommand are:
    - ARM
    - DISARM
    - EMERGENCY_STOP
    - EMERGENCY_RESTART
    - HOVER
    - START_RECORD
    - END_RECORD

    The Full format of a PassiveCommand is
    [time] [DroneOperation]
    */

    public:
        PassiveCommand(int time, DroneOperation op);

        String toPrettyString() override;

        DroneState enactCommand(DroneState currentState) override;
};


#endif