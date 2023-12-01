import React, { useEffect, useState } from 'react';
import { getShift } from '../../helper/helper';
import toast, { Toaster } from 'react-hot-toast';
import Table from '../table';
import WindalsNav from '../navbar';
import Footer from '../footer';
function ViewShifts() { // Changed the function name to start with an uppercase letter

  const [shifts, setShifts] = useState([]);

  const columns = [
    { field: 'shift_id', label: 'ID' },
    { field: 'shift_name', label: 'Shift Name' },
    { field: 'start_time', label: 'Start Time' },
    { field: 'end_time', label: 'End Time' },
    { field: 'active', label: 'Active' },
  ];
  
  useEffect(() => {
    const getShiftInfoPromise = getShift();

    toast.promise(getShiftInfoPromise, { // Changed toast.process to toast.promise
      loading: "Fetching data",
      success: (result) => {
        setShifts(result);
        toast.success(<b>Data fetched successfully</b>);
      },
      error: (err) => {
        toast.error(err.msg);
      },
    });
  }, []);

  return (
    <>
    <WindalsNav/>
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div style={{marginTop:'20vh'}}>
      <h1 className='heading'>Shift Details</h1>
      <Table columns={columns} data={shifts} />
      </div>
      <br />
      <br />
      <Footer/>
    </>
  );
}

export default ViewShifts;
