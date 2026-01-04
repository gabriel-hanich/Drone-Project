#ifndef CONTROLSYSTEM_H
#define CONTROLSYSTEM_H

#include "CSConstant.h"
#include "DroneState.h"
#include <vector>
#include "Arduino.h"


class ControlSystem{
    /*
    This is an abstract class that is to be extended by any of the 
    implemented control systems. Refer to the comments in this file
    regarding what each of the functions should do
    */

    public:
        /*
        A unique, human readable string describing what type of control
        system is being implemented
        */
        const String name;

        /*
        A string describing what version of the control system this is
        */
        const String version;

        // The constructor
        ControlSystem(String name, String version, std::vector<CSConstant> initialConstants);


        /*
        Changes the value of one of the controller constants to the provided
        new value
        */
        void modifyControlConstant(String parameterName, double newValue);  


        /*
        Returns all the control constants 
        */
        std::vector<CSConstant> getControlConstants();


        /*
        This function actually runs the control system. It recieves as input
        the existing drone state, and returns the new state, with updated values
        for the different components
        */
        virtual DroneState updateState(DroneState state);


    
    protected:
        /*
        A list containing all the constants that will be used within the
        control system. (i.e the P,I and D values of a PID controller)
        */
        std::vector<CSConstant> constants;

};


#endif