#include "PassiveCommand.h"
#include <Arduino.h>

PassiveCommand::PassiveCommand(int time, DroneOperation op)
    : Command(time, op) {};

String PassiveCommand::toPrettyString(){
    return droneOpToString(operation);
};

DroneState PassiveCommand::enactCommand(DroneState currentState){
    switch (operation){
        case ARM:
            if(!currentState.isEStopped){
                currentState.isArmed = true;
            }
            break;
        case DISARM:
            if(!currentState.isEStopped){
                currentState.isArmed = false;
            }
            break;
        case EMERGENCY_STOP:
            currentState.isArmed = false;
            currentState.isEStopped = true;
            break;
        case EMERGENCY_RESTART:
            if(currentState.isEStopped){
                currentState.isArmed = false;
                currentState.isEStopped = false;
            }
            break;
        case HOVER:
            currentState.pitchSetPoint = 0;
            currentState.rollSetPoint = 0;
            currentState.yawSetPoint = 0;

            currentState.pitchAccSetPoint = 0;
            currentState.rollAccSetPoint = 0;
            currentState.yawAccSetPoint = 0;

            currentState.xAccSetPoint = 0;
            currentState.yAccSetPoint = 0;
            currentState.zAccSetPoint = 0;
            break;
        
    };

    return currentState;



};