import React, { useEffect, useState } from 'react';
import { getStations } from '../../helper/helper';
import toast, { Toaster } from 'react-hot-toast';
import Table from '../table';
import WindalsNav from '../navbar';
import Footer from '../footer';


function ViewStation() {
  const [stations, setStations] = useState([]);
  const columns = [
    { field: 'station_id', label: 'Station ID' },
    { field: 'station_name', label: 'Station Name' },
    { field: 'product_name', label: 'Product Name' },
    { field: 'report', label: 'Report' },
    { field: 'station_parameters', label: 'Station Parameters' },
    { field: 'cycle_time', label: 'Cycle Time' },
    { field: 'daily_count', label: 'Daily Count' },
    { field: 'product_per_hour', label: 'Product Per Hour' },
    { field: 'next_station_name', label: 'Next Station Name' },
  ];
  console.log(stations);

  useEffect(() => {
    // Fetch stations data
    const fetchData = async () => {
      try {
        const result = await getStations();
        const modifiedStations = result.map((station) => {
          if (station.report === 1) {
            station.report = "parameters";
          } else if (station.report === 0) {
            station.report = "Ok/NotOk";
          }
          if(station.next_station_name===null){
            station.next_station_name = "Not configured yet"
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
