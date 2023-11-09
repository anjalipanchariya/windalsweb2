import React, { useEffect } from "react";
import { Button, Form, Modal, Table, Alert } from 'react-bootstrap';
import './addStation.css'
import { useState, useLocation } from "react";
import { useFormik } from "formik";
import { addStation, deleteStation, getOneProductAllParameters, getOneStation, getOneStationOneProduct, getProductNames, updateStation, getAllStationNames } from "../../helper/helper";
import toast, { Toaster } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import WindalsNav from "../navbar";
import * as Yup from "yup";
import Footer from '../footer';
import Select from 'react-select';
import { useParams } from "react-router-dom";


function AddStation() {
    const [productNames, setProductNames] = useState([]);
    const [productParameters, setProductParameters] = useState([]);
    const [stationData, setStationData] = useState([])
    const [showEditModal, setShowEditModal] = useState(false);

    const { userName } = useParams()

    const stationValidationSchema = Yup.object().shape({
        stationName: Yup.string().required("Required"),
        productName: Yup.string().required("Required"),
        reportType: Yup.string().required("Required"),
        // stationParameter:Yup.array().min(1, "At least one option must be selected").required("Required"),
        // cycleTime: Yup.number().min(0, "Value cannot be negative").required("Required"),
        // dailyCount: Yup.number().min(0, "Value cannot be negative").required("Required"),
        // productPerHour: Yup.number().min(0, "Value cannot be negative").required("Required"),
        // machineName: Yup.string().required("Required"),
        parameters: Yup.array().of(
            Yup.object().shape({
                machineName: Yup.string()
                    .required('Required'),
                cycleTime: Yup.number()
                    .required('Required'),
                dailyCount: Yup.number()
                    .required('Required'),
                productPerHour: Yup.number().required('Required'),
            })
        ),
    })

    const addFormFormik = useFormik({
        initialValues: {
            stationName: '',
            productName: '',
            reportType: '',
            stationParameter: [],
            // cycleTime: '',
            // dailyCount: '',
            // productPerHour: '',
            parameters: []

        },
        validationSchema: stationValidationSchema,
        onSubmit: async (values) => {
            // if(values.reportType == 1){
            //     if(values.stationParameter.lenght<=0){
            //         alert("Select atleast one parameter")
            //         return
            //     }
            // }
            const addStationPromise = addStation(values)
            toast.promise(
                addStationPromise,
                {
                    loading: 'Adding station',
                    success: (result) => {
                        addFormFormik.resetForm()
                        return result.msg
                    },
                    error: (err) => {
                        return err.msg
                    }
                }
            )
        }
    })

    const addRow = () => {
        addFormFormik.setFieldValue('parameters', [
            ...addFormFormik.values.parameters,
            { machineName: '', cycleTime: '', dailyCount: '', productPerHour: '' },
        ]);
    };

    const handleParameterChange = (index, field, value) => {
        const updatedParameters = [...addFormFormik.values.parameters];
        updatedParameters[index][field] = value;
        addFormFormik.setFieldValue('parameters', updatedParameters);
      };

    const searchValidationSchema = Yup.object().shape({
        stationName: Yup.string().required("Required"),
        productName: Yup.string().required("Required")
    })
    const searchFormFormik = useFormik({
        initialValues: {
            stationName: "",
            productName: "",
        },
        validationSchema: searchValidationSchema,
        onSubmit: (values) => {
            handleSearch()
        }
    })


    const editFormFormik = useFormik({
        initialValues: {
            stationId: '',
            stationName: '',
            productName: '',
            reportType: '',
            stationParameter: [],
            cycleTime: '',
            dailyCount: '',
            productPerHour: ''
        },
        validationSchema: stationValidationSchema,
        onSubmit: async (values) => {
            const updateStationPromise = updateStation(values)
            toast.promise(
                updateStationPromise,
                {
                    loading: "Updating data",
                    success: result => {
                        editFormFormik.resetForm();
                        setShowEditModal(false);
                        handleSearch();
                        return <b>{result.msg}</b>; // Return a React element
                    },
                    error: err => <b>{err.msg}</b>, // Return a React element
                }
            )
        }
    })

    useEffect(() => {
        const getProductNamesPromise = getProductNames()
        getProductNamesPromise.then(async (result) => {
            const productnames = await result.map((product) => product.product_name)
            setProductNames(productnames)
        }).catch((err) => { })
    }, [])

    useEffect(() => {
        if (addFormFormik.values.productName !== "" || editFormFormik.values.productName !== "") {
            const productName = addFormFormik.values.productName !== "" ? addFormFormik.values.productName : editFormFormik.values.productName
            const getProductParametersPromise = getOneProductAllParameters(productName)
            getProductParametersPromise.then(async (result) => {
                const parameters = await result.map((product) => product.parameter)
                setProductParameters(parameters)
            }).catch((err) => { })
        }
    }, [addFormFormik.values.productName, editFormFormik.values.productName])

    useEffect(() => {
        handleReportTypeChangeForAdd(addFormFormik.values.reportType)
    }, [addFormFormik.values.reportType])

    useEffect(() => {
        handleReportTypeChangeForEdit(editFormFormik.values.reportType)
    }, [editFormFormik.values.reportType])

    const handleModalClose = () => {
        editFormFormik.resetForm()
        setShowEditModal(false);
    }

    const handleReportTypeChangeForAdd = (value) => {          //use to empty stationParameters if reportType changed to ok/notok
        if (value === "0") {
            addFormFormik.setFieldValue('stationParameter', [])
        }
    };

    const handleReportTypeChangeForEdit = (value) => {          //use to empty stationParameters if reportType changed to ok/notok
        if (value === "0") {
            editFormFormik.setFieldValue('stationParameter', [])
        }
    };

    function handleSearch() {
        if (searchFormFormik.values.productName === "") {
            const getOneStationPromise = getOneStation(searchFormFormik.values.stationName)
            getOneStationPromise.then(async (result) => {
                await setStationData(result)
            }).catch((err) => {
                toast.error(err.msg)
            })
        }
        else {
            const getOneStationOneProductPromise = getOneStationOneProduct(searchFormFormik.values)
            getOneStationOneProductPromise.then(async (result) => {
                await setStationData(result)
            }).catch((err) => {
                toast.error(err.msg)
            })
        }
    }

    const handleDelete = (index, stationId) => {
        const deleteStationPromise = deleteStation(stationId)
        toast.promise(
            deleteStationPromise,
            {
                loading: "Deleting data",
                success: result => {
                    editFormFormik.resetForm()
                    searchFormFormik.resetForm()
                    setStationData([])
                    return result.msg
                },
                error: err => { return err.msg }
            }
        )

    };

    const handleEdit = (stationData) => {
        const editValues = {
            stationId: stationData.station_id,
            stationName: stationData.station_name,
            productName: stationData.product_name,
            reportType: stationData.report.toString(),
            stationParameter: stationData.station_parameters === null ? [] : stationData.station_parameters.split(', '),
            cycleTime: stationData.cycle_time,
            dailyCount: stationData.daily_count,
            productPerHour: stationData.product_per_hour
        }
        editFormFormik.setValues(editValues)
        setShowEditModal(true)
    };

    const handleParameterTickBoxChangeForAdd = (parameterName) => {
        if (addFormFormik.values.stationParameter.includes(parameterName)) {
            addFormFormik.setFieldValue(
                'stationParameter',
                addFormFormik.values.stationParameter.filter((name) => name !== parameterName)
            );
        } else {
            addFormFormik.setFieldValue(
                'stationParameter',
                [...addFormFormik.values.stationParameter, parameterName]
            );
        }
    };

    const handleParameterTickBoxChangeForEdit = (parameterName) => {
        if (editFormFormik.values.stationParameter.includes(parameterName)) {
            editFormFormik.setFieldValue(
                'stationParameter',
                editFormFormik.values.stationParameter.filter((name) => name !== parameterName)
            );
        } else {
            editFormFormik.setFieldValue(
                'stationParameter',
                [...editFormFormik.values.stationParameter, parameterName]
            );
        }
    };

    //   console.log(stationData.length);

    const [productnames, setproductnames] = useState([]);
    useEffect(() => {
        const getProductNamesPromise = getProductNames()
        const arr = [];
        getProductNamesPromise.then(async (result) => {
            const productnames = await result.map((product) => {
                return arr.push({ value: product.product_name, label: product.product_name })
            })
            setproductnames(arr)
        }).catch((err) => { })
    }, [])

    const [stationnames, setstationnames] = useState([]);
    useEffect(() => {
        const getStationNamesPromise = getAllStationNames();
        const arr = [];
        getStationNamesPromise.then(async (result) => {
            const stationnames = await result.map((station) => {
                return arr.push({ value: station.station_name, label: station.station_name })
            })
            setstationnames(arr)
        }).catch((err) => { })
    }, [])
    console.log(window.location);
    return (
        <div >
            <WindalsNav />
            <Toaster position="top-center" reverseOrder={false}></Toaster>
            {/* <div className="header-add-station">
                <h2 className="add-station-header">Add Station</h2>
            </div> */}


            <div className="add-station-container">
                <div className="add-station-inputs">
                    <Form>
                        <h3>Add Station</h3>
                        <div className="station-name-id">
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Control type="text" placeholder="Enter Station Name" value={addFormFormik.values.stationName} name="stationName" onChange={addFormFormik.handleChange} />
                                {addFormFormik.errors.stationName && addFormFormik.touched.stationName ? (
                                    <Alert variant="danger" className="error-message">{addFormFormik.errors.stationName}</Alert>) : null}
                            </Form.Group>

                            <Form.Group>
                                <Form.Select className="mb-3 select-param" aria-label="Default select example" value={addFormFormik.values.productName} name="productName" onChange={addFormFormik.handleChange}>
                                    <option values="">--Select Product--</option>
                                    {
                                        Array.isArray(productNames) && productNames.map((product, index) => (
                                            <option key={index} value={product}>{product}</option>
                                        ))
                                    }
                                </Form.Select>
                                {addFormFormik.errors.productName && addFormFormik.touched.productName ? (
                                    <Alert variant="danger" className="error-message">{addFormFormik.errors.productName}</Alert>) : null}
                            </Form.Group>
                            {/* <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Control type="text" placeholder="Work" onChange={(event) => { setWork(event.target.value) }} />
                                    <Form.Text className="text-muted">
                                    </Form.Text>
                                </Form.Group> */}

                            {/* <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Control type="number" placeholder="Enter Cycle Time(in minutes)" value={addFormFormik.values.cycleTime} name="cycleTime" onChange={addFormFormik.handleChange} />
                                { addFormFormik.errors.cycleTime && addFormFormik.touched.cycleTime ? (
                                <Alert variant="danger" className="error-message">{addFormFormik.errors.cycleTime}</Alert>) : null}
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Control type="number" placeholder="Enter Daily Count " value={addFormFormik.values.dailyCount} name="dailyCount" onChange={addFormFormik.handleChange} />
                                { addFormFormik.errors.dailyCount && addFormFormik.touched.dailyCount ? (
                                <Alert variant="danger" className="error-message">{addFormFormik.errors.dailyCount}</Alert>) : null}
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Control type="number" placeholder="Enter Product to be producted per hour" value={addFormFormik.values.productPerHour} name="productPerHour" onChange={addFormFormik.handleChange} />
                                { addFormFormik.errors.productPerHour && addFormFormik.touched.productPerHour ? (
                                <Alert variant="danger" className="error-message">{addFormFormik.errors.productPerHour}</Alert>) : null}
                            </Form.Group> */}

                            <Form.Select className="mb-3 select-param" aria-label="Default select example" value={addFormFormik.values.reportType} name="reportType" onChange={addFormFormik.handleChange}>
                                <option value=''>--Select Report Type--</option>
                                <option value="0">Okay/Not okay</option>
                                <option value="1">Parameters</option>
                            </Form.Select>
                            {addFormFormik.errors.reportType && addFormFormik.touched.reportType ? (
                                <Alert variant="danger" className="error-message">{addFormFormik.errors.reportType}</Alert>) : null}
                            {
                                addFormFormik.values.reportType === "1" &&
                                <Form>
                                    <h3>Select Parameters:</h3>
                                    {productParameters.map((parameter, index) => (
                                        <div key={index}>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={addFormFormik.values.stationParameter.includes(parameter)}
                                                    onChange={() => handleParameterTickBoxChangeForAdd(parameter)}
                                                />
                                                {parameter}
                                            </label>
                                            {addFormFormik.errors.stationParameter && addFormFormik.touched.stationParameter ? (
                                                <Alert variant="danger" className="error-message">{addFormFormik.errors.stationParameter}</Alert>) : null}
                                        </div>
                                    ))}
                                </Form>
                            }

                            <Form.Group className="mb-3" controlId="formBasicCheckbox" style={{ width: '12vw' }}>
                                <Form.Check type="checkbox" label="Multiple Machines" />
                            </Form.Group>

                            <Button variant="danger" type="button" className="add-button-stn" onClick={addRow}>Add Machines</Button>
                            <div className="machinetab">

                                <br />
                                <table>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Machine Name</th>
                                            <th>Cycle time</th>
                                            <th>Daily Count</th>
                                            <th>Product per hour</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {/* <tr>
                                            <td><input type="text" /></td>
                                            <td><input type="number" /></td>
                                            <td><input type="number" /></td>
                                            <td><input type="number" /></td>
                                        </tr> */}

                                        {addFormFormik.values.parameters.map((parameter, index) => (
                                            <tr key={index} className={index % 2 === 0 ? 'light-red-row' : 'red-row'}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        value={parameter.machineName}
                                                        onChange={(e) =>
                                                            handleParameterChange(index, 'parameterName', e.target.value)
                                                        }
                                                        name={`parameters[${index}].parameterName`}
                                                    />
                                                    {addFormFormik.touched.parameters && addFormFormik.touched.parameters[index] && addFormFormik.errors.parameters?.[index]?.parameterName && (
                                                        <Alert variant="danger" className="error-message">
                                                            {addFormFormik.errors.parameters[index].machineName}
                                                        </Alert>
                                                    )}
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        value={parameter.cycleTime}
                                                        onChange={(e) =>
                                                            handleParameterChange(index, 'maxVal', e.target.value)
                                                        }
                                                        name={`parameters[${index}].maxVal`}
                                                    />
                                                    {addFormFormik.touched.parameters && addFormFormik.touched.parameters[index] && addFormFormik.errors.parameters?.[index]?.maxVal && (
                                                        <Alert variant="danger" className="error-message">
                                                            {addFormFormik.errors.parameters[index].cycleTime}
                                                        </Alert>
                                                    )}
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        value={parameter.dailyCount}
                                                        onChange={(e) =>
                                                            handleParameterChange(index, 'minVal', e.target.value)
                                                        }
                                                        name={`parameters[${index}].minVal`}
                                                    />
                                                    {addFormFormik.touched.parameters && addFormFormik.touched.parameters[index] && addFormFormik.errors.parameters?.[index]?.minVal && (
                                                        <Alert variant="danger" className="error-message">
                                                            {addFormFormik.errors.parameters[index].dailyCount}
                                                        </Alert>
                                                    )}
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        value={parameter.productPerHour}
                                                        onChange={(e) =>
                                                            handleParameterChange(index, 'unit', e.target.value)
                                                        }
                                                        name={`parameters[${index}].unit`}
                                                    />
                                                    {addFormFormik.touched.parameters && addFormFormik.touched.parameters[index] && addFormFormik.errors.parameters?.[index]?.unit && (
                                                        <Alert variant="danger" className="error-message">
                                                            {addFormFormik.errors.parameters[index].productPerHour}
                                                        </Alert>
                                                    )}
                                                </td>
                                                
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <br />

                        <div className="add-station-button">
                            <Button variant="danger" type="button" className="add-button-stn" onClick={addFormFormik.handleSubmit}>Add Station</Button>
                        </div>
                    </Form>
                </div>
                <div className="search-station-form">
                    <h4>Search station </h4>
                    <br />
                    <h5>Enter Station Name</h5>
                    <Select
                        className="select"
                        options={stationnames}
                        value={{
                            value: searchFormFormik.values.stationName,
                            label: searchFormFormik.values.stationName
                        }}
                        onChange={(selectedOption) =>
                            searchFormFormik.setFieldValue('stationName', selectedOption.value)
                        }
                        name="stationName"
                        isSearchable={true}
                    />
                    <br />
                    <h5>Enter product name</h5>
                    <Select
                        className="select"
                        options={productnames}
                        value={{
                            value: searchFormFormik.values.productName,
                            label: searchFormFormik.values.productName
                        }}
                        onChange={(selectedOption) =>
                            searchFormFormik.setFieldValue('productName', selectedOption.value)
                        }
                        name="productName"
                        isSearchable={true}
                    />
                    <br />
                    {/* <Form>
                        <Form.Group className="mb-3" aria-label="formBasicEmail">
                            <Form.Control type="text" placeholder="Enter Station Name" value={searchFormFormik.values.stationName} name="stationName" onChange={searchFormFormik.handleChange}/>
                            { searchFormFormik.errors.stationName ? (
                                <Alert variant="danger" className="error-message">{searchFormFormik.errors.stationName}</Alert>) : null}
                        </Form.Group>

                        <Form.Group className="mb-3" aria-label="formBasicEmail">
                            <Form.Control type="text" placeholder="Enter Product Name" value={searchFormFormik.values.productName} name="productName" onChange={searchFormFormik.handleChange}/>
                            { searchFormFormik.errors.productName ? (
                                <Alert variant="danger" className="error-message">{searchFormFormik.errors.productName}</Alert>) : null}
                        </Form.Group>
                    </Form> */}
                    <Button variant="danger" className="search-station-button" onClick={searchFormFormik.handleSubmit}>Search</Button>
                </div>
            </div>

            <div>
                {stationData.length > 0 ?
                    <Table striped responsive hover className='table'>
                        <thead>

                        </thead>
                        <tbody>

                            <tr>
                                <th>#</th>
                                <th>Station Name</th>
                                <th>Product Name</th>
                                <th>Report Type</th>
                                <th>Station parameters</th>
                                {/* <th>Next station Name</th> */}
                                <th>Station cycle time</th>
                                <th>Station product count</th>
                                <th>Station product per hour</th>
                                <th>Press to Edit</th>
                                <th>Press to delete row</th>
                            </tr>
                            {
                                Array.isArray(stationData) && stationData.map((stationdata, index) => (

                                    <tr key={index}>
                                        <td>
                                            {index + 1}
                                        </td>
                                        <td>
                                            {stationdata.station_name}
                                        </td>
                                        <td>
                                            {stationdata.product_name}
                                        </td>
                                        <td>
                                            {
                                                stationdata.report === 0 ? "OK/NOT OK" : "Parameters"
                                            }
                                        </td>
                                        <td>
                                            {stationdata.station_parameters ? stationdata.station_parameters : "NULL"}
                                        </td>
                                        {/* <td>
                                    {stationdata.next_station_name}
                                </td> */}
                                        <td>
                                            {stationdata.cycle_time}
                                        </td>
                                        <td>
                                            {stationdata.daily_count}
                                        </td>
                                        <td>
                                            {stationdata.product_per_hour}
                                        </td>
                                        <td>
                                            <button
                                                className="edit-button"
                                                onClick={() => handleEdit(stationdata)}
                                            >
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                        </td>
                                        <td>
                                            <button
                                                className="delete-button"
                                                onClick={() => handleDelete(index, stationdata.station_id)}
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                    : null}
            </div>
            <br />
            <br />
            <Modal
                show={showEditModal}
                onHide={handleModalClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Edit the Station as per required</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        Staiton Name: {editFormFormik.values.stationName}
                        Product Name: {editFormFormik.values.productName}

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <label>Cycle Time</label>
                            <Form.Control type="number" placeholder="Enter Cycle Time" value={editFormFormik.values.cycleTime} name="cycleTime" onChange={editFormFormik.handleChange} />
                            {addFormFormik.errors.cycleTime ? (
                                <div>{addFormFormik.errors.cycleTime}</div>) : null}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <label>Daily Count</label>
                            <Form.Control type="number" placeholder="Enter Daily Count " value={editFormFormik.values.dailyCount} name="dailyCount" onChange={editFormFormik.handleChange} />
                            {addFormFormik.errors.dailyCount ? (
                                <div>{addFormFormik.errors.dailyCount}</div>) : null}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <label>Product per hour</label>
                            <Form.Control type="number" placeholder="Enter Product to be producted per hour" value={editFormFormik.values.productPerHour} name="productPerHour" onChange={editFormFormik.handleChange} />
                            {addFormFormik.errors.productPerHour ? (
                                <div>{addFormFormik.errors.productPerHour}</div>) : null}
                        </Form.Group>

                        <label>Report Type</label>
                        <Form.Select className="mb-3 select-param" aria-label="Default select example" value={editFormFormik.values.reportType} name="reportType" onChange={editFormFormik.handleChange}>
                            <option value=''>--Select Report Type--</option>
                            <option value="0">Okay/Not okay</option>
                            <option value="1">Parameters</option>
                        </Form.Select>

                        {
                            editFormFormik.values.reportType === "1" &&
                            <div>
                                <h3>Select Parameters:</h3>
                                {productParameters.map((parameter, index) => (
                                    <div key={index}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={editFormFormik.values.stationParameter.includes(parameter)}
                                                onChange={() => handleParameterTickBoxChangeForEdit(parameter)}
                                            />
                                            {parameter}
                                        </label>
                                        {addFormFormik.errors.stationParameter ? (
                                            <div>{addFormFormik.errors.stationParameter}</div>) : null}
                                    </div>
                                ))}
                            </div>
                        }
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="danger" onClick={handleModalClose}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={editFormFormik.handleSubmit}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
            <br />
            <br />

            <Footer />
        </div>

    )
}

export default AddStation;


