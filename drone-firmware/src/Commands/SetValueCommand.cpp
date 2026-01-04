#include "SetValueCommand.h"

SetValueCommand::SetValueCommand(int issueTime, DroneOperation operation, String key, double value)
    : Command(issueTime, operation),
      key(key),
      value(value) {};


String SetValueCommand::toPrettyString(){
    return droneOpToString(operation) + " " + key + " " + String(value, 8);
};