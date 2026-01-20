#include "ElevationPIDController.h"


std::vector<CSConstant> initialValues = {
    {"P", 1},
    {"I", 0},
    {"D", 0},
    {"stepCount", 100}
};

ElevationPIDController::ElevationPIDController(String name)
    : ControlSystem(name, initialValues) {}; 

DroneState ElevationPIDController::updateState(DroneState currentState){
    // Raw Error
    const double e = currentState.elevationSetPoint - currentState.elevation;
    this->pastErrors.push_back(e);
    
    // Trim pastErrors to only include the last [STEPCOUNT] steps
    if(this->pastErrors.size() > cst("stepCount")){
        this->pastErrors.erase(pastErrors.begin(), pastErrors.begin() + (pastErrors.size() - cst("stepCount")));
    }

    double sumEs = 0;
    for(int i=0; i<pastErrors.size(); i++){
        sumEs = sumEs + pastErrors[i];
    }

    const double setPoint = cst("P") * e + cst("I") * sumEs + cst("D") * (e - pastErrors[pastErrors.size() - 1]);

    currentState.dMotor1Throttle = setPoint;
    currentState.dMotor2Throttle = setPoint;

    return currentState;
};