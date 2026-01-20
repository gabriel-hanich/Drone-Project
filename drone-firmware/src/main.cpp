#include <Arduino.h>
#include <DShotRMT.h>


#include "ProgramConstants.h"
#include "Web/WebManager.h"
#include "DroneOperation.h"
#include "Commands/PassiveCommand.h"
#include "PhysicalComponents/PWMComponent.h"
#include <time.h>
#include "esp_log.h"


String version = "0.0.1";

WebManager server(CONSTANTS.ssid, CONSTANTS.password, CONSTANTS.port);
time_t currentTime;

DroneState currentState;


PWMComponent greenChannel = PWMComponent(25, "Green Channel of RGB LED");
PWMComponent blueChannel = PWMComponent(32, "Blue Channel of RGB LED");


void setup() {
  Serial.begin(9600);
  currentState.droneFirmwareVersion = version;
  esp_log_level_set("wifi", ESP_LOG_NONE);
  server.initialise();
  server.syncTime();

  Serial.println("Done!");

}


void loop() {
  time(&currentTime);
  currentState.epochTime = currentTime;
  currentState.packetTime = currentTime;
  server.updateDroneState(currentState);
  server.tick();

  if(currentState.isEStopped){
    blueChannel.setValue(255);
    greenChannel.setValue(0);
  }else{
    if(currentState.isArmed){
      blueChannel.setValue(0);
      greenChannel.setValue(255);
    }else{
      blueChannel.setValue(255);
      greenChannel.setValue(255);
    }
  }

  if(server.newCommand){
    Command* newCommand = server.getLastCommand();
    Serial.println(newCommand->toString());
    currentState = newCommand->enactCommand(currentState);
  }

  
  delay(10);

}

