#ifndef DRONESTATE_H
#define DRONESTATE_H

#include <Arduino.h>
#include <vector>

#include "Controller/CSConstant.h"

/*
 This struct describes the current state of the drone
 It will be properly documented later
*/
struct DroneState {
    int opTime;
    int epochTime;

    bool isArmed;
    bool isEStopped;
    std::string lastInstruction;

    std::vector<String> controlSystemList;
    String currentControlSystem;
    std::vector<CSConstant> controlSystemVals;

    std::vector<String> activeFlags;

    double refreshRate;
    double packetAge;

    double pitch;
    double roll;
    double yaw;
    double pitchSetPoint;
    double rollSetPoint;
    double yawSetPoint;

    double pitchAcc;
    double rollAcc;
    double yawAcc;
    double pitchAccSetPoint;
    double rollAccSetPoint;
    double yawAccSetPoint;

    double xAcc;
    double yAcc;
    double zAcc;
    double xAccSetPoint;
    double yAccSetPoint;
    double zAccSetPoint;

    double elevation;
    double elevationSetPoint;

    double dMotor1Throttle;
    double dMotor2Throttle;

    double fin1Deflection;
    double fin2Deflection;
    double fin3Deflection;
    double fin4Deflection;
};

/*
This function converts a list of strings into a single string describing 
the list in JSON format
*/
inline String stringListToString(const std::vector<String>& lst) {
    String res = "[";
    for(int i=0; i<lst.size(); i++){
        res += "'" + lst[i] + "'";
        
        if(i != lst.size() - 1){
            res += ",";
        }
    };
    res += "]"; 
    return res;
}


/*
This function converts a list of Control System Constants into a dictionary
where the name of the CSConstant is the key, pointing to the corresponding
value. The returned string is in JSON format
*/
inline String constantListToString(const std::vector<CSConstant>& lst) {
    String res = "{";
    for(int i=0; i<lst.size(); i++){
        res += String(lst[i].name.c_str()) + ": " + String(lst[i].value, 6);
        if(i != lst.size() - 1){
            res += ", ";
        }
    };
    res += "}"; 
    return res; 
}


/*
This produces a string in JSON format that describes the current state
of the drone. 
*/
inline String droneStateToString(const DroneState& state) {
    String res = "{";

    res += "\n\"opTime\": " + String(state.opTime);
    res += ",\n\"epochTime\": " + String(state.epochTime);
    res += ",\n\"isArmed\": " + String(state.isArmed);
    res += ",\n\"isEStopped\": " + String(state.isEStopped);
    res += ",\n\"lastInstruction\": \"" + String(state.lastInstruction.c_str()) + "\"";

    res += ",\n\"controlSystemList\": " + stringListToString(state.controlSystemList);
    res += ",\n\"currentControlSystem\": \"" + String(state.currentControlSystem.c_str()) + "\"";
    res += ",\n\"controlSystemVals\": " + constantListToString(state.controlSystemVals);
    
    res += ",\n\"activeFlags\": " + stringListToString(state.activeFlags);

    res += ",\n\"refreshRate\": " + String(state.refreshRate, 6);
    res += ",\n\"packetAge\": " + String(state.packetAge, 6);

    res += ",\n\"pitch\": " + String(state.pitch, 6);
    res += ",\n\"roll\": " + String(state.roll, 6);
    res += ",\n\"yaw\": " + String(state.yaw, 6);

    res += ",\n\"pitchSetPoint\": " + String(state.pitchSetPoint, 6);
    res += ",\n\"rollSetPoint\": " + String(state.rollSetPoint, 6);
    res += ",\n\"yawSetPoint\": " + String(state.yawSetPoint, 6);

    res += ",\n\"pitchAcc\": " + String(state.pitchAcc, 6);
    res += ",\n\"rollAcc\": " + String(state.rollAcc, 6);
    res += ",\n\"yawAcc\": " + String(state.yawAcc, 6);

    res += ",\n\"pitchAccSetPoint\": " + String(state.pitchAccSetPoint, 6);
    res += ",\n\"rollAccSetPoint\": " + String(state.rollAccSetPoint, 6);
    res += ",\n\"yawAccSetPoint\": " + String(state.yawAccSetPoint, 6);

    res += ",\n\"xAcc\": " + String(state.xAcc, 6);
    res += ",\n\"yAcc\": " + String(state.yAcc, 6);
    res += ",\n\"zAcc\": " + String(state.zAcc, 6);

    res += ",\n\"xAccSetPoint\": " + String(state.xAccSetPoint, 6);
    res += ",\n\"yAccSetPoint\": " + String(state.yAccSetPoint, 6);
    res += ",\n\"zAccSetPoint\": " + String(state.zAccSetPoint, 6);

    res += ",\n\"elevation\": " + String(state.elevation, 6);
    res += ",\n\"elevationSetPoint\": " + String(state.elevationSetPoint, 6);

    res += ",\n\"fin1Deflection\": " + String(state.fin1Deflection, 6);
    res += ",\n\"fin2Deflection\": " + String(state.fin2Deflection, 6);
    res += ",\n\"fin3Deflection\": " + String(state.fin3Deflection, 6);
    res += ",\n\"fin4Deflection\": " + String(state.fin4Deflection, 6);

    res += "\n}";
    return res;
}

#endif