import "./Flags.css"

const Flags:React.FC = ()=>{

    return (
        <div className="wrapper">
            <div className="warning-container">
                <h3 className="warning-header">Warning!!!</h3>
                <p>These flags enable features that are experimental, or for debugging. They are not meant to be enabled for typical operation. Modifying these flags may result in crashes (of both the software and hardware) or instability.</p>
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
                    <tr className="flag-row">
                        <td>HARDWARE_TESTING</td>
                        <td>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam nemo illo nisi ipsa voluptates accusantium! Optio saepe ipsum culpa ipsa?</td>
                        <td>False</td>
                        <td><button>Toggle</button></td>
                    </tr>
                    <tr className="flag-row">
                        <td>HARDWARE_TESTING</td>
                        <td>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam nemo illo nisi ipsa voluptates accusantium! Optio saepe ipsum culpa ipsa?</td>
                        <td>False</td>
                        <td><button>Toggle</button></td>
                    </tr>
                    <tr className="flag-row">
                        <td>HARDWARE_TESTING</td>
                        <td>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam nemo illo nisi ipsa voluptates accusantium! Optio saepe ipsum culpa ipsa?</td>
                        <td>False</td>
                        <td><button>Toggle</button></td>
                    </tr>
                </table>
            </div>
        </div>
    )

};

export default Flags;