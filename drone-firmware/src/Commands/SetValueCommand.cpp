#include "SetValueCommand.h"

SetValueCommand::SetValueCommand(int issueTime, DroneOperation operation, String key, double value)
    : Command(issueTime, operation),
      key(key),
      value(value) {};


String SetValueCommand::toPrettyString(){
    return droneOpToString(operation) + " " + key + " " + String(value, 8);
};


DroneState SetValueCommand::enactCommand(DroneState currentState){
    if(operation == FLAG_SET && !currentState.isArmed && !currentState.isEStopped){
        if(value == 0){
            std::vector<String> newFlags = {};

            for(int i=0; i<currentState.activeFlags.size(); i++){
                if(currentState.activeFlags[i] != key){
                    newFlags.push_back(currentState.activeFlags[i]);
                }
            }
            currentState.activeFlags = newFlags;
        }else if(value == 1){
            currentState.activeFlags.push_back(key);
        }
    };
    
    return currentState;
}