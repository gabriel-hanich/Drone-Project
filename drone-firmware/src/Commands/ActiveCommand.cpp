#include "ActiveCommand.h"

#include <Arduino.h>
#include <bits/stdc++.h>

ActiveCommand::ActiveCommand(int time, DroneOperation operation, DroneProperty property, double value)
    : Command(time, operation),
      property(property),
      value(value) {};



String ActiveCommand::toPrettyString(){
  return droneOpToString(operation) + " " + dronePropertyToString(property) + " " + String(value, 8);
};

DroneState ActiveCommand::enactCommand(DroneState currentState){
  Serial.println("ENACTING COMMAND");
  if(operation == SET){
    switch(property){
      case PITCH_SETPOINT:
        currentState.pitchSetPoint = value;
        break;
      case ROLL_SETPOINT:
        currentState.rollSetPoint = value;
        break;
      case YAW_SETPOINT:
        currentState.yawSetPoint = value;
        break;
      case PITCH_ACC_SETPOINT:
        currentState.pitchAccSetPoint = value;
        break;
      case ROLL_ACC_SETPOINT:
        currentState.rollAccSetPoint = value;
        break;
      case YAW_ACC_SETPOINT:
        currentState.yawAccSetPoint = value;
        break;
      case X_ACC_SETPOINT:
        currentState.xAccSetPoint = value;
        break;
      case Y_ACC_SETPOINT:
        currentState.yAccSetPoint = value;
        break;
      case Z_ACC_SETPOINT:
        currentState.zAccSetPoint = value;
        break;
      case ELEVATION_SETPOINT:
        currentState.elevationSetPoint = value;
        break;
    };

    // If the HARDWARE_TESTING flag is active
    if(std::count(currentState.activeFlags.begin(), currentState.activeFlags.end(), "HARDWARE_TESTING") > 0){
      switch(property){
        case D_MOTOR1_THROTTLE:
          if(value <= 0.1){
            currentState.dMotor1Throttle = value;
          }
          break;
        case D_MOTOR2_THROTTLE:
          if(value <= 0.1){
            currentState.dMotor2Throttle = value;
          } 
          break;
        case FIN1_DEFLECTION:
          currentState.fin1Deflection = value;
          break;
        case FIN2_DEFLECTION:
          currentState.fin2Deflection = value;
          break;
        case FIN3_DEFLECTION:
          currentState.fin3Deflection = value;
          break;
        case FIN4_DEFLECTION:
          currentState.fin4Deflection = value;
          break;
      }
    };
  }else if(operation == RESET){
    // TODO: Implement
  };

  return currentState;
};


