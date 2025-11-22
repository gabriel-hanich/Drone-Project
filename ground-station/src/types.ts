export interface DroneConnection{
    backendURL: String;
    droneURL: String;
    backendConnected:boolean; // Whether or not the website can connect to the ground station
    droneConnected:boolean; // Whether or not the ground station can connect to the drone
    pollingRate:Number;
    
    droneFirmwareVersion: String;
    backendFirmwareVersion: String;
    frontendFirmwareVersion: String;

    pastCommands: String[]

    droneInfo:DroneData;
}

export interface DroneData{
    isArmed: boolean;
    isEStopped: boolean;
    lastInstruction: String;

    controlSystemList: String[];
    currentControlSystem: String;
    controlSystemVals: any;

    // ms
    refreshRate: number;
    packetAge:number;
        
    // degree/radian?
    pitch: number;
    roll: number;
    yaw: number;

    pitchSetPoint: number;
    rollSetPoint: number;
    yawSetPoint: number;

    // All in ms^-1
    xVel: number;
    yVel: number;
    zVel: number;

    xVelSetPoint:number;
    yVelSetPoint:number;
    zVelSetPoint:number;

    // m
    elevation: number;

    elevationSetPoint: number;

    //
    throttle: number;
    
    //
    xFinDeflection: number;
    yFinDefilection: number; 
}

export enum DroneOperation{
    ARM = "ARM",
    DISARM = "DISARM",
    EMERGENCY_STOP = "EMERGENCY_STOP",
    HOVER = "HOVER",
    RESET = "RESET",
    SET = "SET",
    START_RECORD = "START_RECORD",
    END_RECORD = "END_RECORD",
    CONTROL_SELECT = "CONTROL_SELECT",
    CONTROL_SET = "CONTROL_SET" 
}

export enum DroneProperty{
    ROLL = "ROLL",
    ROLL_SETPOINT = "ROLL_SETPOINT",
    PITCH = "PITCH",
    PITCH_SETPOINT = "PITCH_SETPOINT",
    YAW = "YAW",
    YAW_SETPOINT = "YAW_SETPOINT",
    XVEL = "XVEL",
    XVEL_SETPOINT = "XVEL_SETPOINT",
    YVEL = "YVEL",
    YVEL_SETPOINT = "YVEL_SETPOINT",
    ZVEL = "ZVEL",
    ZVEL_SETPOINT = "ZVEL_SETPOINT",
    ELEVATION = "ELEVATION",
    ELEVATION_SETPOINT = "ELEVATION_SETPOINT"
}


export abstract class DroneCommand{
    operation:DroneOperation;
    
    constructor(operation:DroneOperation) {
        this.operation = operation;
    }

    abstract toString(): String;

    static fromString(line:String):DroneCommand{
        let lineElems: String[] = line.split(" ");
        let chosenDroneOp = lineElems[0] as DroneOperation;

        if(chosenDroneOp == DroneOperation.SET || chosenDroneOp == DroneOperation.RESET){
            let chosenDroneProperty = lineElems[1] as DroneProperty;
            let amount = parseFloat(lineElems[2].toString());
            return new ActiveCommand(chosenDroneOp, chosenDroneProperty, amount);
        }
        return new PassiveCommand(chosenDroneOp);
    }
}

export class PassiveCommand extends DroneCommand{
    toString(): String {
        return this.operation.toString();
    }

}

export class ActiveCommand extends DroneCommand{
    property: DroneProperty;
    amount: number;

    constructor(operation:DroneOperation, property: DroneProperty, amount:number){
        super(operation);
        this.property = property;
        this.amount = amount;
    }
    
    
    toString(): String {
        return this.operation.toString() + " " + this.property.toString() + " " + this.amount.toString();
    }
}

function generateRandomDroneCommand(): DroneCommand{
    let droneOps: String[] = ["ARM","DISARM","EMERGENCY_STOP","HOVER","RESET","SET","START_RECORD","END_RECORD"];
    let chosenDroneOp: String = droneOps[Math.floor(Math.random() * droneOps.length)];
    if(chosenDroneOp == "SET" || chosenDroneOp == "RESET"){
        let chosenAmount = Math.random() * 10;
        let parameters: String[] = ["ROLL","ROLL_SETPOINT","PITCH_SETPOINT", "YAW_SETPOINT","XVEL_SETPOINT","YVEL_SETPOINT","ZVEL_SETPOINT", "ELEVATION_SETPOINT"];
        let chosenParameter = parameters[Math.floor(Math.random() * parameters.length)];
        return DroneCommand.fromString(chosenDroneOp + " " + chosenParameter + " " + chosenAmount.toString());
    }
    return DroneCommand.fromString(chosenDroneOp);
}

export function generateRandomDroneData(lastCommand: String):DroneData{
    return {
        isArmed: false,
        isEStopped: false,
        lastInstruction: lastCommand,

        refreshRate: Math.random(),
        packetAge: Math.random(),

        controlSystemList: ["option1", "option2", "option3"],
        currentControlSystem: "option1",
        controlSystemVals: {"a":1, "b":2, "c": 3, "d": 4},
        
        pitch: Math.random() * 90 - 45,
        roll: Math.random() * 90 - 45,
        yaw: Math.random() * 90 - 45,

        pitchSetPoint: Math.random() * 90 - 45,
        rollSetPoint: Math.random() * 90 - 45,
        yawSetPoint: Math.random() * 90 - 45,

        xVel: (Math.random() - 0.5) * 5,
        yVel: (Math.random() - 0.5) * 5,
        zVel: (Math.random() - 0.5) * 5,

        xVelSetPoint: (Math.random() - 0.5) * 5,
        yVelSetPoint: (Math.random() - 0.5) * 5,
        zVelSetPoint: (Math.random() - 0.5) * 5,

        elevation: Math.random() * 10,
        elevationSetPoint: Math.random() * 10,

        throttle: Math.random(),
        
        xFinDeflection: Math.random(),
        yFinDefilection: Math.random(),
    }
}

export function generateRandomDroneConnection(lastCommand: String):DroneConnection{
    return {
        backendURL: "localhost:4200",
        droneURL: "localhost:3000",
        backendConnected: true,
        droneConnected: true,
        pollingRate: 100,
        
        pastCommands: [],
        droneFirmwareVersion: "0.1.0",
        backendFirmwareVersion: "0.1.0",
        frontendFirmwareVersion: "0.1.0",
        droneInfo:generateRandomDroneData(lastCommand)
    }
}

export var initialConnection:DroneConnection = {
        backendURL: "",
        droneURL: "",
        backendConnected: false,
        droneConnected: false,
        pollingRate: -1,
        pastCommands: [],
        
        droneFirmwareVersion: "",
        backendFirmwareVersion: "",
        frontendFirmwareVersion: "0.1.0",
        droneInfo:generateRandomDroneData("")
}