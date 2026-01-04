import { useEffect, useState } from "react";
import "./Graph.css"
import { useConnection } from "../../../services/DroneConnection";

import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);


const lineGraphOptions = {
    scales: {
        x: {
            grid: {
                display: false,
            },
            labels: [12,11,10,9,8,7,6,5,4,3,2,1,0],
            ticks: {
                color: "white",
                font: {
                    family: "Nunito",
                    size: 12,
                },
            },
        },
        y: {
            grid: {
                display: false,
            },
            border: {
                display: false,
            },
            ticks: {
                color: "white",
                font: {
                    family: "Nunito",
                    size: 12,
                },
            },
        },
    },
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
        legend: {
            display: true,
        },
        title: {
            display: false,
        },
    },
}



const Graph:React.FC = ()=>{

    const droneData = useConnection();

    const [userXAxis, setUserXAxis] = useState<string>("time");
    const [userYAxis, setUserYAxis] = useState<string>("XVEL");
    
    const [XAxisLabel, setXAxisLabel] = useState<string>("time");
    const [YAxisLabel, setYAxisLabel] = useState<string>("XVEL");

    const [graphData, setGraphData] = useState<any>();
    const [graphOptions, setGraphOptions] = useState<any>();

    
    const formattedData = {
        datasets: [
            {
                label: YAxisLabel,
                borderColor: "white",
                pointRadius: 0,
                fill: false,
                lineTension: 0,
                data: graphData,
                borderWidth: 2,
        },
        ],
    }

    useEffect(()=>{
        if(graphData != undefined){
            setGraphData((prevValues:any) => [
             ...prevValues.slice(1),
             droneData.pollingRate
            ])
            console.log(graphData);
            console.log("HELLOWORLD")
        }
    }, [droneData])

    function updateAxis(){
        setXAxisLabel(userXAxis);
        setYAxisLabel(userYAxis);

        if(XAxisLabel == "time"){
            setGraphOptions(lineGraphOptions);
            setGraphData([0,0,0,0,0,0,0,0,0,0,0,0])
        }
        else{
            // setGraphOptions(scatterGraphOptions)
        }
    }

    return(
        <>
           <div className="wrapper graph-wrapper">
                <div className="graph-container">
                    <Line id="home" options={graphOptions} data={formattedData} />
                </div>
                <div className="settings-box">
                    <p className="settings-label">X-Axis</p>
                    <input type="text" className="settings-input" value={userXAxis.toString()} onChange={e => setUserXAxis(e.target.value)}/>
                    <p className="settings-label">Y-Axis</p>
                    <input type="text" className="settings-input" value={userYAxis.toString()} onChange={e => setUserYAxis(e.target.value)}/>
                    <button className="settings-button" onClick={updateAxis}>Update</button>
                </div>
           </div>
        </>
    )
    
}

export default Graph;