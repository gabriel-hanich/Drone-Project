#ifndef PWMComponent_H
#define PWMComponent_H

#include "Component.h"

class PWMComponent: public Component{
    /*
    This is a basic class that can be used to control a single
    PWM pin
    */
    
    public:
        PWMComponent(int pinNumber, String name);


        /*
        Writes a value to the output
        */
        void setValue(int outputValue);


    protected:
        /*
        The current value being written to the pin 
        */
        int currentValue = 0;
};

#endif