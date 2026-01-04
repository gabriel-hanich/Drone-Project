#ifndef SENSOR_H
#define SENSOR_H

#include "Component.h"


class Sensor : public Component{
    /*
        This is an abstract class that is extended by all classes
        responsible for reading values from external sensors
    */
    
    public:
        // Units is a human-readable string describing what the units are. It
        // is not used for any internal logic, but improves readability
        String units;

        Sensor(int pinNumber, String name, String measUnits);

        /*
        Returns a new reading from the sensor
        */
        virtual double takeReading();

        /*
        Calibrates the sensor such that the 'calibrateValue' is the new value
        for the current position of the sensor 
        */
        virtual void calibrate(double calibrateValue);

        /*
        Returns the uncertainty within the sensor's reading
        */
        virtual double getError();

        /*
        Returns the amount of time in [UNITS] to provide a reading from the sensor
        */
       double getLatency();


    protected:
        double lastLatency;
        double offset;
};

#endif