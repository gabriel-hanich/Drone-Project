#include "SelectCommand.h"

SelectCommand::SelectCommand(int issueTime, DroneOperation op, String selectedValue)
    : Command(issueTime, op),
      selectedValue(selectedValue) {};


String SelectCommand::toPrettyString(){
    return droneOpToString(operation) + " " + selectedValue;

};