import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './firstStation.css';
import '../product/addProduct.css'
import Footer from '../footer';
import { getOneStation,createJobId,insertInStationyyyyFirst,insertInStationyyyyFirstNextStation,getWorkAtStationInDay,logout } from '../../helper/helper';
import toast, { Toaster } from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { useFormik } from "formik";
import WindalsNav from '../navbar';
import Table from '../table'

const FirstStation = () => {
    
    const { employeeId, userName, stationName } = useParams();
    const [stationAllInfo,setStationAllInfo] = useState("");
    const [stationOneProductInfo,setStationOneProductInfo] = useState("");
    const [availableProducts,setAvailableProducts] = useState([]);
    const [workAtStationInDay,setWorkAtStationInDay] = useState([])

    const formik = useFormik({
        initialValues:{
            job_name:"",
            product_name:""
        },
        onSubmit:(values)=>{
            const newValues = {
                ...values,
                station_id: stationOneProductInfo[0].station_id,
                employee_id:employeeId  
            }
            const createJobIdPromise = createJobId(newValues)
            createJobIdPromise.then((createJobResult)=>{
                console.log({createJobResult:createJobResult});
                if (formik.values.product_name) 
                {
                    const insertInStationyyyyFirstPromise = insertInStationyyyyFirst(newValues)
                    insertInStationyyyyFirstPromise.then((insertInStationyyyyResult)=>{
                        console.log({insertInStationyyyyResult:insertInStationyyyyResult});
                        const insertInStationyyyyFirstNextStationPromise = insertInStationyyyyFirstNextStation(newValues)
                        insertInStationyyyyFirstNextStationPromise.then((insertInStationyyyyFirstNextResult)=>{
                            toast.success(insertInStationyyyyFirstNextResult.msg)
                            getSubmitedJobs()
                        }).catch((insertInStationyyyyFirstNextErr)=>{
                            toast.error(insertInStationyyyyFirstNextErr.msg)
                        })
                    }).catch((insertInStationyyyyErr)=>{
                        toast.error(insertInStationyyyyErr.msg)
                    })
                    formik.setFieldValue('job_name',"") 
                }
            }).catch((createJobErr)=>{
                toast.error(createJobErr.msg)
            }) 
        }
    })

    useEffect(()=>{
        getSubmitedJobs()
    },[stationOneProductInfo])
   
    useEffect(() => {
        const getStationAllInfoPromise = getOneStation(stationName)
        getStationAllInfoPromise.then((result)=>{
            setStationAllInfo(result)
        }).catch((err)=>{
            toast.error(err.msg)
        })
    }, []);

    useEffect(()=>{
        if (stationAllInfo.length > 0) {
            const productNames = [...new Set(stationAllInfo.map((station) => station.product_name))];
            setAvailableProducts(productNames);
        }
    },[stationAllInfo])
    
    useEffect(()=>{
        if (formik.values.product_name !== "") 
        {
            const stationOneProductInfo = stationAllInfo.filter((station) => {
                return station.station_name === stationName && station.product_name === formik.values.product_name;
            });
            setStationOneProductInfo(stationOneProductInfo);
        }
    },[formik.values.product_name])

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
    console.log({"stationOneProductInfo":stationOneProductInfo,"stationAllinfo":stationAllInfo});
    console.log({"workAtStationInDay":workAtStationInDay});
    return (
        
        <div className="firststat">
            <WindalsNav/>
            <Toaster position="top-center" reverseOrder={false}></Toaster>
            {/* <button onClick={()=>{logout()}}>Log Out</button> */}
            <h1>First Station</h1>
            <hr />
            <div className='fslist'>
            <h4>Station Name : {stationName}</h4>
            <h4>Employee ID : {employeeId}</h4>
            <h4>Username : {userName}</h4>
            </div>
            <hr />
            <div className="form-group">
                <label style={{fontSize:'1.5rem'}} htmlFor="job_nameInput">Enter the Job Name</label>
                <input
                    type="text"
                    className='jobnameinp'
                    id="job_nameInput"
                    value={formik.values.job_name}
                    name="job_name"
                    onChange={formik.handleChange}
                    style={{width: '20%'}}
                />
            </div>
            <br />
            <div className="form-group">
                <label style={{fontSize:'1.5rem'}} htmlFor="productSelect">Select a Product:</label>
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
                <br />
                <br />
                <button className="btn btn-danger" style={{width:200}} onClick={formik.handleSubmit}>
                Add Product
            </button>
            </div>
            <br />
            <br />
          
            { workAtStationInDay.length>0 ? 
                <div className='jobsub'>
                    <h2>Jobs Submitted</h2>
                    <table className="product-table" style={{width:'80%', marginLeft:'40px'}}>
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
                                    <td>{job.status==1 ? "OK" : "Not-Ok"}</td>
                                    <td>{(job.reason!="" || job.reason!=null) ? job.reason : "N.A"}</td>
                                    <td>{(job.parameters!="" || job.parameters!=null) ? job.parameters : "N.A"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                : null}
            <br />
            <br />
            <br />

            <Footer/>
           </div>
            
        
    );
};

export default FirstStation;