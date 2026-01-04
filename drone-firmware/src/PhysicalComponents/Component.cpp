#include "Component.h"
#include <esp32-hal-gpio.h>

#include <Arduino.h>;

/*
pinNumber is the pin which directly controls the physical component 
name is a brief description of the component 
pinType Is an integer describing whether the pin is an input or output
        Can just pass INPUT or OUTPUT for this one
*/
Component::Component(int pinNumber, String name, int pinType)
    : pinNumber(pinNumber),
      name(name)
{

    // This initialises the pin as either an input or output
    pinMode(this->pinNumber, pinType);
}