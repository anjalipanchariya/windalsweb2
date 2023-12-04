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
  getWorkAtStationInDay,
  getOneEmployee,
  getCurrentShift,
  getOneWorkerStation,
  getOneProductAllParameters,
  getParameterStatus,
  getOneStationOneProductMachinesData
} from '../../helper/helper';
import { useNavigate, useParams } from 'react-router-dom';
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
  const [parametermap, setparametermap] = useState({});
  const [OneProductStationParameters, setOneProductStationParameters] = useState([]);
  const [parameterNames, setParameterNames] = useState([]); // Store parameter names as an array
  const [workAtStationInDay, setWorkAtStationInDay] = useState([])
  const [employeeData, setEmployeeData] = useState("");
  const [activeShift, setActiveShift] = useState("");
  const [stations, setStations] = useState([]);
  const [machines, setMachines] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState("")
  const [selectedStation, setSelectedStation] = useState("")
  const navigate = useNavigate()



  const formik = useFormik({
    initialValues: {
      selectedJob: null,
      status: "",  //1-ok,0-rework,-1-rejected
      reason: "",
      parameterValues: {}
    },
    // validationSchema: validateYupSchema,
    onSubmit: (values) => {
      console.log({ "this": values })
      const updateJobeAtStationPromise = updateJobesAtStation(values, stationOneProductInfo[0].station_id, employeeId, selectedMachine.machine_id)
      updateJobeAtStationPromise.then((result) => {
        toast.success(result.msg)
        if (values["status"] == '1') {
          const newValues = {
            job_name: values.selectedJob.job_name,
            product_name: product_name,
            station_id: stationOneProductInfo[0].station_id,
            machine_id: selectedMachine.machine_id
          }
          // console.log({newValues:newValues});
          const insertInStationyyyyFirstNextStationPromise = insertInStationyyyyFirstNextStation(newValues)
          insertInStationyyyyFirstNextStationPromise.then((result) => {
            toast.success(result.msg)
            getSubmitedJobs()
            formik.resetForm()
            setDropdownOptions([])
            setDropdownPosition(null)
            closeModal()
            setJobesAtStationFunction()
          }).catch((err) => {
            toast.error(err.msg)
            console.log(err);
          })
        }
        else {
          getSubmitedJobs()
          formik.resetForm()
          setDropdownOptions([])
          setDropdownPosition(null)
          closeModal()
          setJobesAtStationFunction()
        }
      }).catch((err) => {
        toast.error(err.msg)
        console.log(err);
      })
    }
  })

  useEffect(() => {
    if (stationName !== "") {
      setSelectedStation(stationName)
    }
  }, [stationName])

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
          setStations(result);
          return "data fetched";
        },
        error: (err) => {
          return err.msg;
        },
      });
    }
  }, [employeeData, activeShift]);

  useEffect(() => {
    const getStationAllInfoPromise = getOneStation(stationName);
    getStationAllInfoPromise.then((result) => {
      setStationAllInfo(result);
    }).catch((err) => {
      toast.error(err.msg);
    });
  }, [selectedStation]);

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
      if (stationOneProductInfo[0].station_parameters != null) {
        const parameterNamesArray = stationOneProductInfo[0].station_parameters.split(',');
        setParameterNames(parameterNamesArray);
      }
    }
    else {
      setWorkAtStationInDay([])
      setJobsAtStation([])
    }
  }, [product_name]);

  useEffect(() => {
    if (product_name !== "" && parameterNames.length !== 0) {
      const getParameterStatusPromise = getParameterStatus(parameterNames, product_name);
      getParameterStatusPromise.then((result) => {
        setOneProductStationParameters(result.result);
        // console.log(result.result);
      }).catch((err) => {
        toast.error(err.msg);
      });
    }
  }, [parameterNames, product_name]);
  // console.log(OneProductStationParameters)
  // useEffect(() => {
  //   setOneProductStationParameters([
  //     {
  //       "parameter": "length",
  //       "value_oknotok": 0
  //     },
  //     {
  //       "parameter": "width",
  //       "value_oknotok": 1
  //     }
  //   ])


  // }, [])

  useEffect(() => {
    if (stationOneProductInfo.length > 0) {
      setJobesAtStationFunction()
    }
  }, [stationOneProductInfo]);

  useEffect(() => {
    if (stationOneProductInfo != "") {
      getSubmitedJobs()
      const getOneStationMachineDataPromise = getOneStationOneProductMachinesData(stationOneProductInfo[0].station_id)
      toast.promise(getOneStationMachineDataPromise, {
        loading: "Getting machines data of this station",
        success: (result) => {
          setMachines(result);
          return "data fetched";
        },
        error: (err) => {
          return err.msg;
        },
      });
    }
  }, [stationOneProductInfo])

  const setJobesAtStationFunction = () => {
    const getJobesAtStationPromise = getJobesAtStation(stationOneProductInfo[0].station_id, stationOneProductInfo[0].product_name);
    getJobesAtStationPromise.then((result) => {
      setJobsAtStation(result);
    }).catch((err) => {
      toast.error(err.msg);
    });
  }

  const getSubmitedJobs = () => {
    if (stationOneProductInfo != "") {
      const stationId = stationOneProductInfo[0].station_id
      const getWorkAtStationInDayPromise = getWorkAtStationInDay(stationId)
      getWorkAtStationInDayPromise.then((result) => {
        setWorkAtStationInDay(result)
      }).catch((err) => {
        console.log(err);
        toast.error(err.msg)
      })
    }
  }

  const handleJobIdClick = async (job, event) => {
    formik.setFieldValue("selectedJob", job);
    const rect = event.target.getBoundingClientRect();
    console.log(rect)
    const middleTop = (window.innerHeight - rect.height);
    setDropdownPosition({
      top: middleTop,
      left: rect.left*2,
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


    formik.setFieldValue("parameterValues", parametersObject)

    const options = stationOneProductInfo.length > 0 && stationOneProductInfo[0].report === 1
      ? ['✅ Ok', '❌ Not Okay', 'Parameters']
      : ['✅ Ok', '❌ Not Okay'];
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
      formik.setFieldValue("status", 1)
      const parametersObject = formik.values.parameterValues;
      for (const it of OneProductStationParameters) {
        if (it['value_oknotok'] === 0 && parametersObject[it['parameter']] === '') {
          parametersObject[it['parameter']] = 'O';
        }
      }
      formik.setFieldValue("parameterValues", parametersObject)
      formik.handleSubmit()
    } else if (option === '❌ Not Okay') {
      formik.setFieldValue("status", -1)
      const parametersObject = formik.values.parameterValues;
      for (const it of OneProductStationParameters) {
        if (it['value_oknotok'] === 0 && parametersObject[it['parameter']] === '') {
          parametersObject[it['parameter']] = 'N';
        }
      }
      formik.setFieldValue("parameterValues", parametersObject)
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

  const handleStationSelection = (target) => {
    // Use the selectedStation value to construct the path or page you want to navigate to
    setSelectedMachine([])
    setMachines([])
    setWorkAtStationInDay([])
    setOneProductStationParameters([])
    setJobsAtStation([])
    setProductName("")
    setAvailableProducts([])
    setStationOneProductInfo("")
    setStationAllInfo("")

    const selectedIndex = parseInt(target.options[target.selectedIndex].getAttribute("data-index"), 10);

    if (selectedIndex !== -1) {
      const selectedStation = stations[selectedIndex];
      // console.log(selectedStation);
      if (selectedStation.position === 1) {
        navigate(`/FirstStation/${employeeData[0].employee_id}/${employeeData[0].user_name}/${selectedStation.station_name}`);
      }
      else {
        navigate(`/Station/${employeeData[0].employee_id}/${employeeData[0].user_name}/${selectedStation.station_name}`);
      }
    }

  };

  const handleMachineSelection = (selectedMachine) => {
    setSelectedMachine(selectedMachine);
  };

  // console.log({ jobsAtStation: jobsAtStation, stationOneProductInfo: stationOneProductInfo, stationAllInfo: stationAllInfo, formikvalues: formik.values, parameterNames: parameterNames, workAtStationInDay: workAtStationInDay });
  // console.log(parameterNames)
  // console.log(formik.values.parameterValues)
  return (
    <div className="firststat">
      <WindalsNav />
      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <h1>Station {stationName}</h1>

      <div className="divide">
        <div className='fslist'>
          <h5 className='sbox'>Station Name : {stationName}</h5>
          <h5 className='sbox'>Employee Id : {employeeId}</h5>
          <h5 className='sbox'>User Name : {userName}</h5>
        </div>

        <div className="workerform">
          <div style={{ fontSize: '1.2rem' }}>
            <label style={{ margin: 6, fontWeight: 500 }}>Select a Station: </label>
            <select value={stationName} onChange={(e) => handleStationSelection(e.target)}>
              <option value="" data-index={-1}>Select a station</option>
              {stations.map((station, index) => (
                <option key={index} value={station.station_name} data-index={index}>
                  {station.station_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{marginBottom:'2vh'}}>
            <label style={{ fontSize: '1.5rem', marginTop:'4vh' }}  htmlFor="productSelect">Select a Product:</label>
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
            <label style={{ fontSize: '1.5rem', marginTop:'4vh' }}>Select a Machine: </label>
            <select onChange={(e) => handleMachineSelection(JSON.parse(e.target.value))}>
              <option value="">Select a machine</option>
              {machines.map((machine, index) => (
                <option key={index} value={JSON.stringify(machine)}>
                  {machine.machine_name}
                </option>
              ))}
            </select>
          </div>

          {stationOneProductInfo[0] && product_name !== "" &&
            <div className='params'>
              <table className='first_table'>
                <tbody>
                  <tr>
                    <td>Daily Count:</td>
                    <td>{selectedMachine.daily_count ? selectedMachine.daily_count : "alert:Select machine first"}</td>
                  </tr>
                  <tr>
                    <td>Cycle Time: </td>
                    <td>{selectedMachine.cycle_time ? selectedMachine.cycle_time : "alert:Select machine first"}</td>
                  </tr>
                  <tr>
                    <td>Product per hour:</td>
                    <td>{selectedMachine.product_per_hour ? selectedMachine.product_per_hour : "alert:Select machine first"}</td>
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

          <p style={{ fontSize: '1.5rem', fontWeight: "bold", marginTop:'4vh' }}>Jobs At Station</p>
          <ul>
            {jobsAtStation.length > 0 ? jobsAtStation.map((job) => (
              <li
                key={job.job_id}
                onClick={(e) => handleJobIdClick(job, e)}
                style={{ cursor: 'pointer', }}
              >
                {job.job_name}
              </li>
            )) : product_name == "" ? "Product is not selected" : "No Jobs"}
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
                      OneProductStationParameters.map((parameter) => (
                        <div key={parameter.parameter}>
                          <label>{parameter.parameter}</label>
                          {parameter.value_oknotok === 1 ?
                            <input type="number"
                              placeholder="Enter the value"
                              onChange={(e) => setParameterValue(parameter.parameter, e.target.value)} /> :
                            <input type='checkbox' value='O' onChange={(e) => {
                              if (e.target.checked) {
                                setParameterValue(parameter.parameter, 'Y')
                              }
                              else setParameterValue(parameter.parameter, 'N')
                            }} />}
                        </div>
                      ))
                    )
                  }
                })}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginLeft: '10vw' }}>
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Example Modal"
          className='reasonmodal'
        >
          <h2>Reason</h2>
          <label htmlFor="reason">Enter a reason</label>
          <input type="text" name="reason" id="reason" value={formik.values.reason} onChange={formik.handleChange} />
          
          <button className="buttoncss" onClick={formik.handleSubmit}>Submit</button>
          
          <button className="buttoncss" onClick={closeModal}>Close Modal</button>
          

        </Modal>
      </div>
      {
        workAtStationInDay.length > 0 ?
          <div className='jobsub'>
            <h2>Jobs Submitted</h2>
            <table className="first_table">
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
                    <td>{(job.status == 1) ? "OK" : "Not-Ok"}</td>
                    <td>{(job.reason != "" || job.reason != null) ? job.reason : "N.A"}</td>
                    <td>{(job.parameters != "" || job.parameters != null) ? job.parameters : "N.A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          : null
      }
     

      <Footer />
    </div>
  );
};

export default StationPage;
