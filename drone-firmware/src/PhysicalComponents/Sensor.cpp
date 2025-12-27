#include "Sensor.h"
#include <esp32-hal-gpio.h>
#include <string>

using namespace std;


Sensor::Sensor(int pinNumber, string name, string measUnits)
    : Component(pinNumber, name, INPUT),
      units(measUnits), 
      lastLatency(-1) {}

double Sensor::getLatency(){
    return lastLatency;
}