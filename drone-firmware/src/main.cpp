#include <Arduino.h>

#include "ProgramConstants.h"
#include "Web/WebManager.h"
#include "DroneOperation.h"
#include "Commands/PassiveCommand.h"
#include "PhysicalComponents/PWMComponent.h"
#include <time.h>
#include "esp_log.h"


WebManager server(CONSTANTS.ssid, CONSTANTS.password, CONSTANTS.port);
time_t currentTime;

DroneState currentState;
DroneState lastState = currentState; // The state of the drone on the last loop;
int opTimeStart = 0; // The number of milliseconds between the board being powered 
                     // on and the last time the drone was armed


PWMComponent greenChannel = PWMComponent(25, "Green Channel of RGB LED");
PWMComponent blueChannel = PWMComponent(32, "Blue Channel of RGB LED");

int startVal = 0;

void setup() {
  Serial.begin(9600);
  esp_log_level_set("wifi", ESP_LOG_NONE);
  server.initialise();
  server.syncTime();

  Serial.println("Done!");

}


void loop() {
  time(&currentTime);
  currentState.epochTime = currentTime;

  server.updateDroneState(currentState);
  server.tick();

  if(currentState.isEStopped){
    Serial.println("ESTOPPED");
    blueChannel.setValue(255);
    greenChannel.setValue(0);
  }else{
    if(currentState.isArmed){
      Serial.println("ARMED");
      blueChannel.setValue(0);
      greenChannel.setValue(255);
    }else{
      Serial.println("DISARMED");
      blueChannel.setValue(255);
      greenChannel.setValue(255);
    }
  }

  if(server.newCommand){
    Command* newCommand = server.getLastCommand();
    currentState = newCommand->enactCommand(currentState);

  }
  delay(10);

}

