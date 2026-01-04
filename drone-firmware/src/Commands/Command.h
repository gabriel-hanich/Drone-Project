#ifndef COMMAND_H
#define COMMAND_H

#include "DroneOperation.h"

class Command{
    /*
    This is an abstract class to be extended by all of the possible
    commands 
    */

    public:
        /*
        What type of action the drone will take as a result of the 
        command
        */
        DroneOperation operation;

        /*
        The epoch time when the command was issued
        */
        int issueTime;
    
        /*
        Constructor for the command. Operation is a value from the
        DroneOperation enumeration, which describes what type of action
        the drone will undertake. Time is the epoch time at which the 
        command was issued
        */
        Command(int time, DroneOperation operation);


        /*
        Returns a string with the timestamp and then 
        the pretty-printed version of the command, seperated
        by a space
        */
        String toString();

        /*
        An abstract method which should return the string version
        of the command WITHOUT the timestamp
        */
        virtual String toPrettyString();


        /*
        Given a correctly formatted command in string form, returns
        a drone command class with the same data
        */
        static Command fromString(String line);

        

    private:
        /*
        Determines if a string is a number by checking that each
        character within the string is a digit
        */
        static bool isNumber(String st);

};


#endif