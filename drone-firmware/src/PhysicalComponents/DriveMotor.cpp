#include "DriveMotor.h"
#include <string>
#include <esp32-hal-gpio.h>


DriveMotor::DriveMotor(int pinNumber, String name)
    : Component(pinNumber, name, OUTPUT),
      throttle(0) {}

void DriveMotor::setSpeed(int newThrottle){
    throttle = newThrottle;

    //TODO Implement actually changing the throttle (depends on what protocol we use)
}