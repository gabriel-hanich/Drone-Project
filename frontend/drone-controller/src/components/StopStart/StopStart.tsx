import { useState } from "react";
import "./StopStart.css"
import { sendCommandObject, sendCommandString, useConnection } from "../../services/DroneConnection";
import { DroneCommand, DroneOperation, PassiveCommand } from "../../types";

const StopStart:React.FC = ()=>{
    let isStopped = useConnection().droneInfo.isEStopped;
    let isArmed = useConnection().droneInfo.isArmed;

    function emergencyStop(){
        sendCommandObject(new PassiveCommand(DroneOperation.EMERGENCY_STOP, Date.now()));
    }
    
    function restart(){
        sendCommandObject(new PassiveCommand(DroneOperation.DISARM, Date.now()));
    }
    
    function armDrone(){
        sendCommandObject(new PassiveCommand(DroneOperation.ARM, Date.now()));
    }
    
    function disarmDrone(){
        sendCommandObject(new PassiveCommand(DroneOperation.DISARM, Date.now()));
    }

    return(
        <>
            <div className="container stopstart-container rounded">
                <button className={(isStopped ? 'active-button' : 'disabled-button') + " ebutton estart-button"} onClick={restart}>Restart</button>
                <button className={(isStopped ? 'disabled-button' : 'active-button') + " ebutton estop-button"} onClick={emergencyStop}>E STOP</button>

                <div className="arm-container">
                    <button className={"activate-button arm-button " + ((isStopped || isArmed) ? 'disabled-button' : 'active-button')} onClick={armDrone}>Arm</button>
                    <button className={"activate-button disarm-button " + ((isStopped || !isArmed) ? 'disabled-button' : 'active-button')} onClick={disarmDrone}>Disarm</button>
                </div>
            </div>
        </>
    )
}

export default StopStart;