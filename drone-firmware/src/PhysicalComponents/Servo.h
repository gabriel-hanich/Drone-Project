#ifndef SERVO_H
#define SERVO_H

#include "Component.h"


//TODO determine the min and max values that can be passed to a servo

class Servo: public Component{
    /*
    Class for controlling the servos which steer the thrust
    vanes on the drone
    */
    
    public:
        Servo(int pinNumber, String name);
        
        /*
        Takes a number between [MIN] and [MAX] and commands the 
        servo to move to this position
        */
        void setAngle(int newAngle);

        /*
        Returns a number between [MIN] and [MAX] representing the
        current setpoint for this servo
        */
        int getAngle();

    protected:
        // A number between [MIN] and [MAX] describing the current 
        // setpoint of the servo
        int angle;
};

#endif