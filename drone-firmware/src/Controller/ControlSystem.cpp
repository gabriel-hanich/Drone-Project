#include "ControlSystem.h"
#include "Arduino.h"
#include <vector>

ControlSystem::ControlSystem(String name, std::vector<CSConstant> initialConstants)
    : name(name),
      constants(initialConstants) {};


void ControlSystem::modifyControlConstant(String parameterName, double newValue){
    std::vector<CSConstant> newConstants;

    for(int i=0; i<constants.size(); i++){
        if(constants[i].name == parameterName){
            CSConstant newConst;
            newConst.name = parameterName;
            newConst.value = newValue;
            
            newConstants.push_back(newConst);
        }else{
            newConstants.push_back(constants[i]);
        }
    }
    constants = newConstants;
}

std::vector<CSConstant> ControlSystem::getControlConstants(){
    return constants;
}

