#include "Sensor.h"
#include <esp32-hal-gpio.h>
#include <string>



Sensor::Sensor(int pinNumber, String name, String measUnits)
    : Component(pinNumber, name, INPUT),
      units(measUnits), 
      lastLatency(-1) {}

double Sensor::getLatency(){
    return lastLatency;
}