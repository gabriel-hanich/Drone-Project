#include "IMUComponent.h"


IMUComponent::IMUComponent(int CSPin, int SCKPin, int INTPin, int MISOPin, int MOSIPin, int RSTPin)
    : Component(CSPin, "BNO IMU", OUTPUT),
      CSPin(CSPin),
      SCKPin(SCKPin),
      INTPin(INTPin),
      MISOPin(MISOPin),
      MOSIPin(MOSIPin),
      RSTPin(RSTPin),
      imu(RSTPin) {};


void IMUComponent::initialise(){
    // Start contacting the IMU
    SPI.begin(SCKPin, MISOPin, MOSIPin);
    digitalWrite(CSPin, HIGH);
    
    if(!imu.begin_SPI(CSPin, INTPin)){
        Serial.println("FAILED TO FIND IMU PIN AT");
        Serial.println("CSPIN=" + String(CSPin));
        Serial.println("SCKPin=" + String(SCKPin));
        Serial.println("INTPin=" + String(INTPin));
        Serial.println("MISOPin=" + String(MISOPin));
        Serial.println("MOSIPin=" + String(MOSIPin));
        Serial.println("RSTPin=" + String(RSTPin));
    };
    
    Serial.println("Succesfully Found IMU!");

    // Describe the types of data to be sent by the IMU
    setReports(SH2_ARVR_STABILIZED_RV); // Enable multiple sensor reports
    setReports(SH2_ACCELEROMETER); // Enable accelerometer readings (m/s^2)
    setReports(SH2_GYROSCOPE_CALIBRATED); // Enable Gyroscope readings (rad/s)

};

void IMUComponent::takeReading(){
    int eventCount = 0;
    sh2_SensorValue_t sensorValue;


    // Read the first 10 sensor values from the IMU
    while(imu.getSensorEvent(&sensorValue) && eventCount < 10){
        eventCount++;
        switch(sensorValue.sensorId){
            case SH2_ACCELEROMETER:
                xAcc = sensorValue.un.accelerometer.x;
                xAcc = sensorValue.un.accelerometer.y;
                xAcc = sensorValue.un.accelerometer.z;
                break;
            case SH2_GYROSCOPE_CALIBRATED:
                xAngularVel = sensorValue.un.gyroscope.x;
                yAngularVel = sensorValue.un.gyroscope.y;
                zAngularVel = sensorValue.un.gyroscope.z;
                break;
            case SH2_ARVR_STABILIZED_RV:
                {
                    sh2_RotationVectorWAcc_t rv = sensorValue.un.arvrStabilizedRV;
                    quaternionToEuler(rv.real, rv.i, rv.j, rv.k);
                    break;
                }
            case SH2_GYRO_INTEGRATED_RV:
                quaternionToEuler(
                sensorValue.un.gyroIntegratedRV.real,
                sensorValue.un.gyroIntegratedRV.i,
                sensorValue.un.gyroIntegratedRV.j,
                sensorValue.un.gyroIntegratedRV.k
                );
                break;
            default:
                break;
        };
    };
};


void IMUComponent::setReports(sh2_SensorId_t reportType, long interval){
    if(imu.enableReport(reportType, interval)){
        Serial.println("FAILED TO ENABLE IMU REPORT FOR " + reportType);
    }
};

void IMUComponent::quaternionToEuler(float qr, float qi, float qj, float qk) {
    float sqr = sq(qr);
    float sqi = sq(qi);
    float sqj = sq(qj);
    float sqk = sq(qk);

    yaw   = atan2(2.0 * (qi * qj + qk * qr), (sqi - sqj - sqk + sqr));
    pitch = asin(-2.0 * (qi * qk - qj * qr) / (sqi + sqi + sqj + sqk));
    roll  = atan2(2.0 * (qj * qk + qi * qr), (-sqi - sqj + sqk + sqr));
}

float IMUComponent::getXAngularVel(){
    return xAngularVel;
}
float IMUComponent::getYAngularVel(){
    return yAngularVel;
}
float IMUComponent::getZAngularVel(){
    return zAngularVel;
}
float IMUComponent::getXAcc(){
    return xAcc;
}
float IMUComponent::getYAcc(){
    return yAcc;
}
float IMUComponent::getZAcc(){
    return zAcc;
}
float IMUComponent::getPitch(){
    return pitch;
}
float IMUComponent::getRoll(){
    return roll;
}
float IMUComponent::getYaw(){
    return yaw;
}
