#include "Servo.h"
#include <string>
#include <esp32-hal-gpio.h>


Servo::Servo(int pinNumber, String name)
    : Component(pinNumber, name, OUTPUT),
      angle(0) 
    {};

void Servo::setAngle(int newAngle){
    angle = newAngle;

    //TODO Actually move the servo to the new angle
};

int Servo::getAngle(){
    return angle;
}