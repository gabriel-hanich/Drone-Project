#include <Arduino.h>

#include "PhysicalComponents/DriveMotor.h"
#include "PhysicalComponents/Servo.h"

DriveMotor propellor(1, "Top-most propellor");
Servo servo(A12, "Servo");

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  propellor.setSpeed(10);
  servo.setAngle(20);
}

void loop() {
  Serial.println("Is anyone out there?");
  delay(1000);
  // put your main code here, to run repeatedly:
}

