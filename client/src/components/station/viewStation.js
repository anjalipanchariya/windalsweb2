import React, { useEffect, useState } from 'react';
import { getStations, getInfoFromStationMasterWithMachine} from '../../helper/helper';
import toast, { Toaster } from 'react-hot-toast';
import Table from '../table';
import WindalsNav from '../navbar';
import Footer from '../footer';


function ViewStation() {
  const [stations, setStations] = useState([]);
  const columns = [
    { field: 'process_number', label: 'Process Number' },
    { field: 'station_name', label: 'Process Name' },
    { field: 'product_name', label: 'Product Name' },
    { field: 'report', label: 'Report' },
    { field: 'station_parameters', label: 'Station Parameters' },
    { field: 'machine_name', label: 'Machine Name' },
    { field: 'cycle_time', label: 'Cycle Time' },
    { field: 'daily_count', label: 'Daily Count' },
    { field: 'product_per_hour', label: 'Product per hour' },
    { field: 'next_station_name', label: 'Next Station Name' },
    // { field: 'multiple_machine', label: 'Multiple Machine' },
  ];
  console.log(stations);

  useEffect(() => {
    // Fetch stations data
    const fetchData = async () => {
      try {
        // const result = await getStations();
        const result = await getInfoFromStationMasterWithMachine();
        const modifiedStations = result.map((station) => {
          if (station.report === 1) {
            station.report = "parameters";
          } else if (station.report === 0) {
            station.report = "Ok/NotOk";
          }
          if(station.next_station_name===null){
            station.next_station_name = "Not configured yet"
          }

          if(station.multiple_machine === 1){
            station.multiple_machine = "Yes"
          }

          else if(station.multiple_machine === 0){
            station.multiple_machine = "No"
          }
          return station;
        });
        setStations(modifiedStations);
        toast.success(<b>Data fetched successfully</b>);
      } catch (error) {
        toast.error(error.message || 'An error occurred');
      }
    };

    // Call the fetchData function
    fetchData();
  }, []); // Empty dependency array to run only once

  return (
    <>
    <WindalsNav/>
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div style={{marginTop:'15vh'}}>
      <Table columns={columns} data={stations} />
      </div>
      <br />
      <br />
      <Footer/>
    </>
  );
}

export default ViewStation;
