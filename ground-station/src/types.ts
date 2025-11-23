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
export function handleCommand(state:DroneConnection, command:DroneCommand): DroneConnection{
    if(command.operation == DroneOperation.ARM){
        if(!state.droneInfo.isEStopped){
            state.droneInfo.isArmed = true;
        }
    }
    if(command.operation == DroneOperation.DISARM){
        if(!state.droneInfo.isEStopped){
            state.droneInfo.isArmed = false;
        }
    }
    if(command.operation == DroneOperation.EMERGENCY_STOP){
        state.droneInfo.isEStopped = true;
        state.droneInfo.isArmed = false;
    }
    if(command.operation == DroneOperation.EMERGENCY_RESTART){
        state.droneInfo.isEStopped = false;
        state.droneInfo.isArmed = false;
    }
    if(command.operation == DroneOperation.HOVER){
        state.droneInfo.elevationSetPoint = state.droneInfo.elevation;
        state.droneInfo.xVelSetPoint = 0;
        state.droneInfo.xVel = 0;
        state.droneInfo.yVelSetPoint = 0;
        state.droneInfo.yVel = 0;
        state.droneInfo.zVelSetPoint = 0;
        state.droneInfo.zVel = 0;
    }
    if(command.operation == DroneOperation.CONTROL_SELECT){
        let controlCmd: ControlSelectCommand = command as ControlSelectCommand;

        if(!state.droneInfo.isEStopped && !state.droneInfo.isArmed){
            state.droneInfo.currentControlSystem = controlCmd.controlName;
        }
    }
    if(command.operation == DroneOperation.CONTROL_SET){
        let controlCmd: ControlSetCommand = command as ControlSetCommand;
        state.droneInfo.controlSystemVals[controlCmd.controlVariable as any] = controlCmd.amount
    }

    if(command.operation == DroneOperation.SET){
        let activeCmd:ActiveCommand = command as ActiveCommand;

        if(activeCmd.property == DroneProperty.ELEVATION_SETPOINT){
            state.droneInfo.elevation = activeCmd.amount;
            state.droneInfo.elevationSetPoint = activeCmd.amount;
        }
        if(activeCmd.property == DroneProperty.PITCH_SETPOINT){
            state.droneInfo.pitch = activeCmd.amount;
            state.droneInfo.pitchSetPoint = activeCmd.amount;
        }
        if(activeCmd.property == DroneProperty.ROLL_SETPOINT){
            state.droneInfo.roll = activeCmd.amount;
            state.droneInfo.rollSetPoint = activeCmd.amount;
        }
        if(activeCmd.property == DroneProperty.XVEL_SETPOINT){
            state.droneInfo.xVel = activeCmd.amount;
            state.droneInfo.xVelSetPoint = activeCmd.amount;
        }
        if(activeCmd.property == DroneProperty.YVEL_SETPOINT){
            state.droneInfo.yVel = activeCmd.amount;
            state.droneInfo.yVelSetPoint = activeCmd.amount;
        }
        if(activeCmd.property == DroneProperty.ZVEL_SETPOINT){
            state.droneInfo.zVel = activeCmd.amount;
            state.droneInfo.zVelSetPoint = activeCmd.amount;
        }
    }
    state.droneInfo.lastInstruction = command.toString();
    
    return state
}


var initialDroneData:DroneData = {
    isArmed: false,
    isEStopped: false,
    lastInstruction: "0 EMERGENCY_STOP",

    refreshRate: 0,
    packetAge: 0,

    controlSystemList: ["option1", "option2", "option3"],
    currentControlSystem: "option1",
    controlSystemVals: {"a":1, "b":2, "c": 3, "d": 4},
    
    pitch: 0,
    roll: 0,
    yaw: 0,

    pitchSetPoint: 0,
    rollSetPoint: 0,
    yawSetPoint: 0,

    xVel: 0,
    yVel: 0,
    zVel: 0,

    xVelSetPoint: 0,
    yVelSetPoint: 0,
    zVelSetPoint: 0,

    elevation: 0,
    elevationSetPoint: 0,

    throttle: 0,
    
    xFinDeflection: 0,
    yFinDefilection: 0,
}


export var initialConnection:DroneConnection = {
        backendURL: "",
        droneURL: "",
        backendConnected: true,
        droneConnected: true,
        pollingRate: -1,
        pastCommands: [],
        
        droneFirmwareVersion: "",
        backendFirmwareVersion: "",
        frontendFirmwareVersion: "0.1.0",
        droneInfo:initialDroneData,
}

