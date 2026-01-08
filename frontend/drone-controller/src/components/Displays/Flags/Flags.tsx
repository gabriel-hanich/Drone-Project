import { sendCommandObject, useConnection } from "../../../services/DroneConnection";
import { DroneCommand, DroneOperation, SetValueCommand } from "../../../types";
import "./Flags.css"

const Flags:React.FC = ()=>{
    const isArmed = useConnection().droneInfo.isArmed;
    const isEStopped = useConnection().droneInfo.isEStopped;
    const activeFlags = useConnection().droneInfo.activeFlags;

    const flagNames: String[] = ["HARDWARE_TESTING", "LOW_POWER"]

    const flagDescriptions = [
        (<p><b>Disables the control system</b> to enable manual control of the motors. Drive motors can only be set to a maximum of 0.1 (aka 10% throttle) to avoid accidents</p>),
        (<p>Disables most power and all operations of the drone. The ESP32 will remain on and sit in a low power state until the flag is disabled</p>)
    
    ] 

    function toggleFlag(flagName: String): void{
        let setVal: number = (activeFlags.includes(flagName) ? 0 : 1);
        if(!isEStopped && !isArmed){
            sendCommandObject(new SetValueCommand(Date.now(), DroneOperation.FLAG_SET, flagName, setVal)); 
        }
        
    };  

    return (
        <div className="wrapper">
            <div className="warning-container">
                <h3 className="warning-header">Warning!!!</h3>
                <p>These flags enable features that are experimental, or designed for debugging/testing. They are not meant to be enabled for typical operation. Modifying these flags may result in (hardware and software) crashes</p>
                <p>Flags can only be changed when the drone is disarmed and not emergency stopped</p>
            </div>
            <div className="flag-container">
                <table className="flag-table">
                    <tr className="flag-row">
                        <th>Name</th>
                        <th>Description</th>
                        <th>Enabled</th>
                        <th>Toggle</th>
                    </tr>

                    {
                        flagNames.map((fName, index)=>{
                            return (
                                <tr className={"flag-row " + (activeFlags.includes(fName) ? 'active-row' : '')}>
                                    <td>{fName}</td>
                                    <td>{flagDescriptions[index]}</td>
                                    <td>
                                        {
                                            activeFlags.includes(fName) ? <p>True</p> : <p>False</p>
                                        }
                                    </td>
                                    <td><button className={"flag-toggle " + (!isArmed && !isEStopped ? '' : 'disabled-toggle')} onClick={() => {toggleFlag(fName)}}>Toggle</button></td>
                                </tr>
                            )
                        })
                    }

                    
                </table>
            </div>
        </div>
    )

};

export default Flags;