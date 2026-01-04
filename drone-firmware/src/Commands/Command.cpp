#include <Arduino.h>
#include "Command.h"
#include "../DroneOperation.h"
#include "../DroneProperty.h"
#include "./ActiveCommand.h"
#include "./PassiveCommand.h"
#include "./SelectCommand.h"
#include "./SetValueCommand.h"


Command::Command(int time, DroneOperation op)
    : issueTime(time),
    operation(op){};

String Command::toString(){
    return String(issueTime, 0) + " " + this->toPrettyString();
}


Command Command::fromString(String line){
    String lineElems[4];

    int index = 0;
    for(int i=0; i<line.length(); i++){
        if(line.charAt(i) == ' '){
            index += 1;
        }else{
            lineElems[index] += line.charAt(i);
        }
    }

    if(!Command::isNumber(lineElems[0])){
        int now = time(NULL);
        return fromString(String(now, 0) + " " + line);
    }

    int sentTime = lineElems[0].toInt();
    DroneOperation droneOp = stringToDroneOp(lineElems[1]);
    if(droneOp == SET || droneOp == RESET){
        DroneProperty prop = stringToDroneProperty(lineElems[2]);
        double amt = lineElems[3].toDouble();
        return ActiveCommand(sentTime, droneOp, prop, amt);
    }
    if(droneOp == CONTROL_SELECT){
        String slct = lineElems[2];
        return SelectCommand(sentTime, droneOp, slct);
    }
    if(droneOp == CONTROL_SET || droneOp == FLAG_SET){
        String key = lineElems[2];
        double val = lineElems[3].toDouble();
        return SetValueCommand(sentTime, droneOp, key, val);
    }
    return PassiveCommand(sentTime, droneOp);
    
}

String Command::toPrettyString() {};

bool Command::isNumber(String st){
    for(int i=0; i<st.length(); i++){
        if(!isDigit(st.charAt(i))){
            return false;
        }
    }
    return true;
}