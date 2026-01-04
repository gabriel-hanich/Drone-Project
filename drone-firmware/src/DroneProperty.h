#ifndef DRONEPROPERTY_H
#define DRONEPROPERTY_H

/*
DroneProperty is an enum describing all of the possible properties
of the drone which can be changed by a command to the drone
*/

enum DroneProperty{
    PITCH_SETPOINT,
    ROLL_SETPOINT,
    YAW_SETPOINT,
    PITCH_ACC_SETPOINT,
    ROLL_ACC_SETPOINT,
    YAW_ACC_SETPOINT,
    X_ACC_SETPOINT,
    Y_ACC_SETPOINT,
    Z_ACC_SETPOINT,
    ELEVATION_SETPOINT,

    /*
    The below DroneProperties are only for testing the hardware. The drone will
    only act on these commands if the HARDWARE_TESTING flag is set to true
    */
    D_MOTOR1_THROTTLE,
    D_MOTOR2_THROTTLE,
    FIN1_DEFLECTION,
    FIN2_DEFLECTION,
    FIN3_DEFLECTION,
    FIN4_DEFLECTION
};


static const char* const propertyStrings[16] = {
    "PITCH_SETPOINT",
    "ROLL_SETPOINT",
    "YAW_SETPOINT",
    "PITCH_ACC_SETPOINT",
    "ROLL_ACC_SETPOINT",
    "YAW_ACC_SETPOINT",
    "X_ACC_SETPOINT",
    "Y_ACC_SETPOINT",
    "Z_ACC_SETPOINT",
    "ELEVATION_SETPOINT",
    "D_MOTOR1_THROTTLE",
    "D_MOTOR2_THROTTLE",
    "FIN1_DEFLECTION",
    "FIN2_DEFLECTION",
    "FIN3_DEFLECTION",
    "FIN4_DEFLECTION"
};

// Function which converts an enum value to the string
inline String dronePropertyToString(DroneProperty op){
    return propertyStrings[op];
};

inline DroneProperty stringToDroneProperty(String st){
    for(int i=0; i<16; i++){
        if(st == propertyStrings[i]){
            return static_cast<DroneProperty>(i);
        }
    }

    return static_cast<DroneProperty>(-1);
};

#endif