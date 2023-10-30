import React, { useState } from "react";
import Select from 'react-select'
import WindalsNav from "../navbar";
import './supervisorAllocation.css'
import Footer from "../footer";

function SupervisorAllocation() {
    const stations = [...Array(10).keys()].map(id => ({ id: id + 1 }));

    // const supervisors = ["w1", "w2", "w3", "w4", "w5", "w6", "w7", "w8", "w9", "w10"];

    const initialNextStations = [
        { label: "Supervisor 1", value: 1 },
        { label: "Supervisor 2", value: 2 },
        { label: "Supervisor 3", value: 3 },
        { label: "Supervisor 4", value: 4 },
        { label: "Supervisor 5", value: 5 },
        { label: "Supervisor 6", value: 6 },
        { label: "Supervisor 7", value: 7 },
        { label: "Supervisor 8", value: 8 },
        { label: "Supervisor 9", value: 9 },
        { label: "Supervisor 10", value: 10 },
        
        
    ];

    const [supervisor, setsupervisor] = useState();

    function handleChange(){
        setsupervisor(supervisor);
    }


    return (
        <>
        <WindalsNav/>
        
            <div className="svtable">
                
                <table>
                    <thead>
                        <tr>
                            <th>Stations</th>
                            <th>Supervisors</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stations.map(({ id }) => (
                            <tr key={id}>
                                <td>Station {id}</td>
                                <td>
                                    <Select
                                        options={initialNextStations}
                                        placeholder="Select Supervisor"
                                        value={supervisor}
                                        onChange={handleChange}
                                        isSearchable={true}
                                        isMulti
                                        
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <br />
            <br />
            <br />
            <Footer/>
        </>
    );
}

export default SupervisorAllocation;