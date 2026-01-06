#include "PWMComponent.h"

PWMComponent::PWMComponent(int pinNumber, String name)
    : Component(pinNumber, name, OUTPUT) {};

void PWMComponent::setValue(int newValue){
    this->currentValue = newValue;
    analogWrite(pinNumber, newValue);
}