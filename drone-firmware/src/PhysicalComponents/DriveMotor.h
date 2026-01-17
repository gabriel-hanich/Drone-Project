#ifndef DRIVEMOTOR_H
#define DRIVEMOTOR_H

#include "Component.h"
#include <DShotRMT.h>


class DriveMotor: public Component{
    /*
        Uses the DShot_RMT Module to communicate with the ESC
        to control the throttle of the drone's motor
    */

    public:

        /*
        pinNumber is the GPIO pin with digital output capabilities
        that is connected to the ESC
        name is a string describing the motor:
            - "driveMotor1" is the upper motor
            - "driveMotor2" is the lower motor
        */
        DriveMotor(int pinNumber, String name);

        /*
            Sets the new motor throttle
            throttle is a double from 0 (min) to 1 (max) which describes how fast
                the motor should spin 
        */
        void setSpeed(double newThrottle);

    protected:
        int throttle; 
        DShotRMT motorController;
};


#endif