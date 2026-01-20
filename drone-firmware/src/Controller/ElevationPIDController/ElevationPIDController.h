#ifndef ElevationPIDController_H
#define ElevationPIDController_H

#include "../ControlSystem.h"

class ElevationPIDController: public ControlSystem{
    /*
    This is a basic PIDController class that serves
    as an example for how to implement the ControlSystem
    class to implement a control system. It uses a PID
    controller to modify the driveMotorThrottle to reach
    the desired elevationSetPoint
    */
    
    public:
        ElevationPIDController(String name);

        DroneState updateState(DroneState state);

    private:
        std::vector<double> pastErrors = {};

};

#endif