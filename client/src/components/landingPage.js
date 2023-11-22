import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WindalsNav from './navbar';
import Footer from './footer';
import { useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { getOneEmployee, getCurrentShift, getOneWorkerStation } from '../helper/helper';

function LandingPage() {
  const { userName } = useParams();
  const [employeeData, setEmployeeData] = useState("");
  const [activeShift, setActiveShift] = useState("");
  const [stations, setStations] = useState([]);
  const [machines, setMachines] = useState([]);
  const [noStationAllocatedError, setNoStationAllocatedError] = useState("");
  const navigate = useNavigate()

  useEffect(() => {
    const getOneEmployeeDataPromise = getOneEmployee(userName);
    toast.promise(getOneEmployeeDataPromise, {
      loading: "Getting employee data",
      success: (result) => {
        setEmployeeData(result);
        return "data fetched";
      },
      error: (err) => {
        return err.msg;
      },
    });
    const getCurrentShiftPromise = getCurrentShift();
    getCurrentShiftPromise.then((result) => {
      setActiveShift(result.shift_id);
    }).catch((err) => {
      toast.error(err.msg);
    });
  }, []);

  useEffect(() => {
    if (userName !== 'admin' && employeeData !== "" && activeShift !== "") {
      const getOneWorkerStationPromise = getOneWorkerStation(employeeData[0].employee_id, activeShift);
      toast.promise(getOneWorkerStationPromise, {
        loading: "Getting stations allocated to employee",
        success: (result) => {
          const extractedStations = result.map(item => ({station_name:item.station_name, position:item.position}));
          const extractedMachines = result.map(item => ({ machine_id: item.machine_id, machine_name: item.machine_name }));
          setStations(extractedStations);
          setMachines(extractedMachines);
          setNoStationAllocatedError("");
          return "data fetched";
        },
        error: (err) => {
          setNoStationAllocatedError(err.msg);
          return err.msg;
        },
      });
    }
  }, [employeeData, activeShift]);

  const handleStationSelection = (target) => {
    // Use the selectedStation value to construct the path or page you want to navigate to
  const selectedIndex = parseInt(target.options[target.selectedIndex].getAttribute("data-index"), 10);
  
    if(selectedIndex!==-1)
    {
      const selectedStation = stations[selectedIndex];
      console.log(selectedStation);
      if(selectedStation.position===1)
      {
          navigate(`/FirstStation/${employeeData[0].employee_id}/${employeeData[0].user_name}/${selectedStation.station_name}`);
      }
      else
      {
          navigate(`/Station/${employeeData[0].employee_id}/${employeeData[0].user_name}/${selectedStation.station_name}`);
      }
    }
    
  };

  // console.log({ stations: stations, machines: machines });

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <WindalsNav />
      <div>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        LandingPage
        {userName === "admin" ? "admin" :
          <div>
            {noStationAllocatedError !== "" && noStationAllocatedError}
            <div>
              <label>Select a Station: </label>
              <select onChange={(e) => handleStationSelection(e.target)}>
                <option value="" data-index={-1}>Select a station</option>
                {stations.map((station, index) => (
                  <option key={index} value={station.station_name} data-index={index}>
                    {station.station_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        }
      </div>
      <Footer />
    </div>
  );
}

export default LandingPage;
