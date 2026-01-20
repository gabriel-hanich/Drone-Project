import { useEffect, useState } from "react"
import triangle from "../../../assets/triangle.svg"
import skipback from "../../../assets/skipback.svg"
import "./Routines.css"
import { DroneRoutine, getRoutineStatus, getStoredRoutines, legalRoutineCommand, pauseRoutine, playRoutine, restartRoutine, RoutineStep, setCurrentRoutine } from "../../../services/DroneRoutines";
import { useConnection } from "../../../services/DroneConnection";

const Routines:React.FC = () => {
    const droneState = useConnection();

    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [routineName, setRoutineName] = useState<String>("None");
    const [routinePortion, setRoutinePortion] = useState<number>(0);
    const [storedRoutines, setStoredRoutines] = useState<DroneRoutine[]>(getStoredRoutines());
    const [shownCommands, setShownCommands] = useState<String[]>([" ", " ", " ", " ", " "]);
    const [delays, setDelays] = useState<String[]>([" ", " ", " ", " "]);
    const [circleColors, setCircleColors] = useState<string[]>(["#fff", "#fff", "#fff", "#fff", "#fff"]);


    useEffect(()=>{
        console.log("ONLOAD");
        matchLocalData();
        if(!isPaused){
            let frontEndUpdater = setInterval(()=>{
                matchLocalData();
                if(routinePortion >= 0.99){
                    setTimeout(()=>{
                        clearInterval(frontEndUpdater);
                    }, 500)
                }
            }, 100)
        }
    }, [])

    // Manages a file being uploaded to the routine
    function handleFile(event: React.ChangeEvent<HTMLInputElement>): void{
        if(event.target.files == null){
            return;
        }

        let uploadedFile:File = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => addNewRoutine(e, (event.target.files as FileList)[0].name.replace(".csv", ""));
        reader.readAsText(uploadedFile);
    }

    // Read the file data and save it to LocalStorage
    function addNewRoutine(event:ProgressEvent<FileReader>, fileName:String){
        let fileContents: String = (event.target as unknown as FileReader).result as String;
        let fileLines:String[] =  fileContents.split("\n");
        
        if(fileName == "None"){
            alert("None is a reserved name. You cannot upload a file called `None.csv`. Rename the file and try again")
            return
        }
        
        let newRoutine: DroneRoutine = {
            "name": fileName,
            "steps": [],
            "totalDuration": -1,
        }
        fileLines.forEach((line)=>{
            let paramPair = line.split(",");
            if(paramPair.length == 2){
                let step:RoutineStep = {
                    "delay": Number(paramPair[0]),
                    "command": paramPair[1].trim(),
                    "sent": false,
                }
                newRoutine.steps.push(step);
                newRoutine.totalDuration = step.delay;
            }
        });
        
        let storedData: string | null = localStorage.getItem("savedRoutines");
        let newData: DroneRoutine[] = [];

        if(storedData != null){
            newData = JSON.parse(storedData as string);
        }

        newData.push(newRoutine);
        localStorage.setItem("savedRoutines", JSON.stringify(newData));
        setStoredRoutines(getStoredRoutines);
    }
    
    // Clears all the stored routines
    function clearRoutines(){
        localStorage.removeItem("savedRoutines") 
        setStoredRoutines(getStoredRoutines);
    }

    // Changes the current active drone routine if the prior routine is paused
    function setNewActiveRoutine(routineData:DroneRoutine){
        if(isPaused && routineData.name != routineName){
            setRoutineName(routineData.name);
            setCurrentRoutine(routineData);
            updateShownCommands([], routineData.steps);
        }
    }

    // Changes whether or not the routine is currently being played
    function setPlaystate(setToPlay:boolean):void{
        if(setToPlay && isPaused){
            setIsPaused(false);
            playRoutine(droneState.droneInfo.activeFlags);
            let frontEndUpdater = setInterval(()=>{
                matchLocalData();
                if(routinePortion >= 0.99){
                    setTimeout(()=>{
                        clearInterval(frontEndUpdater);
                    }, 500)
                }
            }, 100)
        }
        if(!setToPlay && !isPaused){
            setIsPaused(true);
            pauseRoutine();
        }
    }

    function matchLocalData(){
        let currentRoutineStatus = getRoutineStatus();
        setIsPaused(currentRoutineStatus.isPaused);
        setRoutineName(currentRoutineStatus.activeRoutine.name)
        setRoutinePortion(currentRoutineStatus.currentPosition / currentRoutineStatus.activeRoutine.totalDuration);
        
        let sentCommands:RoutineStep[] = currentRoutineStatus.activeRoutine.steps.filter((step)=>step.sent);
        let futureCommands:RoutineStep[] = currentRoutineStatus.activeRoutine.steps.filter((step)=>!step.sent);

        updateShownCommands(sentCommands, futureCommands);
    }

    function updateShownCommands(sentSteps:RoutineStep[], futureSteps:RoutineStep[], ){
        const flagList:String[] = droneState.droneInfo.activeFlags;
        
        let displayCmds:String[] = ["", "", "", "", ""];
        let displayDelays:String[] = ["", "", "", ""];
        let displayColors:string[] = ["#fff", "#fff", "#fff", "#fff", "#fff"];

        if(futureSteps.length >= 2){
            displayCmds[0] = futureSteps[1].command
            displayDelays[0] = (futureSteps[1].delay - futureSteps[0].delay) + "ms"

        }
        if(futureSteps.length >= 1){
            displayCmds[1] = futureSteps[0].command

            if(sentSteps.length >= 1){
                displayDelays[1] = (futureSteps[0].delay - sentSteps[sentSteps.length - 1].delay) + "ms"
            }else{
                displayDelays[1] = (futureSteps[0].delay) + "ms"
            }
        }

        if(sentSteps.length >= 1){
            displayCmds[2] = sentSteps[sentSteps.length - 1].command;
        }

        if(sentSteps.length >= 2){
            displayCmds[3] = sentSteps[sentSteps.length - 2].command
            displayDelays[2] = (sentSteps[sentSteps.length - 1].delay -  sentSteps[sentSteps.length - 2].delay) + "ms";
        }

        if(sentSteps.length >= 3){
            displayCmds[4] = sentSteps[sentSteps.length - 3].command
            displayDelays[3] = (sentSteps[sentSteps.length - 2].delay -  sentSteps[sentSteps.length - 3].delay) + "ms";
        }


        for(var i=0; i<displayCmds.length; i++){
            if(!legalRoutineCommand(displayCmds[i], droneState.droneInfo.activeFlags)){
                displayColors[i] = "#cf1d3b";
            }
        }

        if(displayCmds != shownCommands){
            setShownCommands(displayCmds);
        }
        if(displayDelays != delays){
            setDelays(displayDelays);
        }
        if(displayColors != circleColors){
            setCircleColors(displayColors);
        }
    }

    // TODO
    function resetRoutine():void{
        restartRoutine();
        setIsPaused(true);
    }





    return(
        <>
        <div className="wrapper routines-wrapper">
            <div className="routine-selector">
                <div className="routine-item">
                    <p>Selected Routine</p>
                    <p><b>{routineName}</b></p>
                </div>
                <div className="routine-item">
                    <p>Stored Routines</p>
                    {storedRoutines.map((rout)=> <p className="routine-option" onClick={() => setNewActiveRoutine(rout)}>{rout.name}</p>)}
                </div>
                <div className="routine-item">
                    <p>Upload a new Routine</p>
                    <input id="control-file" type="file" accept=".csv" onChange={(e)=>handleFile(e)}/>
                </div>
                <div className="routine-item">
                    <p>Clear all Routines</p>
                    <button onClick={clearRoutines}>Clear</button>
                </div>
            </div>
            <div className="routine-viewer">
                <div className="routine-item routine-playback">
                    <p><b>{routineName}</b></p>
                    <p style={{display: (droneState.droneInfo.isArmed ? 'none' : 'block'), fontSize:'0.75rem'}}>Routines can only be started when the drone is Armed</p>
                    <div className="routine-btns">
                        <div className={"routine-btn " + ((!isPaused || routineName == 'None' || droneState.droneInfo.isEStopped || !droneState.droneInfo.isArmed) ? 'disabled-btn' : '')} id="start" onClick={() => setPlaystate(true)}>
                            <img id="start-img" src={triangle} alt="Start" />
                        </div>
                        <div className={"routine-btn " + ((isPaused || routineName == 'None') ? 'disabled-btn' : '')} id="stop" aria-valuetext="End" onClick={() => setPlaystate(false)}>
                            <div className="stop-bar"></div>
                            <div className="stop-bar"></div>
                        </div>
                        <div className={"routine-btn " + (routineName == 'None' ? 'disabled-btn' : '')} id="restart" aria-valuetext="End" onClick={resetRoutine}>
                            <img className="restart-img" src={skipback} alt="Restart" />
                        </div>
                    </div>
                    <div className="routine-bar">
                        <div className="routine-scrubber" style={{left: (routinePortion * 100) + "%"}}></div>
                    </div>
                </div>
                <div className="routine-item preview" style={{display: (routineName == "None" ? 'none' : 'grid')}}>
                    <div className="arrow-container">
                        <img src={triangle} alt="" className="arrow-tip" />
                    </div>
                    <div className="stations-container">
                        <div className="station">
                            <div className="station-circle" style={{backgroundColor: circleColors[0]}}></div>
                            <p className="station-text">{shownCommands[0]}</p>
                        </div>
                        <div className="station-between">
                            <p>{delays[0]}</p>
                        </div>
                        <div className="station">
                            <div className="station-circle" style={{backgroundColor: circleColors[1]}}></div>
                            <p className="station-text">{shownCommands[1]}</p>
                        </div>
                        <div className="station-between">
                            <p>{delays[1]}</p>
                        </div>
                        <div className="station station-current">
                            <div className="station-circle circle-current" style={{backgroundColor: circleColors[2]}}></div>
                            <p className="station-text text-current">{shownCommands[2]}</p>
                        </div>
                        <div className="station-between">
                            <p>{delays[2]}</p>
                        </div>
                        <div className="station">
                            <div className="station-circle" style={{backgroundColor: circleColors[3]}}></div>
                            <p className="station-text">{shownCommands[3]}</p>
                        </div>
                        <div className="station-between">
                            <p>{delays[3]}</p>
                        </div>
                        <div className="station">
                            <div className="station-circle" style={{backgroundColor: circleColors[4]}}></div>
                            <p className="station-text">{shownCommands[4]}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Routines