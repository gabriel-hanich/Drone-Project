#ifndef IMUCOMPONENT_H
#define IMUCOMPONENT_H


#include <SPI.h>
#include <Adafruit_BNO08x.h>
#include "Component.h"

class IMUComponent : public Component{
    /*
    A class that controls the BNO0SCJ8X IMU
    Based on Cat's code from the IMU Display
    */
    
    public:
        /*
        - CSPin is the GPIO pin number which is connected to the CS Pin on the IMU
        - SCKPin is the GPIO pin number which is connected to the SCK Pin on the IMU
        - INTPin is the GPIO pin number which is connected to the INT Pin on the IMU
        - MISOPin is the GPIO pin number which is connected to the SO Pin on the IMU
        - MOSIPin is the GPIO pin number which is connected to the SI Pin on the IMU
        - RSTPin is the GPIO pin number which is connected to the RST Pin on the IMU
        */
        IMUComponent(int CSPin, int SCKPin, int INTPin, int MISOPin, int MOSIPin, int RSTPin);


        /*
        Initialises contact with the IMU
        */
        void initialise();

        /*
        Calibrates the readings of the IMU. The passed arguments will be the new values
        for each axis at its current state. I.E passing 0,0,0 will mean that the current
        axis readings will each be 0. (Like pressing tare on a scale)
        */
        void calibrate();

        /*
        Takes a reading from the IMU and stores it within the class object. Values
        from the reading can be gotten through the below functions
        */
        void takeReading(); 

        /*
        Returns the current Angular Velocity in the X Axis (rad/s)
        */
        float getXAngularVel();
        
        /*
        Returns the current Angular Velocity in the Y Axis (rad/s)
        */
        float getYAngularVel();
        
        /*
        Returns the current Angular Velocity in the Z Axis (rad/s)
        */
        float getZAngularVel();
        
        /*
        Returns the current acceleration recorded by the IMU in the X Axis (ms/^2)
        */
        float getXAcc();
        
        /*
        Returns the current acceleration recorded by the IMU in the Y Axis (ms/^2)
        */
        float getYAcc();
        
        /*
        Returns the current acceleration recorded by the IMU in the Z Axis (ms/^2)
        */
        float getZAcc();
        
        /*
        Returns the current Pitch (rad)
        */
        float getPitch();
        
        /*
        Returns the current Roll (rad)
        */
        float getRoll();
        
        /*
        Returns the current Yaw (rad)
        */
        float getYaw();


    protected:
        int CSPin;
        int SCKPin;
        int INTPin;
        int MISOPin;
        int MOSIPin;
        int RSTPin;

        float xAngularVel;
        float yAngularVel;
        float zAngularVel;

        float xAcc;
        float yAcc;
        float zAcc;

        float pitch;
        float roll;
        float yaw;

        Adafruit_BNO08x imu;


        /*
        This function commands the IMU to report whatever type of data
        is provided by `reportType` at a frequency of `interval`. Interval
        is the number of microseconds between reports. The defualt value 
        is 10000 = 10ms
        */
        void setReports(sh2_SensorId_t reportType, long interval=10000);


        /*
        Takes the rotation data from the IMU in quaternion form and converts it
        into pitch, roll and yaw, which are all stored within the class object
        */
        void quaternionToEuler(float qr, float qi, float qj, float qk);


};

#endif