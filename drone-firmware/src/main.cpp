#include <Arduino.h>

#include "ProgramConstants.h"
#include "Web/WebManager.h"
#include <time.h>
#include "esp_log.h"


WebManager server(CONSTANTS.ssid, CONSTANTS.password, CONSTANTS.port);
time_t currentTime;

DroneState currentState;
DroneState lastState = currentState; // The state of the drone on the last loop;
int opTimeStart = 0; // The number of milliseconds between the board being powered 
                     // on and the last time the drone was armed


void setup() {
  Serial.begin(9600);
  esp_log_level_set("wifi", ESP_LOG_NONE);
  server.initialise();
  // server.syncTime();


  delay(1000);
}


void loop() {
  time(&currentTime);
  currentState.epochTime = currentTime;

  server.updateDroneState(currentState);
  server.tick();
  delay(50);
}

