#include <string>
#include <bits/stdc++.h>
#include "ControlSystem.h"

using namespace std;

ControlSystem::ControlSystem(string name, string version, vector<CSConstant> initialConstants)
    : name(name),
      version(version),
      constants(initialConstants) {};


void ControlSystem::modifyControlConstant(string parameterName, double newValue){
    vector<CSConstant> newConstants;

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

vector<CSConstant> ControlSystem::getControlConstants(){
    return constants;
}

