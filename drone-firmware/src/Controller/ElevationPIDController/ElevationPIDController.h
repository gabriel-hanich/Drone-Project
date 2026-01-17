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
        // Error on the last step
        double e1 = 0;

        // Error 2 steps ago
        double e2 = 0;

};

#endif