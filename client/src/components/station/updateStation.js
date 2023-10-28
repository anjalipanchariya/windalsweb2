import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './addStation.css';
import WindalsNav from "../navbar";
import Footer from '../footer';
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { addStation, deleteStation, getOneProductAllParameters, getOneStation, getOneStationOneProduct, getProductNames,updateStation } from "../../helper/helper";
import { Button, Form,Table } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
//add station actually

function UpdateStation() {

  const [productNames,setProductNames] = useState([]);
  const [productParameters,setProductParameters] = useState([]);
  const [stationData,setStationData] = useState([])
  const [showEditModal,setShowEditModal] = useState(false);
  
  const addFormFormik = useFormik({
      initialValues:{
          stationName: '',
          productName: '',
          reportType: '',
          stationParameter: [],
          cycleTime: '',
          dailyCount:'',
          productPerHour: ''
      },
      onSubmit: async (values) => {
          const addStationPromise = addStation(values)
          toast.promise(
              addStationPromise,
              {
                  loading: 'Adding station',
                  success: (result) => {
                      addFormFormik.resetForm()
                      return result.msg},
                  error: (err) => {
                      return err.msg}
              }
          )
      }
  })

  const searchFormFormik = useFormik({
      initialValues:{
          stationName:"",
          productName:"",
      },
      onSubmit: (values) => {
          handleSearch()
      }
  })

  const editFormFormik = useFormik({
      initialValues:{
          stationId:'',
          stationName: '',
          productName: '',
          reportType: '',
          stationParameter: [],
          cycleTime: '',
          dailyCount:'',
          productPerHour: ''
      },
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
  
  useEffect(()=>{
      const getProductNamesPromise = getProductNames()
      getProductNamesPromise.then(async(result)=>{
          const productnames = await result.map((product)=> product.product_name)
          setProductNames(productnames)
      }).catch((err)=>{})
  },[])
 
  useEffect(()=>{
      if(addFormFormik.values.productName!=="" || editFormFormik.values.productName!=="")
      {
          const productName = addFormFormik.values.productName!=="" ? addFormFormik.values.productName : editFormFormik.values.productName
          const getProductParametersPromise = getOneProductAllParameters(productName)
          getProductParametersPromise.then( async (result)=>{
              const parameters = await result.map( (product) => product.parameter)
              setProductParameters(parameters)
          }).catch((err)=>{})
      }
  },[addFormFormik.values.productName,editFormFormik.values.productName])

  useEffect(()=>{
      handleReportTypeChangeForAdd(addFormFormik.values.reportType)
  },[addFormFormik.values.reportType])

  useEffect(()=>{
      handleReportTypeChangeForEdit(editFormFormik.values.reportType)
  },[editFormFormik.values.reportType])
  
  const handleModalClose = () => {
      editFormFormik.resetForm()
      setShowEditModal(false);
  }

  const handleReportTypeChangeForAdd = (value) => {          //use to empty stationParameters if reportType changed to ok/notok
      if (value === "0") {
          addFormFormik.setFieldValue('stationParameter',[])
      }
  };

  const handleReportTypeChangeForEdit = (value) => {          //use to empty stationParameters if reportType changed to ok/notok
      if (value === "0") {
          editFormFormik.setFieldValue('stationParameter',[])
      }
  };

  function handleSearch() {
      if(searchFormFormik.values.productName===""){
          const getOneStationPromise = getOneStation(searchFormFormik.values.stationName)
          getOneStationPromise.then(async(result)=>{
              await setStationData(result)
          }).catch((err)=>{
              toast.error(err.msg)
          })
      }
      else{
         const getOneStationOneProductPromise = getOneStationOneProduct(searchFormFormik.values)
         getOneStationOneProductPromise.then(async(result)=>{
              await setStationData(result)
          }).catch((err)=>{
              toast.error(err.msg)
          })
      }
  }
  
  const handleDelete = (index,stationId) => {
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
              error: err => {return err.msg}
          }
      )
      
  };

  const handleEdit = (stationData) => {
     const editValues = {
      stationId: stationData.station_id,
      stationName: stationData.station_name,
      productName: stationData.product_name,
      reportType: stationData.report.toString(),
      stationParameter: stationData.station_parameters===null ? [] : stationData.station_parameters.split(', '),
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
  return (
    <>
    <WindalsNav/>
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div>
      <div className="add-station-inputs">
                    <Form>
                        <h3>Add Station</h3>
                        <div className="station-name-id">
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Control type="text" placeholder="Enter Station Name" value={addFormFormik.values.stationName} name="stationName" onChange={addFormFormik.handleChange} />
                            </Form.Group>

                            <Form.Select className="mb-3 select-param" aria-label="Default select example" value={addFormFormik.values.productName} name="productName" onChange={addFormFormik.handleChange}>
                                <option values="">--Select Product--</option>
                                {
                                    Array.isArray(productNames) && productNames.map((product, index) => (
                                        <option key={index} value={product}>{product}</option>
                                    ))
                                }
                            </Form.Select>

                            {/* <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Control type="text" placeholder="Work" onChange={(event) => { setWork(event.target.value) }} />
                                    <Form.Text className="text-muted">
                                    </Form.Text>
                                </Form.Group> */}

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Control type="number" placeholder="Enter Cycle Time" value={addFormFormik.values.cycleTime} name="cycleTime" onChange={addFormFormik.handleChange} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Control type="number" placeholder="Enter Daily Count " value={addFormFormik.values.dailyCount} name="dailyCount" onChange={addFormFormik.handleChange} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Control type="number" placeholder="Enter Product to be producted per hour" value={addFormFormik.values.productPerHour} name="productPerHour" onChange={addFormFormik.handleChange} />
                            </Form.Group>

                            <Form.Select className="mb-3 select-param" aria-label="Default select example" value={addFormFormik.values.reportType} name="reportType" onChange={addFormFormik.handleChange}>
                                <option value=''>--Select Report Type--</option>
                                <option value="0">Okay/Not okay</option>
                                <option value="1">Parameters</option>
                            </Form.Select>

                            {
                                addFormFormik.values.reportType === "1" && 
                                <Form>
                                <h3>Select Parameters:</h3>
                                    {productParameters.map((parameter,index) => (
                                        <div key={index}>
                                        <label>
                                            <input
                                            type="checkbox"
                                            checked={addFormFormik.values.stationParameter.includes(parameter)}
                                            onChange={() => handleParameterTickBoxChangeForAdd(parameter)}
                                            />
                                            {parameter}
                                        </label>
                                        </div>
                                    ))}
                                </Form>
                            }    
                        
                        </div>

                        <div className="add-station-button">
                            <Button variant="danger" className="add-button-stn" onClick={addFormFormik.handleSubmit}>Add Station</Button>
                        </div>
                    </Form>
                </div>
      </div>
     <Footer/>
    </>
  );
}

export default UpdateStation;