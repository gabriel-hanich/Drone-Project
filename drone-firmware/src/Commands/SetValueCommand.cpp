#include "SetValueCommand.h"

SetValueCommand::SetValueCommand(int issueTime, DroneOperation operation, String key, double value)
    : Command(issueTime, operation),
      key(key),
      value(value) {};


String SetValueCommand::toPrettyString(){
    return droneOpToString(operation) + " " + key + " " + String(value, 8);
};


DroneState SetValueCommand::enactCommand(DroneState currentState){
    if(operation == CONTROL_SET){
        for(int i=0; i<currentState.controlSystemVals.size(); i++){
            if(currentState.controlSystemVals[i].name == key){
                currentState.controlSystemVals[i].value = value;
            }
        };
    }else if(operation == FLAG_SET){
        if(value == 0){
            std::vector<String> newFlags = {};

            for(int i=0; i<currentState.activeFlags.size(); i++){
                if(!currentState.activeFlags[i].equals(key)){
                    newFlags.push_back(currentState.activeFlags[i]);
                }
            }
        }else if(value == 1){
            currentState.activeFlags.push_back(key);
        }
    };

    return currentState;
}