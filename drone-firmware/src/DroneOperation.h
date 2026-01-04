#ifndef DRONEOPERATION_H
#define DRONEOPERATION_H

#include <Arduino.h>

enum DroneOperation{
    ARM,
    DISARM,
    EMERGENCY_STOP,
    EMERGENCY_RESTART,
    HOVER,
    RESET,
    SET,
    START_RECORD,
    END_RECORD,
    CONTROL_SELECT,
    CONTROL_SET,
    FLAG_SET
};


static const char* const opStrings[12] = {
    "ARM",
    "DISARM",
    "EMERGENCY_STOP",
    "EMERGENCY_RESTART",
    "HOVER",
    "RESET",
    "SET",
    "START_RECORD",
    "END_RECORD",
    "CONTROL_SELECT",
    "CONTROL_SET",
    "FLAG_SET"
};

// Function which converts an enum value to the string
inline String droneOpToString(DroneOperation op){
    return opStrings[op];
};

inline DroneOperation stringToDroneOp(String st){
    for(int i=0; i<11; i++){
        if(st == opStrings[i]){
            return static_cast<DroneOperation>(i);
        }
    }

    return static_cast<DroneOperation>(-1);
};

#endif