import { useState } from "react";
import ManualControl from "../Displays/ManualControl/ManualControl";
import "./PrimaryDisplay.css"
import ControlSystem from "../Displays/ControlSystem/ControlSystem";

import Calibration from "../Displays/Calibration/Calibration";
import RecordData from "../Displays/RecordData/RecordData";
import RawData from "../Displays/RawData/RawData";
import Flags from "../Displays/Flags/Flags";
import Routines from "../Displays/Routines/Routines";
import HomeDisplay from "../Displays/HomeDisplay/HomeDisplay";

const PrimaryDisplay:React.FC = ()=>{
    let [currentDisplay, setCurrentDisplay] = useState<String>("home");

    return(
        <>
            <div className="container primary-container rounded">
                <div className="screenbar">
                    <div className={"screenbar-option " + (currentDisplay === "home" ? 'active-option': '')} onClick={() => setCurrentDisplay('home')}><p>Home</p></div>
                    <div className={"screenbar-option " + (currentDisplay === "routines" ? 'active-option': '')} onClick={() => setCurrentDisplay('routines')}><p>Routines</p></div>
                    <div className={"screenbar-option " + (currentDisplay === "control" ? 'active-option': '')} onClick={() => setCurrentDisplay('control')}><p>Control System</p></div>
                    <div className={"screenbar-option " + (currentDisplay === "calibrate" ? 'active-option': '')} onClick={() => setCurrentDisplay('calibrate')}><p>Calibrate</p></div>
                    <div className={"screenbar-option " + (currentDisplay === "Manual" ? 'active-option': '')} onClick={() => setCurrentDisplay('manual')}><p>Manual Control</p></div>
                    <div className={"screenbar-option " + (currentDisplay === "record" ? 'active-option': '')} onClick={() => setCurrentDisplay('record')}><p>Record</p></div>
                    <div className={"screenbar-option " + (currentDisplay === "raw" ? 'active-option': '')} onClick={() => setCurrentDisplay('raw')}><p>Raw Data</p></div>
                    <div className={"screenbar-option " + (currentDisplay === "flags" ? 'active-option': '')} onClick={() => setCurrentDisplay('flags')}><p>Flags</p></div>
                </div>

                <div className="screen-container">
                    {currentDisplay === "home" && <HomeDisplay></HomeDisplay>}
                    {currentDisplay === "routines" && <Routines></Routines>}
                    {currentDisplay === "control" && <ControlSystem></ControlSystem>}
                    {currentDisplay === "calibrate" && <Calibration></Calibration>}
                    {currentDisplay === "manual" && <ManualControl></ManualControl>}
                    {currentDisplay === "record" && <RecordData></RecordData>}
                    {currentDisplay === "raw" && <RawData></RawData>}
                    {currentDisplay === "flags" && <Flags></Flags>}
                </div>
            </div>
        </>
    )
    
}

export default PrimaryDisplay;