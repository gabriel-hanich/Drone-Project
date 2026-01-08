export interface DroneConnection{
    backendURL: String;
    droneURL: String;
    backendConnected:boolean; // Whether or not the website can connect to the ground station
    droneConnected:boolean; // Whether or not the ground station can connect to the drone
    pollingRate:Number;
    
    droneFirmwareVersion: String;
    backendFirmwareVersion: String;
    frontendFirmwareVersion: String;

    isRecording: boolean;

    pastCommands: String[]

    droneInfo:DroneData;
}

export interface DroneData{
    opTime: number;
    epochTime: number;

    isArmed: boolean;
    isEStopped: boolean;
    lastInstruction: String;

    controlSystemList: String[];
    currentControlSystem: String;
    controlSystemVals: CSConstant[];

    activeFlags: String[];

    refreshRate: number;
    packetAge: number;

    pitch: number;
    roll: number;
    yaw: number;
    pitchSetPoint: number;
    rollSetPoint: number;
    yawSetPoint: number;

    pitchAcc: number;
    rollAcc: number;
    yawAcc: number;
    pitchAccSetPoint: number;
    rollAccSetPoint: number;
    yawAccSetPoint: number;

    xAcc: number;
    yAcc: number;
    zAcc: number;
    xAccSetPoint: number;
    yAccSetPoint: number;
    zAccSetPoint: number;

    elevation: number;
    elevationSetPoint: number;

    dMotor1Throttle: number;
    dMotor2Throttle: number;

    fin1Deflection: number;
    fin2Deflection: number;
    fin3Deflection: number;
    fin4Deflection: number;
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
    CONTROL_SET = "CONTROL_SET",
    FLAG_SET = "FLAG_SET"
}

export enum DroneProperty{
    PITCH_SETPOINT = "PITCH_SETPOINT",
    ROLL_SETPOINT = "ROLL_SETPOINT",
    YAW_SETPOINT = "YAW_SETPOINT",
    PITCH_ACC_SETPOINT = "PITCH_ACC_SETPOINT",
    ROLL_ACC_SETPOINT = "ROLL_ACC_SETPOINT",
    YAW_ACC_SETPOINT = "YAW_ACC_SETPOINT",
    X_ACC_SETPOINT = "X_ACC_SETPOINT",
    Y_ACC_SETPOINT = "Y_ACC_SETPOINT",
    Z_ACC_SETPOINT = "Z_ACC_SETPOINT",
    ELEVATION_SETPOINT = "ELEVATION_SETPOINT",
    D_MOTOR1_THROTTLE = "D_MOTOR1_THROTTLE",
    D_MOTOR2_THROTTLE = "D_MOTOR2_THROTTLE",
    FIN1_DEFLECTION = "FIN1_DEFLECTION",
    FIN2_DEFLECTION = "FIN2_DEFLECTION",
    FIN3_DEFLECTION = "FIN3_DEFLECTION",
    FIN4_DEFLECTION = "FIN4_DEFLECTION"
}

export interface CSConstant{
    name: String,
    value: number
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
            return new SelectValueCommand(time, chosenDroneOp, chosenControlSystem);
        }

        if(chosenDroneOp == DroneOperation.CONTROL_SET || chosenDroneOp == DroneOperation.FLAG_SET){
            let chosenControlVariable = lineElems[2];
            let chosenControlValue = parseFloat(lineElems[3].toString());
            return new SetValueCommand(time, chosenDroneOp, chosenControlVariable, chosenControlValue);
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
export class SetValueCommand extends DroneCommand{
    controlVariable:String;
    amount:number;

    constructor(time:number, operation:DroneOperation, controlVariable:String, amount:number){
        super(operation, time);
        this.controlVariable = controlVariable;
        this.amount = amount;
    }
    toPrettyString(): String {
        return this.operation.toString() + " " + this.controlVariable + " " + this.amount;
    }
}

export class SelectValueCommand extends DroneCommand{
    controlName:String;

    constructor(time: number, operation:DroneOperation, controlName:String){
        super(operation, time);
        this.controlName = controlName;
    }

    toPrettyString(): String {
        return this.operation.toString()  + " " + this.controlName;
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
        state.droneInfo.xAccSetPoint = 0;
        state.droneInfo.xAcc = 0;
        state.droneInfo.yAccSetPoint = 0;
        state.droneInfo.yAcc = 0;
        state.droneInfo.zAcc = 0;
        state.droneInfo.zAccSetPoint = 0;
    }
    if(command.operation == DroneOperation.CONTROL_SELECT){
        let controlCmd: SelectValueCommand = command as SelectValueCommand;

        if(!state.droneInfo.isEStopped && !state.droneInfo.isArmed){
            state.droneInfo.currentControlSystem = controlCmd.controlName;
        }
    }

    if(command.operation == DroneOperation.CONTROL_SET){
        let setCommand: SetValueCommand = command as SetValueCommand;
        let constants:CSConstant[] = state.droneInfo.controlSystemVals;
        constants.forEach((pair:CSConstant)=>{
            if(pair.name == setCommand.controlVariable){
                pair.value = setCommand.amount
            }
        })
        state.droneInfo.controlSystemVals = constants
    }

    if(command.operation == DroneOperation.FLAG_SET){
        let setCommand = command as SetValueCommand;
        if(setCommand.amount == 1){
            state.droneInfo.activeFlags.push(setCommand.controlVariable);
        }else{
            state.droneInfo.activeFlags = state.droneInfo.activeFlags.filter(val => val != setCommand.controlVariable)
        }
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
        if(activeCmd.property == DroneProperty.YAW_SETPOINT){
            state.droneInfo.yaw = activeCmd.amount;
            state.droneInfo.yawSetPoint = activeCmd.amount;
        }
        if(activeCmd.property == DroneProperty.X_ACC_SETPOINT){
            state.droneInfo.xAcc = activeCmd.amount;
            state.droneInfo.xAccSetPoint = activeCmd.amount;
        }
        if(activeCmd.property == DroneProperty.Y_ACC_SETPOINT){
            state.droneInfo.yAcc = activeCmd.amount;
            state.droneInfo.yawAccSetPoint = activeCmd.amount;
        }
        if(activeCmd.property == DroneProperty.Z_ACC_SETPOINT){
            state.droneInfo.zAcc = activeCmd.amount;
            state.droneInfo.zAccSetPoint = activeCmd.amount;
        }
    }


    state.droneInfo.lastInstruction = command.toString();
    
    return state
}


var initialDroneData:DroneData = {
    opTime:0,
    epochTime:0,

    isArmed:false,
    isEStopped:true,
    lastInstruction:"0 EMERGENCY_STOP",

    controlSystemList:["option 1", "option 2", "option 3"],
    currentControlSystem:"option 1",
    controlSystemVals:[{"name": "a", "value": 1}, {"name": "b", "value": 2}, {"name": "c", "value": 3}],

    activeFlags:[""],

    refreshRate:0,
    packetAge:0,

    pitch:0,
    roll:0,
    yaw:0,
    pitchSetPoint:0,
    rollSetPoint:0,
    yawSetPoint:0,

    pitchAcc:0,
    rollAcc:0,
    yawAcc:0,
    pitchAccSetPoint:0,
    rollAccSetPoint:0,
    yawAccSetPoint:0,

    xAcc:0,
    yAcc:0,
    zAcc:0,
    xAccSetPoint:0,
    yAccSetPoint:0,
    zAccSetPoint:0,

    elevation:0,
    elevationSetPoint:0,

    dMotor1Throttle:0,
    dMotor2Throttle:0,

    fin1Deflection:0,
    fin2Deflection:0,
    fin3Deflection:0,
    fin4Deflection:0,
}

export var initialConnection:DroneConnection = {
        backendURL: "",
        droneURL: "",
        backendConnected: true,
        droneConnected: true,
        pollingRate: -1,
        pastCommands: [],
        isRecording: false,
        
        droneFirmwareVersion: "",
        backendFirmwareVersion: "",
        frontendFirmwareVersion: "0.1.0",
        droneInfo:initialDroneData,
}

