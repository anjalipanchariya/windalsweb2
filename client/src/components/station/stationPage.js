import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './stationPage.css';
import Modal from 'react-modal';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  getOneStation,
  insertInStationyyyyFirstNextStation,
  getJobesAtStation,
  updateJobesAtStation,
  logout,
  getWorkAtStationInDay
} from '../../helper/helper';
import { useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import WindalsNav from '../navbar';
import './firstStation.css'
import '../product/addProduct.css'
import Footer from '../footer';

const StationPage = () => {
  const { employeeId, userName, stationName } = useParams();
  // const stationName = "S2";
  // const employeeId = "1";
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [dropdownPosition, setDropdownPosition] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stationAllInfo, setStationAllInfo] = useState("");
  const [stationOneProductInfo, setStationOneProductInfo] = useState("");
  const [availableProducts, setAvailableProducts] = useState([]);
  const [product_name, setProductName] = useState("");
  const [jobsAtStation, setJobsAtStation] = useState([]);
  const [parameterNames, setParameterNames] = useState([]); // Store parameter names as an array
  const [workAtStationInDay,setWorkAtStationInDay] = useState([])

  const formik = useFormik({
    initialValues:{
      selectedJob:null,
      status:"",  //1-ok,0-rework,-1-rejected
      reason:"",
      parameterValues:{}
    },
    // validationSchema: validateYupSchema,
    onSubmit:(values)=>{
      const updateJobeAtStationPromise = updateJobesAtStation(values,stationOneProductInfo[0].station_id,employeeId)
      updateJobeAtStationPromise.then((result)=>{
        toast.success(result.msg)
        if(values["status"]=='1'){
          const newValues = {
            job_name:values.selectedJob.job_name,
            product_name:product_name,
            station_id:stationOneProductInfo[0].station_id
          }
          const insertInStationyyyyFirstNextStationPromise = insertInStationyyyyFirstNextStation(newValues)
          insertInStationyyyyFirstNextStationPromise.then((result)=>{
            toast.success(result.msg)
            getSubmitedJobs()
            formik.resetForm()
            setDropdownOptions([])
            setDropdownPosition(null)
            closeModal()
            setJobesAtStationFunction()
          }).catch((err)=>{
            toast.error(err.msg)
            console.log(err);
          })
        }
        else{
          getSubmitedJobs()
          formik.resetForm()
          setDropdownOptions([])
          setDropdownPosition(null)
          closeModal()
          setJobesAtStationFunction()
        }        
      }).catch((err)=>{
        toast.error(err.msg)
        console.log(err);
      }) 
    }
  })

  useEffect(() => {
    const getStationAllInfoPromise = getOneStation(stationName);
    getStationAllInfoPromise.then((result) => {
      setStationAllInfo(result);
    }).catch((err) => {
      toast.error(err.msg);
    });
  }, []);

  useEffect(() => {
    if (stationAllInfo.length > 0) {
      const productNames = [...new Set(stationAllInfo.map((station) => station.product_name))];
      setAvailableProducts(productNames);
    }
  }, [stationAllInfo]);

  useEffect(() => {
    if (product_name !== "") {
      const stationOneProductInfo = stationAllInfo.filter((station) => {
        return station.station_name === stationName && station.product_name === product_name;
      });
      setStationOneProductInfo(stationOneProductInfo);

      // Split the parameter names string into an array
      if(stationOneProductInfo[0].station_parameters!=null)
      {
        const parameterNamesArray = stationOneProductInfo[0].station_parameters.split(',');
        setParameterNames(parameterNamesArray);
      }  
    }
    else{
      setWorkAtStationInDay([])
      setJobsAtStation([])
    }
  }, [product_name]);

  useEffect(() => {
    if (stationOneProductInfo.length > 0) {
      setJobesAtStationFunction()
    }
  }, [stationOneProductInfo]);

  useEffect(()=>{
    getSubmitedJobs()
  },[stationOneProductInfo])
  
  const setJobesAtStationFunction = () => {
    const getJobesAtStationPromise = getJobesAtStation(stationOneProductInfo[0].station_id,stationOneProductInfo[0].product_name);
    getJobesAtStationPromise.then((result) => {
      setJobsAtStation(result);
    }).catch((err) => {
      toast.error(err.msg);
    });
  }

  const getSubmitedJobs = () =>{
    if(stationOneProductInfo!="")
    {
        const stationId = stationOneProductInfo[0].station_id
        const getWorkAtStationInDayPromise = getWorkAtStationInDay(stationId)
        getWorkAtStationInDayPromise.then((result)=>{
            setWorkAtStationInDay(result)
        }).catch((err)=>{
            console.log(err);
            toast.error(err.msg)
        })
    }
  }

  const handleJobIdClick = async (job, event) => {
    formik.setFieldValue("selectedJob",job);
    const rect = event.target.getBoundingClientRect();
    const middleTop = (window.innerHeight - rect.height) / 2;
    setDropdownPosition({
      top: middleTop,
      left: rect.left,
    });

    // Access the station_parameters from stationOneProductInfo
    const stationParameters = stationOneProductInfo[0]?.station_parameters;

    // Create an object with keys from station_parameters and empty strings as values
    const parametersObject = stationParameters
      ? await stationParameters.split(',').reduce((acc, paramName) => {
          acc[paramName.trim()] = '';
          return acc;
        }, {})
      : null;

    formik.setFieldValue("parameterValues",parametersObject)

    const options = stationOneProductInfo.length > 0 && stationOneProductInfo[0].report === 1
      ? ['✅ Ok', '❌ Not Okay', '↪ Rework', 'Parameters']
      : ['✅ Ok', '❌ Not Okay', '↪ Rework'];
    setDropdownOptions(options);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDropdownOptionClick = (option) => {
    if (option === '✅ Ok') {
      formik.setFieldValue("status",1)
      formik.handleSubmit()
    } else if (option === '❌ Not Okay') {
      formik.setFieldValue("status",-1)
      openModal();
    } else if (option === '↪ Rework') {
      formik.setFieldValue("status",0)
      openModal();
    }
  };

  const setParameterValue = (parameter, value) => {
    // Clone the existing parameterValues object
    const updatedParameterValues = { ...formik.values.parameterValues };
    
    // Trim the parameter name to remove leading/trailing spaces
    const trimmedParameter = parameter.trim();
    
    // Set the value for the parameter
    updatedParameterValues[trimmedParameter] = value;
    
    // Update the parameterValues field in Formik
    formik.setFieldValue("parameterValues", updatedParameterValues);
  };

  console.log({jobsAtStation:jobsAtStation,stationOneProductInfo:stationOneProductInfo,stationAllInfo:stationAllInfo,formikvalues:formik.values,parameterNames:parameterNames,workAtStationInDay:workAtStationInDay});
  return (
    <div className="firststat">
      <WindalsNav/>
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      {/* <button onClick={() => { logout() }}>Log Out</button> */}
      <h1>Station {stationName}</h1>
      <hr />
      <div className='fslist'>
      <h4>Station Name : {stationName}</h4>
      <h4>Employee Id : {employeeId}</h4>
      <h4>User Name : {userName}</h4>
      </div>
      <hr />
      <div className="form-group">
        <label style={{fontSize:'1.7rem'}} htmlFor="productSelect">Select a Product:</label>
        <select
          id="productSelect"
          value={product_name}
          name="product_name"
          onChange={(e) => {
            setProductName(e.target.value)
            closeModal()
            formik.resetForm()
          }}
        >
          <option value="">--Select Product--</option>
          {availableProducts.map((product, index) => (
            <option key={index} value={product}>
              {product}
            </option>
          ))}
        </select>
      </div>
      <br />
      {stationOneProductInfo[0] && product_name !== "" &&
        <div className='params'>
          <table className='first_table'>
            <tbody>
              <tr>
                <td>Daily Count:</td>
                <td>{stationOneProductInfo[0].daily_count}</td>
              </tr>
              <tr>
                <td>Cycle Time: </td>
                <td>{stationOneProductInfo[0].cycle_time}</td>
              </tr>
              <tr>
                <td>Product per hour:</td>
                <td>{stationOneProductInfo[0].product_per_hour}</td>
              </tr>
              <tr>
                <td>Parameters to be checked:</td>
                <td>{stationOneProductInfo[0].report === 1 ? stationOneProductInfo[0].station_parameters : "NONE"}</td>
              </tr>
            </tbody>
          </table>
          {/* <h5>Daily Count: {stationOneProductInfo[0].daily_count}</h5>
          <h5>Cycle Time: {stationOneProductInfo[0].cycle_time}</h5>
          <h5>Product per hour: {stationOneProductInfo[0].product_per_hour}</h5>
          <h5>Parameters to be checked: {stationOneProductInfo[0].report === 1 ? stationOneProductInfo[0].station_parameters : "NONE"}</h5> */}
        </div>
      }
      <hr />
      
      <br />
      <p style={{fontSize:'1.7rem', fontWeight:"bold"}}>Job At Station</p>
      <ul>
        { jobsAtStation.length>0 ? jobsAtStation.map((job) => (
          <li
            key={job.job_id}
            onClick={(e) => handleJobIdClick(job, e)}
            style={{ cursor: 'pointer' }}
          >
            {job.job_name}
          </li>
        )) : product_name == "" ? "Product is not selected" : "null"}
      </ul>

      {formik.values.selectedJob != null && (
        <div
          style={{
            position: 'absolute',
            top: dropdownPosition ? dropdownPosition.top : '0',
            left: dropdownPosition ? dropdownPosition.left : '0',
            border: '1px solid #ccc',
            background: '#fff',
            padding: '8px',
          }}
        >
          <h2> {formik.values.selectedJob.job_name}</h2>

          <ul>
            {dropdownOptions.map((option) => {
              if (option != "Parameters") {
                return (<li
                  key={option}
                  onClick={() => handleDropdownOptionClick(option)}
                  style={{ cursor: 'pointer' }}
                >
                  {option}
                </li>)
              }
              else {
                return (
                  parameterNames.map((parameter) => (
                    <div key={parameter}>
                      <label>{parameter}</label>
                      <input
                        type="number"
                        placeholder="Enter the value"
                        onChange={(e) => setParameterValue(parameter, e.target.value)}
                      />
                    </div>
                  ))
                )
              }
            })}
          </ul>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
      >
        <h2>Reason</h2>
        <div>
          <label htmlFor="reason">Enter a reason:</label>
          <input type="text" name="reason" id="reason" value={formik.values.reason} onChange={formik.handleChange} />
          <button onClick={formik.handleSubmit}>Submit</button>
          <button onClick={closeModal}>Close Modal</button>
        </div>
      </Modal>
      { 
        workAtStationInDay.length>0 ? 
          <div className='jobsub'>
            <h2>Jobs Submitted</h2>
            <table className="product-table">
                  <thead>
                      <tr>
                          <th>Job Id</th>
                          <th>Job Name</th>
                          <th>Product Name</th>
                          <th>Status</th>
                          <th>Reason</th>    
                          <th>Parameter values</th>
                      </tr>
                  </thead>
                  <tbody>
                      {Array.isArray(workAtStationInDay) && workAtStationInDay.map((job, index) => (
                          <tr key={index}>
                              <td>{job.job_id}</td>
                              <td>{job.job_name}</td>
                              <td>{job.product_name}</td>
                              <td>{ (job.status==1) ? "OK" : ( (job.status==0) ? "REWORK" : "Not-Ok")}</td>
                              <td>{(job.reason!="" || job.reason!=null) ? job.reason : "N.A"}</td>
                              <td>{(job.parameters!="" || job.parameters!=null) ? job.parameters : "N.A"}</td>
                          </tr>
                      ))}
                  </tbody>
            </table>
          </div>
        : null
      }
      <br />
      <br />
      <br />

     <Footer/>
    </div>
  );
};

export default StationPage;
