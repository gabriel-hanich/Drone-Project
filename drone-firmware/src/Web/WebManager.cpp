#include "WebManager.h"
#include <WiFi.h>
#include <time.h>

WebManager::WebManager(char* ssid, char*password, int port)
    : ssid(ssid),
      password(password),
      port(port),
      webServer(port){};



// Web code based on code from
// https://randomnerdtutorials.com/esp32-web-server-arduino-ide/
void WebManager::initialise(){
    WiFi.mode(WIFI_STA);
    WiFi.disconnect(true, true);  // clear old state
    delay(100);

    Serial.print("Beginning connection to ");
    Serial.println(ssid);
    WiFi.begin(ssid, password);

    long start = millis();
    while(WiFi.status() != WL_CONNECTED && millis() - start < 15000){
        delay(250);
        Serial.print(".");
    }


    if(WiFi.status() == WL_CONNECTED){
        Serial.println("");
        Serial.print("Connected to WiFi Network using port ");
        Serial.println(port);
        Serial.print("IP Address: ");
        Serial.println(WiFi.localIP());
        webServer.begin();
        return;
    };


    Serial.println("\nWas unable to succesfully connect to WiFi");
    WiFi.disconnect();

    // Scan to print all available WiFi Networks
    Serial.println("Beginning scan for available WiFi Networks");
    int n = WiFi.scanNetworks();
    if(n == 0){
        Serial.println("Unable to find any WiFi Networks");
    }else{
        Serial.print(n);
        Serial.println(" Networks Detected");
        for(int i=0; i<n; i++){
            Serial.println(WiFi.SSID(i).c_str());
        }
    }

};


void WebManager::syncTime(){
    configTime(0, 0, "pool.ntp.org", "time.nist.gov");
    time_t now = 0;
    Serial.print("Synchronising Time");
    while (now < 1000000){
        delay(500);
        Serial.print(".");
        time(&now); // Writes the current time to the memory address which stores the variable 'now'
    }
    Serial.println("\nTime has been synchronised!");
}

void WebManager::tick(){
    if(WiFi.status() != WL_CONNECTED){
        Serial.println("NOT PROPERLY CONNECTED");
        return;
    }

    WiFiClient client = webServer.available();

    unsigned long upTime = millis(); // Number of seconds since the board was powered on
    unsigned long previousTime = 0;
    const long timeOut = 10000; // Number of milliseconds the drone will go before forcing a connection to be closed


    if(client){
        Serial.println("Client Connected!");

        upTime = millis();
        previousTime = upTime;

        String request = "";

        // While client is connected and less time then timeOut has elapsed since they first connected
        while(client.connected() && (upTime - previousTime <= timeOut)){
            if(client.available()){
                char c = client.read();
                request += c;

                // The substring '\r\n\r\n' indicates the end of the HTTP headers
                if(request.endsWith("\r\n\r\n")){
                    break;
                }
            }
        }

        if(request.startsWith("GET")){
            sendDroneState(client);
        }
        else{
            sendErrorHTTP(client);
        }

        delay(5);
        client.stop();
        Serial.println("Client disconnected");
    }
};

void WebManager::updateDroneState(DroneState newState){
    currentDroneState = newState;
}


void WebManager::sendDroneState(WiFiClient client){
    Serial.println("Handling GET Request");
    String jsonData = "{'success':true, 'testData':true, 'clientAge':-1}";
   
    client.println("HTTP/1.1 200 OK");
    client.println("Content-Type: application/json");
    client.println("Connection: close");
    client.print("Content-Length: ");
    client.println(jsonData.length());
    client.println();
    client.print(jsonData);
}

void WebManager::sendErrorHTTP(WiFiClient client){
    client.println("HTTP/1.1 405 Method Not Allowed");
    client.println("Connection: close");
    client.println();
}