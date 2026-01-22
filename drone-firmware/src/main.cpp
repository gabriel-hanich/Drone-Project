#include <Arduino.h>
#include <DShotRMT.h>
#include <time.h>
#include "esp_log.h"


#include "ProgramConstants.h"
#include "Web/WebManager.h"
#include "DroneOperation.h"
#include "Commands/PassiveCommand.h"
#include "PhysicalComponents/PWMComponent.h"
#include "PhysicalComponents/IMUComponent.h"


String version = "0.0.1";

WebManager server(CONSTANTS.ssid, CONSTANTS.password, CONSTANTS.port);
time_t currentTime;

DroneState currentState;

// IMUComponent imu(4,18,15,19,0,2);


void setup() {
  Serial.begin(9600);
  currentState.droneFirmwareVersion = version;
  esp_log_level_set("wifi", ESP_LOG_NONE);
  server.initialise();
  server.syncTime();

  // imu.initialise();

  Serial.println("Done!");

}


void loop() {
  time(&currentTime);
  currentState.epochTime = currentTime;
  currentState.packetTime = currentTime;
  // imu.takeReading();


  // currentState.pitch = imu.getPitch();
  // currentState.roll = imu.getRoll();
  // currentState.yaw = imu.getYaw();

  // currentState.xAcc = imu.getXAcc();
  // currentState.yAcc = imu.getYAcc();
  // currentState.zAcc = imu.getZAcc();

  server.updateDroneState(currentState);
  server.tick();

  

  if(server.newCommand){
    Command* newCommand = server.getLastCommand();
    Serial.println(newCommand->toString());
    currentState = newCommand->enactCommand(currentState);
  }


}

