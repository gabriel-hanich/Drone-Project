// A class for controlling a single ESC

#ifndef ESC_H
#define ESC_H

class ESC{
public:

    // Pin is what pin the PWM wire of the ESC is plugged in to on the ESP32
    // Descriptor is a human-readable string describing the ESC
    ESC(int pin, String descriptor){
        this-> pin = pin;
        this -> descriptor = descriptor;
    }

    // Set the throttle (0=minimum, 1=maximum)
    void setThrottle(float amount){
        analogWrite(this.pin, amount * 255)
    }


private:
    int pin;
    String descriptor;
}


#endif
