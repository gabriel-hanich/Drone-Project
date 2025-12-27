#ifndef PROGRAMCONSTANTS_H
#define PROGRAMCONSTANTS_H

#include <string>

using namespace std;

/*
This struct contains a bunch of constant values that won't be 
changed throughout the code's operation. Note that the SSID
and password of the wifi network is redacted. Replace these with 
the values for your given wifi network
*/
struct ProgramConstants{
    const char* ssid = "";
    const char* password = "";
    const int port = 80;
} ;


#endif