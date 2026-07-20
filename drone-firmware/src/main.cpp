#include <Arduino.h>
#include <DShotRMT.h>
#include <time.h>
#include "esp_log.h"


#include "ProgramConstants.h"
#include "DroneOperation.h"
#include "Connections/Web/WebManager.h"
#include "Commands/PassiveCommand.h"
#include "Commands/SetValueCommand.h"
#include "PhysicalComponents/Fin.h"
#include "Controller/ControlSystem.h"
#include "Controller/ElevationPIDController/ElevationPIDController.h"

String version = "0.0.1";

const int maxPing = 500; // The maximum wait between the ESP32 pausing to manages the connection
time_t lastPing = -1; // The last time that the ESP32 manages the connection

const int disarmPanic = 5000; // The number of milliseconds the drone can go without communicating with the server
                              // before it will automatically disarm

ProgramConstants CONSTANTS;
WebManager server(CONSTANTS.ssid, CONSTANTS.password, CONSTANTS.port);
time_t currentTime;
time_t lastTime;

DroneState currentState;
ControlSystem* currentController;
std::vector<ControlSystem*> controlSystemsLst;

Fin fin1(4, 1, "Fin 1");


void setup() {
  Serial.begin(9600);

  currentController = new ElevationPIDController("CONTROLLER_1");
  controlSystemsLst = {currentController, new ElevationPIDController("CONTROLLER_2")};

  currentState.droneFirmwareVersion = version;
  currentState.currentControlSystem = (*currentController).name;
  currentState.controlSystemVals = (*currentController).getControlConstants();
  for(int i=0; i<controlSystemsLst.size(); i++){
    currentState.controlSystemList.push_back((*controlSystemsLst[i]).name);
  }


  esp_log_level_set("wifi", ESP_LOG_NONE);
  server.initialise();
  server.syncTime();


  Serial.println("Done!");

}


void loop() {
  // Updates time stuff
  time(&currentTime);
  currentState.epochTime = currentTime;
  currentState.packetTime = currentTime;
  if(lastTime - currentTime != 0){
    currentState.refreshRate = 1000 / (lastTime - currentTime);
  }

  // Disarms and/or E-stops the drone if it has not communicated
  // with the server in a while
  if(currentState.isArmed){
    unsigned long upTime = millis();
    if(upTime - server.getLastContactTime() >= disarmPanic){
      if(contains(currentState.activeFlags, "DISABLE_PANIC") <= 0){
        currentState.isArmed = false;
        Serial.println("PANIC DISARMING");
      }
    }
  
  }


  // Handle Incoming command
  if(server.hasNewCommand()){
    Command* newCommand = server.getLastCommand();
    Serial.println(newCommand->toPrettyString());
    if(newCommand->operation == RESET){
      // TODO: Figure out calibrating things
    }else if (newCommand->operation == CONTROL_SET){
      SetValueCommand* command = static_cast<SetValueCommand*>(newCommand);
      if((*currentController).name == currentState.currentControlSystem){
        currentController->modifyControlConstant(command->key, command->value);
        currentState.controlSystemVals = currentController->getControlConstants();
      }
    }
    else{
      // Commands which only modify droneState (which is most of them) can be enacted
      // by the command itself
      currentState = newCommand->enactCommand(currentState);
    }
  }

  // Modify the selected control system ONLY if it has changed
  if((*currentController).name != currentState.currentControlSystem){
    for(int i=0; i<controlSystemsLst.size(); i++){
      if((*controlSystemsLst[i]).name == currentState.currentControlSystem){
        currentController = controlSystemsLst[i];
        currentState.controlSystemVals = currentController->getControlConstants();
      }
    }
  }

  // TODO: Update current state to have IMU readings

  if(currentState.isArmed){
    if(!contains(currentState.activeFlags, "HARDWARE_TESTING")){
      currentState = currentController->updateState(currentState);
    }
  }

  // Asign driveMotorThrottles based on whether the drone is armed or not
  if(currentState.isEStopped){
    currentState.dMotor1Throttle = 0;
    currentState.dMotor2Throttle = 0;

  }
  if(!currentState.isArmed){
    // Ramp down the drone motor throttle linearly if the drone is disarmed
    // but still has a motor setpoint. Takes 2.5s to go linearly from 100%
    // to 0%
    while(currentState.dMotor1Throttle >= 0.1 || currentState.dMotor2Throttle >= 0.1){
      currentState.dMotor1Throttle -= 0.1;
      currentState.dMotor2Throttle -= 0.1;
      
      if(currentState.dMotor1Throttle <= 0.1){
        currentState.dMotor1Throttle = 0;
      }
      if(currentState.dMotor2Throttle <= 0.1){
        currentState.dMotor1Throttle = 0;
      }
      delay(250);
    }
    currentState.dMotor1Throttle = 0;
    currentState.dMotor2Throttle = 0;
  }


  if(!contains(currentState.activeFlags, "DISABLE_MOVEMENT")){
    // dMotor1.setThrottle(currentState.dMotor1Throttle);
    // dMotor2.setThrottle(currentState.dMotor2Throttle);
    
    if(fin1.getDeflection() != currentState.fin1Deflection){
      fin1.setDeflection(currentState.fin1Deflection);
    } 
    // fin2.setDeflection(currentState.fin2Deflection)
    // fin3.setDeflection(currentState.fin3Deflection)
    // fin4.setDeflection(currentState.fin4Deflection)
  }




  // Handle requests for data/commands
  if(millis() - lastPing >= maxPing){
    server.updateDroneState(currentState);
    server.tick();
    lastPing = millis();
  }

  lastTime = currentTime;
  delay(10);


}

