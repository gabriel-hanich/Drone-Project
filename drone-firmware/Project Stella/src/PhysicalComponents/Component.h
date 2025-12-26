#ifndef COMPONENT_H
#define COMPONENT_H

#include <string>

using namespace std;

class Component{
    /*
        An abstract class to be extended by every class which directly
        represents any physical component on the drone (motor, servo, 
        sensor, etc). 
    */

    public:
        /*
            pinNumber is the pin which directly controls the physical component 
            name is a brief description of the component 
            pinType Is an integer describing whether the pin is an input or output
                    Can just pass INPUT or OUTPUT for this one
        */
        Component(int pinNumber, string name, int pinType);

    protected:
        int pinNumber; // The pin which controls the physical component 
        string name; // A short description of what the component is and what it does 
};


#endif