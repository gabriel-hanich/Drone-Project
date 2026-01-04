#ifndef DRIVEMOTOR_H
#define DRIVEMOTOR_H

#include "Component.h"


class DriveMotor: public Component{
    /*
        Manages a single Brushless DC motor responsible for spinning the propellor
    */

    public:

        DriveMotor(int pinNumber, String name);

        /*
            Sets the new motor throttle
            throttle is an integer from 0 (min) to 255 (max) which describes how fast
                the motor should spin 
        */
        void setSpeed(int newThrottle);

    protected:
        int throttle; 
        
};


#endif