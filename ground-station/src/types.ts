import { error } from "console";

export interface DroneData{
    isArmed: boolean;
    lastInstruction: String;

    // ms
    refreshRate: number;
    packetAge:number;
        
    // degree/radian?
    pitch: number;
    roll: number;
    yaw: number;

    // All in ms^-1
    xVel: number;
    yVel: number;
    zVel: number;

    // m
    elevation: number;

    //
    throttle: number;
    
    //
    xFinDeflection: number;
    yFinDefilection: number; 

}

enum DroneOperation{
    ARM = "ARM",
    DISARM = "DISARM",
    EMERGENCY_STOP = "EMERGENCY_STOP",
    HOVER = "HOVER",
    SET = "SET"
}

enum DroneProperty{
    ROLL = "ROLL",
    PITCH = "PITCH",
    YAW = "YAW",
    XVEL = "XVEL",
    YVEL = "YVEL",
    ZVEL = "ZVEL",
    ELEVATION = "ELEVATION"
}

export abstract class DroneCommand{
    operation:DroneOperation;

    constructor(operation:DroneOperation){
        this.operation = operation
    }


    abstract toComandString():String;
}

export class PassiveCommand extends DroneCommand{
    constructor(operation:DroneOperation){
        super(operation);
    }

    toComandString(): String {
        return this.operation.toString();
    }

}

export class ActiveCommand extends DroneCommand{
    property: DroneProperty;
    amount: number;

    constructor(operation:DroneOperation, property:DroneProperty, amount:number){
        super(operation);
        if(this.operation != DroneOperation.SET){
            throw new error("Active commands must involve setting a field to something");
        }

        this.property = property;
        this.amount = amount;
    }

    toComandString(): String {
        return this.operation.toString() + " " + this.property.toString() + ": " + this.amount;
    }
}



function generateRandomDroneCommand():String {
    var operation:DroneOperation;
    var path: number = Math.floor(Math.random() * 5);
    switch(path){
        case 0: 
            operation = DroneOperation.ARM;
            break;
        case 1: 
            operation = DroneOperation.DISARM;
            break;
        case 2: 
            operation = DroneOperation.EMERGENCY_STOP;
            break;
        case 3: 
            operation = DroneOperation.HOVER;
            break;
        case 4: 
            operation = DroneOperation.SET;
            break;
    }

    if(operation == DroneOperation.SET){
        var amount = Math.random() * 10;
        var property:DroneProperty;
        var path:number = Math.floor(Math.random() * 7);
        switch(path){
            case 0:
                property = DroneProperty.ELEVATION;
                break;
            case 1:
                property = DroneProperty.PITCH;
                break;
            case 2:
                property = DroneProperty.ROLL;
                break;
            case 3:
                property = DroneProperty.YAW;
                break;
            case 4:
                property = DroneProperty.XVEL;
                break;
            case 5:
                property = DroneProperty.YVEL;
                break;
            case 6:
                property = DroneProperty.ZVEL;
                break;
        }
        return (new ActiveCommand(operation, property, amount)).toComandString();
    }
    return (new PassiveCommand(operation)).toComandString();

}

export function generateRandomDroneData(): DroneData {    
    var dData: DroneData = {
        isArmed: true,
        lastInstruction: generateRandomDroneCommand(),
        refreshRate: Math.round(Math.random() * 500),
        packetAge: Math.round(Math.random() * 500),
        pitch: Math.PI - (Math.random() * 2 * Math.PI),
        roll: Math.PI - (Math.random() * 2 * Math.PI),
        yaw: Math.PI - (Math.random() * 2 * Math.PI),
        xVel: (Math.random() - 0.5) * 4,
        yVel: (Math.random() - 0.5) * 4,
        zVel: (Math.random() - 0.5) * 4,
        elevation: Math.random() * 4,
        throttle: Math.random(),
        xFinDeflection: Math.PI - (Math.random() * 2 * Math.PI),
        yFinDefilection: Math.PI - (Math.random() * 2 * Math.PI)
    }

    return dData;

}
