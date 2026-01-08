import { ChangeEvent, useState } from "react"
import triangle from "../../../assets/triangle.svg"
import "./Routines.css"

const Routines:React.FC = () => {
    const [routinePortion, setRoutinePortion] = useState<number>(0);

    function handleFile(event: ChangeEvent<HTMLInputElement>): void{
        console.log("WAAA!")
        setRoutinePortion(0.5)
    }
    
    return(
        <>
        <div className="wrapper routines-wrapper">
            <div className="routine-selector">
                <div className="routine-item">
                    <p>Selected Routine</p>
                    <p><b>None</b></p>
                </div>
                <div className="routine-item">
                    <p>Stored Routines</p>
                    <div className="routine-list">
                        <p className="routine-option">Routine 1</p>
                        <p className="routine-option">Routine 2</p>
                        <p className="routine-option">Routine 3</p>
                        <p className="routine-option">Routine 4</p>
                        <p className="routine-option">Routine 5</p>
                        <p className="routine-option">Routine 6</p>
                        <p className="routine-option">Routine 7</p>
                    </div>
                </div>
                <div className="routine-item">
                    <p>Upload a new Routine</p>
                    <input id="control-file" type="file" accept=".csv" onChange={(e)=>handleFile(e)}/>
                </div>
                <div className="routine-item">
                    <p>Clear Stored Routines</p>
                    <button>Clear</button>
                </div>
            </div>
            <div className="routine-viewer">
                <div className="routine-item routine-playback">
                    <p><b>Routine 1</b></p>
                    <div className="routine-btns">
                        <div className="routine-btn" id="start">
                            <img id="start-img" src={triangle} alt="Start" />
                        </div>
                        <div className="routine-btn" id="stop" aria-valuetext="End">
                            <div className="stop-bar"></div>
                            <div className="stop-bar"></div>
                        </div>
                    </div>
                    <div className="routine-bar">
                        <div className="routine-scrubber" style={{left: (routinePortion * 100) + "%"}}></div>
                    </div>
                </div>
                <div className="routine-item preview">
                    <div className="arrow-container">
                        <img src={triangle} alt="" className="arrow-tip" />
                    </div>
                    <div className="stations-container">
                        <div className="station">
                            <div className="station-circle"></div>
                            <p className="station-text">Future Command</p>
                        </div>
                        <div className="station-between">
                            <p>500ms</p>
                        </div>
                        <div className="station">
                            <div className="station-circle"></div>
                            <p className="station-text">Future Command</p>
                        </div>
                        <div className="station-between">
                            <p>500ms</p>
                        </div>
                        <div className="station station-current">
                            <div className="station-circle circle-current"></div>
                            <p className="station-text text-current">Current Command</p>
                        </div>
                        <div className="station-between">
                            <p>500ms</p>
                        </div>
                        <div className="station">
                            <div className="station-circle"></div>
                            <p className="station-text">Previous Command</p>
                        </div>
                        <div className="station-between">
                            <p>500ms</p>
                        </div>
                        <div className="station">
                            <div className="station-circle"></div>
                            <p className="station-text">Previous Command</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Routines