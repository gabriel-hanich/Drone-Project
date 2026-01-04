#include "ActiveCommand.h"

#include <Arduino.h>

ActiveCommand::ActiveCommand(int time, DroneOperation operation, DroneProperty property, double value)
    : Command(time, operation),
      property(property),
      value(value) {};



String ActiveCommand::toPrettyString(){
  return droneOpToString(operation) + " " + dronePropertyToString(property) + " " + String(value, 8);
};