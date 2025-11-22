import { useState } from "react";
import ManualControl from "../Displays/ManualControl/ManualControl";
import "./PrimaryDisplay.css"
import ControlSystem from "../Displays/ControlSystem/ControlSystem";

const PrimaryDisplay:React.FC = ()=>{
    let [currentDisplay, setCurrentDisplay] = useState<String>("control");

    return(
        <>
            <div className="container primary-container rounded">
                <div className="screenbar">
                    <div className={"screenbar-option " + (currentDisplay == "manual" ? 'active-option': '')} onClick={() => setCurrentDisplay('manual')}><p>Manual Control</p></div>
                    <div className={"screenbar-option " + (currentDisplay == "control" ? 'active-option': '')} onClick={() => setCurrentDisplay('control')}><p>Control System</p></div>
                    <div className={"screenbar-option " + (currentDisplay == "calibrate" ? 'active-option': '')} onClick={() => setCurrentDisplay('calibrate')}><p>Calibrate</p></div>
                    <div className={"screenbar-option " + (currentDisplay == "graphs" ? 'active-option': '')} onClick={() => setCurrentDisplay('graphs')}><p>Graphs</p></div>
                </div>

                <div className="screen-container">
                    {currentDisplay == "manual" && <ManualControl></ManualControl>}
                    {currentDisplay == "control" && <ControlSystem></ControlSystem>}
                </div>
            </div>
        </>
    )
    
}

export default PrimaryDisplay;