#include "SelectCommand.h"

SelectCommand::SelectCommand(int issueTime, DroneOperation op, String selectedValue)
    : Command(issueTime, op),
      selectedValue(selectedValue) {};


String SelectCommand::toPrettyString(){
    return droneOpToString(operation) + " " + selectedValue;
};


DroneState SelectCommand::enactCommand(DroneState currentState){
    if(operation == CONTROL_SELECT){
        if(!currentState.isEStopped && !currentState.isArmed){
            // Check that the selected command is actually one of the available ones
            if(std::count(currentState.controlSystemList.begin(), currentState.controlSystemList.end(), selectedValue) > 0){
                currentState.currentControlSystem = selectedValue;
            }
        }
    };
    return currentState;
}