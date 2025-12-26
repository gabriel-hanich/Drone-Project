#ifndef DRONEDATA_H
#define DRONEDATA_H

#include <string>
#include <bits/stdc++.h>

#include "CSConstant.h"

using namespace std;


/*
This is a struct which describes all of the parameters relating
to the current state of the drone 
*/
struct DroneData{
    int opTime;
    
    bool isArmed; 
    bool isEStopped;
    string lastInstruction;

    vector<string> controlSystemList;
    string currentControlSystem;
    vector<CSConstant> controlSystemVals;

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

    double fin1Deflection;
    double fin2Deflection;
    double fin3Deflection;
    double fin4Deflection;
};

#endif