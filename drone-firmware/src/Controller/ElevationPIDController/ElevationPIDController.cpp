#include "ElevationPIDController.h"


std::vector<CSConstant> initialValues = {
    {"P", 1},
    {"I", 0},
    {"D", 0}
};

ElevationPIDController::ElevationPIDController(String name)
    : ControlSystem(name, initialValues) {}; 

DroneState ElevationPIDController::updateState(DroneState currentState){
    // Raw Error
    const double e = currentState.elevationSetPoint - currentState.elevation;


    this->e2 = this->e1;
    this->e1 = e;

};