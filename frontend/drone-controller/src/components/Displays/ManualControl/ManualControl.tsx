import "./ManualControl.css"
import triangle from "../../../assets/triangle.svg"
import { sendCommandObject, sendCommandString, useConnection } from "../../../services/DroneConnection";
import { ActiveCommand, DroneOperation, DroneProperty } from "../../../types";

const ManualControl:React.FC = ()=>{
    const maxHeight = 10; // The maximum height that can be read by the drone (m)
    const speed = 1.0 // The horizontal speed that the arrows will command the drone to go 
    let elevation: number = useConnection().droneInfo.elevation;
    let elevationSetPoint: number = useConnection().droneInfo.elevationSetPoint;
    
    function incrementElevationSetPoint(amount:number){
        sendCommandObject(new ActiveCommand(Date.now(), DroneOperation.SET, DroneProperty.ELEVATION_SETPOINT, elevationSetPoint + amount));
    }


    return(
        <>
            <div className="wrapper control-wrapper">
                <div className="control-container">
                    <div className="set-container" id="setcontup">
                        <img src={triangle} 
                            alt="Triangle pointing up"
                            className="set-img" 
                            id="set-up" 
                            onMouseDown={() => sendCommandObject(new ActiveCommand(Date.now(), DroneOperation.SET, DroneProperty.X_ACC_SETPOINT, speed))} 
                            onMouseUp={() => sendCommandObject(new ActiveCommand(Date.now(), DroneOperation.SET, DroneProperty.X_ACC_SETPOINT, 0))}
                            />
                    </div>
                    <div className="set-container" id="setcontright">
                        <img src={triangle} 
                            alt="Triangle pointing right" 
                            className="set-img" 
                            id="set-right" 
                            onMouseDown={() => sendCommandObject(new ActiveCommand(Date.now(), DroneOperation.SET, DroneProperty.Y_ACC_SETPOINT, speed))} 
                            onMouseUp={() => sendCommandObject(new ActiveCommand(Date.now(), DroneOperation.SET, DroneProperty.Y_ACC_SETPOINT, 0))}/>
                    </div>
                    <div className="set-container" id="setconthover">
                        <div className="set-elem" id="set-hover" onMouseDown={() => sendCommandString("HOVER")}>
                            <p className="set-text">Hover</p>
                        </div>
                    </div> 
                    <div className="set-container" id="setcontleft">
                        <img src={triangle}
                        alt="Triangle pointing left"
                        className="set-img" 
                        id="set-left" 
                        onMouseDown={() => sendCommandObject(new ActiveCommand(Date.now(), DroneOperation.SET, DroneProperty.Y_ACC_SETPOINT, (-1 * speed)))} 
                        onMouseUp={() => sendCommandObject(new ActiveCommand(Date.now(), DroneOperation.SET, DroneProperty.Y_ACC_SETPOINT, 0))}/>
                    </div>
                    <div className="set-container" id="setcontdown">
                        <img src={triangle} 
                        alt="Triangle pointing down" 
                        className="set-img" 
                        id="set-down" 
                        onMouseDown={() => sendCommandObject(new ActiveCommand(Date.now(), DroneOperation.SET, DroneProperty.X_ACC_SETPOINT, -1 * speed))} 
                        onMouseUp={() => sendCommandObject(new ActiveCommand(Date.now(), DroneOperation.SET, DroneProperty.X_ACC_SETPOINT, 0))}/>
                    </div>
                </div>
                <div className="elevation-container">
                    <div className="current-elevation-container">
                        <p className="elevation-text">Current</p>
                        <p className="elevation-text">{maxHeight}m</p>
                        <div className="elevation-bar">
                            <div className="elevation-indicator" style={{top: `${100 - elevation/maxHeight * 100}%`}}>
                                <p className="elevation-text">{Math.round(elevation * 100) / 100}m</p>
                            </div>
                        </div>
                        <p className="elevation-text" >0m</p>
                    </div>
                    <div className="current-elevation-container">
                        <p className="elevation-text">Setpoint</p>
                        <p className="elevation-text elevation-text-clickable" onClick={() => incrementElevationSetPoint(0.5)}>+</p>
                        <div className="elevation-bar">
                            <div className="elevation-indicator" style={{top: `${100 - elevationSetPoint/maxHeight * 100}%`}}>
                                <p className="elevation-text">{Math.round(elevationSetPoint * 100) / 100}m</p>
                            </div>
                        </div>
                        <p className="elevation-text elevation-text-clickable" onClick={() => incrementElevationSetPoint(-0.5)}>-</p>
                    </div>
                </div>
            </div>
        </>
    )
    
}

export default ManualControl;