import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './firstStation.css';
import '../product/addProduct.css'
import Footer from '../footer';
import { getOneStation, createJobId, insertInStationyyyyFirst, insertInStationyyyyFirstNextStation, getWorkAtStationInDay, logout, getOneWorkerStation, getOneEmployee, getCurrentShift, getOneStationOneProductMachinesData } from '../../helper/helper';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from "formik";
import WindalsNav from '../navbar';
import Table from '../table'

const FirstStation = () => {

    const { employeeId, userName, stationName } = useParams();
    const [stationAllInfo, setStationAllInfo] = useState("");
    const [stationOneProductInfo, setStationOneProductInfo] = useState("");
    const [availableProducts, setAvailableProducts] = useState([]);
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
            job_name: "",
            product_name: ""
        },
        onSubmit: (values) => {
            const newValues = {
                ...values,
                station_id: stationOneProductInfo[0].station_id,
                employee_id: employeeId,
                machine_id: selectedMachine.machine_id
            }
            console.log({ newValues: newValues });
            const createJobIdPromise = createJobId(newValues)
            createJobIdPromise.then((createJobResult) => {
                console.log({ createJobResult: createJobResult });
                if (formik.values.product_name) {
                    const insertInStationyyyyFirstPromise = insertInStationyyyyFirst(newValues)
                    insertInStationyyyyFirstPromise.then((insertInStationyyyyResult) => {
                        console.log({ insertInStationyyyyResult: insertInStationyyyyResult });
                        const insertInStationyyyyFirstNextStationPromise = insertInStationyyyyFirstNextStation(newValues)
                        insertInStationyyyyFirstNextStationPromise.then((insertInStationyyyyFirstNextResult) => {
                            toast.success(insertInStationyyyyFirstNextResult.msg)
                            getSubmitedJobs()
                        }).catch((insertInStationyyyyFirstNextErr) => {
                            toast.error(insertInStationyyyyFirstNextErr.msg)
                        })
                    }).catch((insertInStationyyyyErr) => {
                        toast.error(insertInStationyyyyErr.msg)
                    })
                    formik.setFieldValue('job_name', "")
                }
            }).catch((createJobErr) => {
                toast.error(createJobErr.msg)
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

    useEffect(() => {
        const getStationAllInfoPromise = getOneStation(stationName)
        getStationAllInfoPromise.then((result) => {
            setStationAllInfo(result)
        }).catch((err) => {
            toast.error(err.msg)
        })
    }, []);

    useEffect(() => {
        if (stationAllInfo.length > 0) {
            const productNames = [...new Set(stationAllInfo.map((station) => station.product_name))];
            setAvailableProducts(productNames);
        }
    }, [stationAllInfo])

    useEffect(() => {
        if (formik.values.product_name !== "") {
            const stationOneProductInfo = stationAllInfo.filter((station) => {
                return station.station_name === stationName && station.product_name === formik.values.product_name;
            });
            setStationOneProductInfo(stationOneProductInfo);
        }
    }, [formik.values.product_name])

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

    const handleStationSelection = (target) => {
        // Use the selectedStation value to construct the path or page you want to navigate to
        const selectedIndex = parseInt(target.options[target.selectedIndex].getAttribute("data-index"), 10);

        if (selectedIndex !== -1) {
            const selectedStation = stations[selectedIndex];
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


    // console.log({"stationOneProductInfo":stationOneProductInfo,"stationAllinfo":stationAllInfo});
    console.log({ "workAtStationInDay": workAtStationInDay, selectedMachine: selectedMachine });
    return (

        <>
            <WindalsNav />
            <Toaster position="top-center" reverseOrder={false}></Toaster>
            {/* <button onClick={()=>{logout()}}>Log Out</button> */}

            <div className="firststat">
                <h1>First Station</h1>

                <div className='divide'>
                    <div className='fslist'>
                        {/* <h3>Worker Details</h3> */}
                        <h5 className='sbox'>Station Name : {stationName}</h5>
                        <h5 className='sbox'>Employee ID : {employeeId}</h5>
                        <h5 className='sbox'>Username : {userName}</h5>
                    </div>

                    <div className='workerform'>
                    <div style={{ fontSize: '1.2rem' }}>
                        <label style={{ margin: 6, fontWeight: 500 }}>Select a Station: </label>
                        <select style={{ margin: 6 }} value={stationName} onChange={(e) => handleStationSelection(e.target)}>
                            <option value="" data-index={-1}>Select a station</option>
                            {stations.map((station, index) => (
                                <option key={index} value={station.station_name} data-index={index}>
                                    {station.station_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label style={{ fontSize: '1.5rem', marginTop:'4vh' }} htmlFor="job_nameInput">Enter the Job Name</label>
                        <input
                            type="text"
                            className='jobnameinp'
                            id="job_nameInput"
                            value={formik.values.job_name}
                            name="job_name"
                            onChange={formik.handleChange}
                            style={{ width: '40%',height:'4vh', border:'1px solid black' }}
                        />
                    </div>

                    <div className="form-group">
                        <label style={{ fontSize: '1.5rem', marginTop:'4vh' }} htmlFor="productSelect">Select a Product:</label>
                        <select
                            id="productSelect"
                            value={formik.values.product_name}
                            name="product_name"
                            onChange={formik.handleChange}
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
                        <br />
                        <br />
                        <button className="btn btn-danger" style={{ width: 200, marginBottom: '10vh' }} onClick={formik.handleSubmit}>
                            Add Product
                        </button>
                    </div>

                    {workAtStationInDay.length > 0 ?
                        <div className='jobsub'>
                            <h2>Jobs Submitted</h2>
                            <table className="product-table" style={{ width: '80%', marginLeft: '40px' }}>
                                <thead>
                                    <tr>
                                        <th>Product Name</th>
                                        <th>Job Name</th>
                                        <th>Status</th>
                                        <th>Reason</th>
                                        <th>Parameter values</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(workAtStationInDay) && workAtStationInDay.map((job, index) => (
                                        <tr key={index}>
                                            <td>{job.product_name}</td>
                                            <td>{job.job_name}</td>
                                            <td>{job.status == 1 ? "OK" : "Not-Ok"}</td>
                                            <td>{(job.reason != "" || job.reason != null) ? job.reason : "N.A"}</td>
                                            <td>{(job.parameters != "" || job.parameters != null) ? job.parameters : "N.A"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        : null}
                </div>

                </div>


                











                <br />
                <br />
                <br />
                <Footer />
            </div>
        </>
    );
};

export default FirstStation;