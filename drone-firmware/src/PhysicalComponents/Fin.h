#ifndef FIN_H
#define FIN_H

#include "Component.h"
#include <ESP32Servo.h>


class Fin: public Component{
    /*
    Class that handles controlling one of the four fins
    located on the bottom of the drone. 
    */
    
    public:
        Fin(int pinNumber, int finNumber, String name);
        
        /*
        Takes a number between -1 and 1 and commands fin 
        servo to move to this position. Where 0 is no deflection, 
        -1 is the max deflection which causes clockwise yaw, and
        +1 is the max deflection which causes counter-clockwise 
        yaw
        */
        void setDeflection(double newAngle);

        /*
        Returns a number between -1 and 1 representing the
        current setpoint for this fin
        */
        double getDeflection();

    protected:
        /*
        The current deflection, between -1 and 1
        */
        double deflection;

        /*
        A number between 1 and 4 describing which fin
        is registered to this class
        */
        int finNumber;

        /*
        The servo object that actually controls the motor
        */
        Servo servoMotor;
};

#endif