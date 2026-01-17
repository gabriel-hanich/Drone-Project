import { sendCommandString } from "./DroneConnection";

const pollingRate:number = 20;

// An interface describing a single step within the routine
export interface RoutineStep{
    delay:number, // The number of milliseconds after the routine is activated that the command will be sent
    command:String, // A string containing the command
    sent:boolean // If the command has been sent to the drone yet
}

// An interface describing a single routine
export interface DroneRoutine{
    name: String, // The name of the drone command
    steps: RoutineStep[], // A list containing all the commands in the Routine
    totalDuration:number // The total duration (ms) of the routine froms start to end
}

// An interface describing the current status of the routine service 
export interface RoutineStatus{
    isPaused:boolean, // If true, the service will actively execute the routine 
    currentPosition:number, // The number of milliseconds through the routine the service is currently on 
    lastTime:number, // The epoch time that the loop iteration was executed on
    activeRoutine: DroneRoutine,
}



var routineStatus:RoutineStatus = {
    isPaused: true,
    currentPosition: 0,
    lastTime: -1,
    activeRoutine: {
        name: "None",
        steps: [],
        totalDuration: 0
    },

}

var routineLoop: NodeJS.Timer|null = null;

// Returns the current status of the routine as a RoutineStatus object
export function getRoutineStatus():RoutineStatus{
    return routineStatus;
}

// Changes the active routine to the provided one. Can only be done
// When the routine is paused
export function setCurrentRoutine(newRoutine: DroneRoutine){
    if(!routineStatus.isPaused){
        return
    }
    routineStatus.activeRoutine = newRoutine
    routineLoop = null;
}

// Starts the current routine
export function playRoutine(flags:String[]): void{
    routineStatus.isPaused = false;
    
    if(routineLoop == null){
        routineStatus.lastTime = Date.now();
        routineLoop = setInterval(()=>{
            let currentTime = Date.now();
            let atEnd:boolean = true;
            if(routineStatus.isPaused){
                routineStatus.lastTime = currentTime
                return;
            }

            routineStatus.currentPosition = routineStatus.currentPosition + (currentTime - routineStatus.lastTime);
            console.log(routineStatus.currentPosition);
            for(var i=0; i<routineStatus.activeRoutine.steps.length; i++){
                let step:RoutineStep = routineStatus.activeRoutine.steps[i];
                if(!step.sent){
                    atEnd = false;
                    if(step.delay <= routineStatus.currentPosition){
                        if(legalRoutineCommand(step.command, flags)){
                            sendCommandString(step.command);
                        }
                        step.sent = true;
                    } 
                }
            }
            routineStatus.lastTime = currentTime;

            if(atEnd){
                restartRoutine();
            }
        }, pollingRate)
    };
}

export function legalRoutineCommand(command:String, flagList:String[]): boolean{
    if(command.indexOf("FLAG_SET") != -1){
        return false;
    }
    
    let illegalStrings = [
        "EMERGENCY_STOP",
        "EMERGENCY_RESTART",
        "ARM",
        "DISARM"
    ]

    for(var i=0; i<illegalStrings.length; i++){
        if(command.indexOf(illegalStrings[i]) != -1){
            return flagList.indexOf("ROUTINE_STATE_CONTROL") != -1;
        }
    }
    return true;
}

// Pauses the routine
export function pauseRoutine(): void{
    routineStatus.isPaused = true;
}

// Completely restarts the routine, stops the routine loop
export function restartRoutine():void{
    if(routineLoop != null){
        clearInterval(routineLoop as NodeJS.Timer);
    }
    console.log("RESTARTING");
    routineStatus.isPaused = true;
    routineStatus.currentPosition = 0;
    routineLoop = null;

    routineStatus.activeRoutine.steps.forEach((step)=>{
        step.sent = false;
    })
}

// Returns a list of all the routines stored within localStorage
export function getStoredRoutines():DroneRoutine[]{
    let lst:DroneRoutine[] = [];

    let storedRoutines = localStorage.getItem("savedRoutines");
    if(storedRoutines == null){
        return [];
    }
    lst = JSON.parse(storedRoutines)

    return lst;
}

