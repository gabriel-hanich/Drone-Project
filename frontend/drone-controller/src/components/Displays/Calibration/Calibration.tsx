import { useState } from "react";
import "./Calibration.css"
import { ActiveCommand, DroneOperation, DroneProperty } from "../../../types";
import { sendCommandObject } from "../../../services/DroneConnection";

const Calibration:React.FC = ()=>{
    const [pitch, setPitch] = useState<number>(0);
    const [roll, setRoll] = useState<number>(0);
    const [yaw, setYaw] = useState<number>(0);
    
    const [elevation, setElevation] = useState<number>(0);

    function resetIMU(){
        let pitchCMD:ActiveCommand = new ActiveCommand(Date.now(), DroneOperation.RESET, DroneProperty.PITCH, pitch);
        let rollCMD:ActiveCommand = new ActiveCommand(Date.now(), DroneOperation.RESET, DroneProperty.ROLL, roll);
        let yawCMD:ActiveCommand = new ActiveCommand(Date.now(), DroneOperation.RESET, DroneProperty.YAW, yaw);
        sendCommandObject(pitchCMD);
        sendCommandObject(rollCMD);
        sendCommandObject(yawCMD);
    }
    function resetElev(){
        let thisCmd:ActiveCommand = new ActiveCommand(Date.now(), DroneOperation.RESET, DroneProperty.ELEVATION, elevation);
        sendCommandObject(thisCmd);
    }

    return(
        <>
            <div className="wrapper">
                <div className="sensors-container">
                    <div className="sensor-item">
                        <h2 className="sensor-title">IMU</h2>
                        <div className="sensor-val">
                            <p>Pitch</p>
                            <input className="sensor-input" type="number" value={pitch} onChange={(e)=>setPitch(parseFloat(e.target.value))}/>
                        </div>
                        <div className="sensor-val">
                            <p>Roll</p>
                            <input className="sensor-input" type="number" value={roll} onChange={(e)=>setRoll(parseFloat(e.target.value))}/>
                        </div>
                        <div className="sensor-val">
                            <p>Yaw</p>
                            <input className="sensor-input" type="number" value={yaw} onChange={(e)=>setYaw(parseFloat(e.target.value))}/>
                        </div>
                        <button className="sensor-update" onClick={resetIMU}>Update</button>
                    </div>
                    <div className="sensor-item">
                        <h2 className="sensor-title">Ultrasonic</h2>
                        <div className="sensor-val">
                            <p>Elevation</p>
                            <input className="sensor-input" type="number" value={elevation} onChange={(e)=>setElevation(parseFloat(e.target.value))}/>
                        </div>
                        <button className="sensor-update" onClick={resetElev}>Update</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Calibration;