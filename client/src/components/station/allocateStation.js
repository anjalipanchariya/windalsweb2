import React, { useEffect, useState } from "react";
import { Table, Button, Form, Alert } from 'react-bootstrap';
import Select from 'react-select'
import { useFormik } from "formik";
import toast, { Toaster } from 'react-hot-toast';
import Multiselect from "multiselect-react-dropdown";
import { getAllStationNames, getAllWorkerNames, addStationAllocation, getActiveShiftNames, getWorkerAllocation, getAllStationsAndMachinesInfo } from "../../helper/helper";
import WindalsNav from "../navbar";
import * as Yup from "yup";
import Footer from '../footer';
import './allocateStation.css';


function StationAllocation() {
    const today = new Date();

    const [workers, setWorkers] = useState([]);
    const [workersCompleteName, setWorkersCompleteName] = useState({});
    const [stations, setStations] = useState([]);
    const [allocationStation, setAllocationStation] = useState([]);
    const [availableWorkerNames, setAvailableWorkerNames] = useState([]);
    const [selectedWorkers, setSelectedWorkers] = useState([]); // Maintain a list of selected workers
    const [activeShiftNames, setActiveShiftNames] = useState([]);
    const [allocatedData, setallocatedData] = useState([]);

    useEffect(() => {
        fetchStationsAndWorkers();
        const getActiveShiftNamesPromise = getActiveShiftNames()
        getActiveShiftNamesPromise.then((result) => {
            setActiveShiftNames(result)
        }).catch((err) => {
            toast.error(err.msg)
        })
    }, []);

    const fetchStationsAndWorkers = async () => {
        try {
            const stationAndMachineInfo = await getAllStationsAndMachinesInfo();
            setStations(stationAndMachineInfo);

            const workerNames = await getAllWorkerNames();
            setWorkers(workerNames);

            const tempObj = {};

            for (const w of workerNames) {
                const { first_name, last_name, employee_id, user_name } = w;
                tempObj[first_name + " " + last_name + " " + user_name] = { employee_id, name: first_name + " " + last_name + " " + user_name };
            }

            setWorkersCompleteName(tempObj);

            // Initialize allocationStation based on stations
            const initialAllocationStation = stationAndMachineInfo.map((station) => ({
                station_id: station.station_id,
                station_name: station.station_name,
                machine_id: station.machine_id,
                machine_name: station.machine_name,
                workers: [],
            }));
            setAllocationStation(initialAllocationStation);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };


    const allocateStationSchema = Yup.object().shape({
        date: Yup.string()
            .test(
                'is-present-or-future',
                'Date must be in the present or future',
                function (value) {
                    const currentDate = new Date().toISOString().substring(0, 10); // Get current date as a string in YYYY-MM-DD format
                    return !value || value >= currentDate;
                }
            )
            .required('Date is required'),
        shift: Yup.object().required('Shift is required'),
    })

    function fetchData() {
        try {
            setAllocationStation(JSON.parse(localStorage.getItem('allocationdata'))['stationAllocations']);
            formik.setFieldValue("stationAllocations", allocationStation);
        } catch (error) {
            console.error("Error fetching data:", error);
        }

    }


    const formik = useFormik({
        initialValues: {
            date: today.toISOString().substring(0, 10),
            shift: '',
            stationAllocations: allocationStation,
        },
        validationSchema: allocateStationSchema,
        onSubmit: (values) => {

            // Ensure that all stations have at least one worker
            const isValid = values.stationAllocations.every(
                (allocation) => allocation.workers.length > 0
            );

            if (!isValid) {
                toast.error("All stations must have at least one worker.");
            } else {
                const tempdata = {
                    date: values.date,
                    shift: values.shift.value,
                    stationAllocations: allocationStation
                }
                localStorage.setItem('allocationdata', JSON.stringify(tempdata));

                // Map selected names to employee_ids when submitting the form
                const stationAllocationsWithEmployeeIds = values.stationAllocations.map((allocation) => ({
                    station_name: allocation.station_name,
                    station_id: allocation.station_id,
                    machine_name: allocation.machine_name,
                    machine_id: allocation.machine_id,
                    workers: allocation.workers.map((selectedName) => workersCompleteName[selectedName].employee_id),
                }));

                console.log({
                    date: values.date,
                    shift: values.shift,
                    stationAllocations: stationAllocationsWithEmployeeIds
                });
                const addStationAllocationPromise = addStationAllocation({
                    date: values.date,
                    shift: values.shift.value,
                    stationAllocations: stationAllocationsWithEmployeeIds,
                });

                toast.promise(addStationAllocationPromise, {
                    loading: "Saving data",
                    success: (result) => {
                        formik.resetForm()
                        fetchStationsAndWorkers()
                        getStationAllocationData()
                        formik.setFieldValue("stationAllocations", allocationStation)
                        return result.msg
                    },
                    error: (err) => err.msg,
                });
            }
        },
        enableReinitialize: true,
    });

    useEffect(() => {
        filterAvailableWorkerNames();
    }, [formik.values.stationAllocations]);

    function handleSelect(selectedList, selectedItem, stationIndex) {
        // console.log({ selectedItem: selectedItem, selectedList: selectedList });
        // Update the selected names for a specific station
        const updatedAllocation = [...formik.values.stationAllocations];
        updatedAllocation[stationIndex].workers = selectedList;
        formik.setFieldValue("stationAllocations", updatedAllocation);
        filterAvailableWorkerNames();
    }

    function handleRemove(selectedList, removedItem, stationIndex) {
        // console.log({ removedItem: removedItem, selectedList: selectedList });
        // Update the selected names for a specific station
        const updatedAllocation = [...formik.values.stationAllocations];
        updatedAllocation[stationIndex].workers = selectedList;
        formik.setFieldValue("stationAllocations", updatedAllocation);
        filterAvailableWorkerNames();
    }

    const filterAvailableWorkerNames = () => {
        // Combine the selected workers from all stations
        const allSelectedWorkers = formik.values.stationAllocations.flatMap((allocation) => allocation.workers);
        // Filter out workers that are already selected
        const filteredAvailableWorkerNames = workers.filter((worker) => {
            const workerName = `${worker.first_name} ${worker.last_name} ${worker.user_name}`;
            return !allSelectedWorkers.includes(workerName);
        });
        setAvailableWorkerNames(filteredAvailableWorkerNames);
    }

    useEffect(() => {
        getStationAllocationData()
    }, [])

    const getStationAllocationData = () => {
        const getAllocatedPromise = getWorkerAllocation()
        getAllocatedPromise.then(async (result) => {
            setallocatedData(result)
        }).catch((err) => { })
    }

    // console.log({ allocatedData: allocatedData });
    // console.log({date:formik.values.date});

    // console.log({ availableWorkerNames: availableWorkerNames });
    return (
        <>
            <WindalsNav />
            <Toaster position="top-center" reverseOrder={false}></Toaster>

            <div className="allocstat">
                <h1 className="heading">Allocate Station to Worker</h1>
                <div className="input-box">
                    <Form onSubmit={formik.handleSubmit}>
                        <Form.Group controlId="date" style={{display:'flex'}}>
                            <Form.Label>Date:</Form.Label>
                            <Form.Control
                            style={{width:'20%'}}
                                type="date"
                                name="date"
                                onChange={formik.handleChange}
                                value={formik.values.date}
                            />
                            {formik.touched.date && formik.errors.date && (
                                <Alert variant="danger" className="error-message">{formik.errors.date}</Alert>
                            )}
                        </Form.Group>


                        <Form.Group controlId="shift">
                            <Form.Label>Shift:</Form.Label>
                            <Select
                                options={activeShiftNames.map((shift) => ({ label: shift.shift_name, value: shift.shift_id }))}
                                value={formik.values.shift}
                                name="shift"
                                onChange={(data) => formik.setFieldValue("shift", data)}
                                isSearchable={true}
                            />
                            {formik.touched.shift && formik.errors.shift && (
                                <Alert variant="danger" className="error-message">{formik.errors.shift}</Alert>
                            )}
                        </Form.Group>

                        {/* <h5 style={{marginTop:'5vh'}}>Please submit after allocating workers in the table below</h5> */}
                        <div >
                            <table className="table" style={{ border: "1px solid #F3F3F3" }}>
                                <thead>

                                </thead>
                                <tbody>
                                    <tr>
                                        <th>#</th>
                                        <th>Station Id</th>
                                        <th>Station Name</th>
                                        <th>Machine Id</th>
                                        <th>Machine Name</th>
                                        <th>Worker</th>
                                    </tr>
                                    {formik.values.stationAllocations.map((allocation, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{allocation.station_id}</td>
                                            <td>{allocation.station_name}</td>
                                            <td>{allocation.machine_id}</td>
                                            <td>{allocation.machine_name}</td>
                                            <td>
                                                <Multiselect
                                                    isObject={false}
                                                    options={availableWorkerNames.map(
                                                        (worker) => `${worker.first_name} ${worker.last_name} ${worker.user_name}`
                                                    )}
                                                    onSelect={(selectedList, selectedItem) =>
                                                        handleSelect(selectedList, selectedItem, index)
                                                    }
                                                    onRemove={(selectedList, removedItem) =>
                                                        handleRemove(selectedList, removedItem, index)
                                                    }
                                                    selectedValues={allocation.workers}
                                                    showCheckbox
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        <Button variant="danger" type="submit" >
                            Submit
                        </Button>
                    </Form>
                    
                    {/* <Button onClick={fetchData}>
                        Fetchdata
                    </Button> */}
                </div>

                {/* <div >
                    <table className="table" style={{ border: "1px solid #F3F3F3" }}>
                        <thead>

                        </thead>
                        <tbody>
                            <tr>
                                <th>#</th>
                                <th>Station Id</th>
                                <th>Station Name</th>
                                <th>Machine Id</th>
                                <th>Machine Name</th>
                                <th>Worker</th>
                            </tr>
                            {formik.values.stationAllocations.map((allocation, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{allocation.station_id}</td>
                                    <td>{allocation.station_name}</td>
                                    <td>{allocation.machine_id}</td>
                                    <td>{allocation.machine_name}</td>
                                    <td>
                                        <Multiselect
                                            isObject={false}
                                            options={availableWorkerNames.map(
                                                (worker) => `${worker.first_name} ${worker.last_name} ${worker.user_name}`
                                            )}
                                            onSelect={(selectedList, selectedItem) =>
                                                handleSelect(selectedList, selectedItem, index)
                                            }
                                            onRemove={(selectedList, removedItem) =>
                                                handleRemove(selectedList, removedItem, index)
                                            }
                                            selectedValues={allocation.workers}
                                            showCheckbox
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div> */}
            </div>

            <Table striped responsive hover className='table' style={{ marginBottom: '15vh' }}>
                <thead>

                </thead>
                <tbody>
                    <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>Station</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>User Name</th>
                        <th>Shift Name</th>
                    </tr>
                    {

                        Array.isArray(allocatedData) && allocatedData.map((allocateddata, index) => (
                            <tr key={index}>
                                <td>
                                    {index + 1}
                                </td>
                                <td>
                                    {allocateddata.date}
                                </td>
                                <td>
                                    {allocateddata.station_name}
                                </td>
                                <td>
                                    {allocateddata.first_name}
                                </td>
                                <td>
                                    {allocateddata.last_name}
                                </td>
                                <td>
                                    {allocateddata.user_name}
                                </td>
                                <td>
                                    {allocateddata.shift_name}
                                </td>

                            </tr>
                        ))
                    }

                </tbody>
            </Table>

            <Footer />
        </>
    );
}

export default StationAllocation;
