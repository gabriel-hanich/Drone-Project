
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
    EMERGENCY_RESTART = "EMERGENCY_RESTART",
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
    time: number;

    constructor(operation:DroneOperation, time:number) {
        this.operation = operation;
        this.time = time;
    }

    // Returns the string form of the command WITH the timestamp
    toString(): String{
        return this.time.toString() + " " + this.toPrettyString(); 
    }

    // Returns the string form of the command WITHOUT the timestamp
    abstract toPrettyString(): String;

    static fromString(line:String):DroneCommand{
        let lineElems: String[] = line.split(" ");

        if(Number.isNaN(parseFloat(lineElems[0].toString()))){
            return this.fromString(Date.now().toString() + " " + line);
        }
        let time:number = parseFloat(lineElems[0].toString());

        let chosenDroneOp = lineElems[1] as DroneOperation;
    
        if(chosenDroneOp == DroneOperation.SET || chosenDroneOp == DroneOperation.RESET){
            let chosenDroneProperty = lineElems[2] as DroneProperty;
            let amount = parseFloat(lineElems[3].toString());
            return new ActiveCommand(time, chosenDroneOp, chosenDroneProperty, amount);
        }

        if(chosenDroneOp == DroneOperation.CONTROL_SELECT){
            let chosenControlSystem = lineElems[2];
            return new ControlSelectCommand(time, chosenControlSystem);
        }

        if(chosenDroneOp == DroneOperation.CONTROL_SET){
            let chosenControlVariable = lineElems[2];
            let chosenControlValue = parseFloat(lineElems[3].toString());
            return new ControlSetCommand(time, chosenControlVariable, chosenControlValue);
        }

        
        return new PassiveCommand(chosenDroneOp, time);
    }
}

export class PassiveCommand extends DroneCommand{
    
    toPrettyString(): String {
        return this.operation.toString();
    }

}

export class ActiveCommand extends DroneCommand{
    property: DroneProperty;
    amount: number;

    constructor(time:number, operation:DroneOperation, property: DroneProperty, amount:number){
        super(operation, time);
        this.property = property;
        this.amount = amount;
    }
    
    
    toPrettyString(): String {
        return this.operation.toString() + " " + this.property.toString() + " " + this.amount.toString();
    }
}


// Sets the value associated with a control system
export class ControlSetCommand extends DroneCommand{
    controlVariable:String;
    amount:number;

    constructor(time:number, controlVariable:String, amount:number){
        super(DroneOperation.CONTROL_SET, time);
        this.controlVariable = controlVariable;
        this.amount = amount;
    }
    toPrettyString(): String {
        return "CONTROL_SET " + this.controlVariable + " " + this.amount;
    }
}

export class ControlSelectCommand extends DroneCommand{
    controlName:String;

    constructor(time: number, controlName:String){
        super(DroneOperation.CONTROL_SELECT, time);
        this.controlName = controlName;
    }

    toPrettyString(): String {
        return "CONTROL_SELECT " + this.controlName;
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

function generateRandomDroneData():DroneData{
    return {
        isArmed: true,
        isEStopped: false,
        lastInstruction: generateRandomDroneCommand().toString(),

        refreshRate: Math.random(),
        packetAge: Math.random(),

        controlSystemList: ["default"],
        currentControlSystem: "default",
        controlSystemVals: {},
        
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

export function generateRandomDroneConnection():DroneConnection{
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
        droneInfo:generateRandomDroneData()
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
        droneInfo:generateRandomDroneData()
}