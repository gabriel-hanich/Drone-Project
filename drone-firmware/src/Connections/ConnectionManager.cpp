#include "ConnectionManager.h"

ConnectionManager::ConnectionManager() {};

void ConnectionManager::updateDroneState(DroneState newState){
    this->currentDroneState = newState;
};

Command* ConnectionManager::getLastCommand(){
    this->isNewCommand = false;
    return this->lastRecievedCommand;
};

bool ConnectionManager::hasNewCommand(){
    return this->isNewCommand;
}

int ConnectionManager::getLastContactTime(){
    return this->lastContactTime;
}