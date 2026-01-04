#include "PassiveCommand.h"
#include <Arduino.h>

PassiveCommand::PassiveCommand(int time, DroneOperation op)
    : Command(time, op) {};

String PassiveCommand::toPrettyString(){
    return droneOpToString(operation);
};
