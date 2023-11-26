import React from "react";
import WindalsNav from "../navbar";
import './supervisor.css'
import Footer from "../footer";
import Table from 'react-bootstrap/Table';
import { getStationRework,insertInStationyyyyFirstNextStation,updateJobsfromSupervisorDash } from "../../helper/helper";
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
            const resultWithStatus = result.map(item => ({ ...item, status: -1 }));
            setRework(resultWithStatus);
            toast.success(<b>Data fetched successfully</b>);
          },
          error: (err) => {
            toast.error(err.msg);
          },
        });
      }, []);

      const handleButtonClick = (index, buttonType) => {
        const updatedRework = [...rework];
        const newValues={product_name:updatedRework[index].product_name, 
                         station_id:updatedRework[index].station_id, 
                         job_name:updatedRework[index].job_name,
                         employee_id:updatedRework[index].employee_id,
                         status:updatedRework[index].status,
                         parameters:updatedRework[index].parameters,
                         machine_id:updatedRework[index].machine_id};

         const insertValues={product_name:updatedRework[index].product_name, 
                            station_id:updatedRework[index].station_id, 
                            job_name:updatedRework[index].job_name,
                            machine_id:updatedRework[index].machine_id};
        console.log({buttonType:buttonType})
        if (buttonType === "ok") {
          newValues.status = 2;
          console.log({"this1":newValues});
          // Call insertInStationyyyyFirstNextStation here
         
          const  updateJobsfromSupervisorDashPromise = updateJobsfromSupervisorDash(newValues)
          updateJobsfromSupervisorDashPromise.then((result)=>{
            const insertInStationyyyyFirstNextStationPromise = insertInStationyyyyFirstNextStation(insertValues)
            toast.promise(insertInStationyyyyFirstNextStationPromise,{
              loading: "Inserting data",
              error: (err) => err.msg,
              success: (result)=> {
                  return result.msg
              }
            }) 
          }).catch((err)=>{
            toast.error(err.msg)
          })
          
          setRework(updatedRework.filter((item, i) => i !== index));
        } else if (buttonType === "notOk") {
          newValues.status = -2;
         
          
          console.log(newValues);
          // You can handle any other logic for "Not Ok" here if needed
          updateJobsfromSupervisorDash(newValues)
            .then(() => {
              toast.success("Job updated at the station for rework");
            })
            .catch((error) => {
              toast.error(error.msg);
            });

            setRework(updatedRework.filter((item, i) => i !== index));
        } else if (buttonType === "rework") {
          newValues.status = -3;

          // console.log(newValues);
          // Call updateJobesAtStation here
          updateJobsfromSupervisorDash(newValues)
            .then(() => {
              toast.success("Job updated at the station for rework");
            })
            .catch((error) => {
              toast.error(error.msg);
            });
            setRework(updatedRework.filter((item, i) => i !== index));
        }
        
      };
    
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
                                            <Button variant="success"
                                            onClick={() => handleButtonClick(index, "ok")}
                                            >Ok</Button>
                                        </td>
                                        <td>
                                            <Button variant="danger"
                                            onClick={() => handleButtonClick(index, "notOk")}
                                            >Not Ok</Button>
                                        </td>
                                        <td>
                                            <Button variant="warning"
                                            onClick={() => handleButtonClick(index, "rework")}
                                            >Rework</Button>
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