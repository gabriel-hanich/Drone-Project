import "./RecordData.css"

const RecordData:React.FC = ()=>{
    return(
        <>
            <div className="wrapper">
                <div className="record-box">
                    <button className="rec-button" id="start-rec">
                        <div className="rec-inset" id="start-inset">
                            <p>Start</p>
                        </div>
                    </button>
                    <button className="rec-button" id="stop-rec">
                        <div className="rec-inset" id="end-inset">
                            <p>End</p>
                        </div>
                    </button>
                    <p>Duration: 00:00:00</p>
                </div>
            </div>
        </>
    )
    
}

export default RecordData;