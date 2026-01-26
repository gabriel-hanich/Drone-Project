#include "Fin.h"


Fin::Fin(int pinNumber, int finNumber, String name)
    : Component(pinNumber, name, OUTPUT),
      deflection(0),
      finNumber(finNumber){
        servoMotor.attach(pinNumber);
      };

void Fin::setDeflection(double newDeflection){
    this->deflection = newDeflection;

    // pwmVal is a value between 0 and 255 describing the actual
    // PWM value sent to the servo
    double degVal = ((newDeflection + 1) / 2) * 180;
    servoMotor.write(degVal);
};

double Fin::getDeflection(){
    return this->deflection;
}