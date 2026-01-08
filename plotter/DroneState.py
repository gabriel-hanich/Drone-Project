import random
import time

class DroneState:
    """
    This class is used to store all the incoming drone. It is also able to fetch new
    data from the backend using the `getNewData()` method
    dataURL is a http URL pointing to the backend
    """

    dataURL = ""

    def __init__(self, dataSource):
        self.dataURL = dataSource

    time = 0
    opTime = 0
    epochTime = 0 

    refreshRate = 0
    packetAge = 0

    pitch = 0
    roll = 0
    yaw = 0
    pitchSetPoint = 0
    rollSetPoint = 0
    yawSetPoint = 0

    pitchAcc = 0
    rollAcc = 0
    yawAcc = 0
    pitchAccSetPoint = 0
    rollAccSetPoint = 0
    yawAccSetPoint = 0

    xAcc = 0
    yAcc = 0
    zAcc = 0
    xAccSetPoint = 0
    yAccSetPoint = 0
    zAccSetPoint = 0

    elevation = 0
    elevationSetPoint = 0

    dMotor1Throttle = 0
    dMotor2Throttle = 0

    fin1Deflection = 0
    fin2Deflection = 0
    fin3Deflection = 0
    fin4Deflection = 0

    def getNewData(self):
        """Downloads new data from the provided URL and updates the internal values"""
        #TODO Write it when the backend code is written
        self.randomiseVals()        


    def randomiseVals(self):
        """Testing function that assigns each value to a number between 0 and 1"""
        self.time = self.time + 1
        self.opTime = self.opTime + 1
        self.epochTime = time.time()

        self.refreshRate = random.random()
        self.packetAge = random.random()

        self.pitch = random.random()
        self.roll = random.random()
        self.yaw = random.random()
        self.pitchSetPoint = random.random()
        self.rollSetPoint = random.random()
        self.yawSetPoint = random.random()

        self.pitchAcc = random.random()
        self.rollAcc = random.random()
        self.yawAcc = random.random()
        self.pitchAccSetPoint = random.random()
        self.rollAccSetPoint = random.random()
        self.yawAccSetPoint = random.random()

        self.xAcc = random.random()
        self.yAcc = random.random()
        self.zAcc = random.random()
        self.xAccSetPoint = random.random()
        self.yAccSetPoint = random.random()
        self.zAccSetPoint = random.random()

        self.elevation = random.random()
        self.elevationSetPoint = random.random()

        self.dMotor1Throttle = random.random()
        self.dMotor2Throttle = random.random()

        self.fin1Deflection = random.random()
        self.fin2Deflection = random.random()
        self.fin3Deflection = random.random()
        self.fin4Deflection = random.random()