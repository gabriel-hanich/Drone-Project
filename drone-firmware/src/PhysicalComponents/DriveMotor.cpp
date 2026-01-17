#include "DriveMotor.h"
#include <string>
#include <esp32-hal-gpio.h>


DriveMotor::DriveMotor(int pinNumber, String name)
    : Component(pinNumber, name, OUTPUT),
      throttle(0),
      motorController(pinNumber) {

    if(!motorController.begin(DSHOT300)){
        Serial.println("ERROR\nThe controller for " + name + " returned an error when initialising");
    };  
}

void DriveMotor::setSpeed(double newThrottle){
    throttle = newThrottle;
    
    // 2047 is the maximum throttle value, thus as newThrottle
    // is a value from 0 to 1, dividing it by 2047 will ensure
    // a full coverage of the speeds
    motorController.sendThrottleValue(newThrottle / 2047);

}