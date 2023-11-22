import React from "react";
import WindalsNav from "../navbar";
import './supervisor.css'
import Footer from "../footer";
import Table from 'react-bootstrap/Table';
import { getStationRework } from "../../helper/helper";
import { Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
function Supervisor() {
    const [rework, setRework] = useState([]);
    
    useEffect(() => {
        const getStationReworkPromise = getStationRework();
    
        toast.promise(getStationReworkPromise, { 
          loading: "Fetching data",
          success: (result) => {
            setRework(result);
            toast.success(<b>Data fetched successfully</b>);
          },
          error: (err) => {
            toast.error(err.msg);
          },
        });
      }, []);

      console.log(rework);
    return (
        <>
            <div>
                <WindalsNav />
                <div className="superv">
                    <h1>Supervisor Dashboard</h1>
                    <div className="svdash">
                    <Table responsive>
                        <thead>
                            <tr>
                            <th>#</th>
                            <th>Job</th>
                            <th>Station</th>
                            <th>Reason</th>
                            <th>Ok</th>
                            <th>Not Ok</th>
                            <th>Rework</th>
                            </tr>
                        </thead>
                        <tbody>
                        {rework.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.job_id}</td>
                                        <td>{item.station_id}</td>
                                        <td>{item.parameters}</td>
                                        
                                        <td>
                                            <Button variant="success">Ok</Button>
                                        </td>
                                        <td>
                                            <Button variant="danger">Not Ok</Button>
                                        </td>
                                        <td>
                                            <Button variant="warning">Rework</Button>
                                        </td>
                                    </tr>
                                ))}
                            
                        </tbody>
                        </Table>

                    </div>




                </div>
                <Footer />
            </div>

        </>
    )
}

export default Supervisor;