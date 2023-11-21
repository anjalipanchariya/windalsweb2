import React, { useEffect, useState } from "react";
import './nextStationAllocation.css'
import Select from 'react-select'
import { getProductNames, getOneProductStationNames, configureNextStation } from "../../helper/helper";
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from "formik";
import WindalsNav from "../navbar";
import * as Yup from 'yup';
import { Alert } from "react-bootstrap";
import Footer from '../footer';


function NextStationAllocation() {
    let shouldSubmit = true;


    // const [condition,setCondition] = useState(false);
    const nextStationAllocationSchema = Yup.object().shape({
        productName: Yup.object().required("Required")

    })
    const formik = useFormik({
        initialValues: {
            productName: "",
            firstStation: null,
            lastStation: null,
            nextStationAllocation: [] // Initialize as an empty array of objects
        },
        // validationSchema: nextStationAllocationSchema,
        onSubmit: (values) => {
            console.log(values);
            // values.nextStationAllocation.map((value) => {
            //     if (value.nextStation == -1) {
            //         alert("Few fields are not filled")
            //         shouldSubmit = false;
            //     }
            // })

            values.nextStationAllocation.map((value)=>{
                if(value.nextStation == -1){
                    nextStationAllocation.label = "Null";
                    nextStationAllocation.value = null;
                }
            })
            if (shouldSubmit) {
                const configureNextStationPromise = configureNextStation(values)
                toast.promise(configureNextStationPromise, {
                    loading: "Saving configuration",
                    success: (result) => {
                        return result.msg
                    },
                    error: (err) => err.msg

                })
            }
        }
    });

    const [productNames, setProductNames] = useState([]);
    const [nextStationAllocation, setNextStationAllocation] = useState([]);


    useEffect(() => {
        const getProductNamesPromise = getProductNames();
        getProductNamesPromise.then((result) => {
            const productNames = result.map((product) => product.product_name);
            setProductNames(productNames);
        }).catch((err) => {
            toast.error(err.msg);
        });
    }, []);

    useEffect(() => {
        if (formik.values.productName !== "") {

            const getStationNamesPromise = getOneProductStationNames(formik.values.productName);
            getStationNamesPromise.then((result) => {
                if (result.length <= 0) {
                    toast.error("There is no station configuration done for this product.")
                }
                const stationNames = result.map((station) => station.station_name);
                // Initialize nextStationAllocation based on stationNames
                const nextStationAllocation = stationNames.map((stationName) => ({
                    currentStation: stationName,
                    nextStation: -1 // Initialize as null
                }));
                setNextStationAllocation(nextStationAllocation);
                formik.setFieldValue("nextStationAllocation", nextStationAllocation); // Update formik value
            }).catch((err) => {
                toast.error(err.msg);
            });
        }
    }, [formik.values.productName]);

    console.log({ formik: formik.values });

    //firststation
    const [firstStation, setFirstStation] = useState(null);
    
    //laststation
    const [lastStation, setLastStation] = useState(null);

    return (
        <>
            <WindalsNav />
            <div className="product-select">
                <div >
                    <Toaster position="top-center" reverseOrder={false}></Toaster>
                    
                    <Select
                        options={productNames.map((product) => ({ label: product, value: product }))}
                        value={formik.values.productName}
                        name="productName"
                        onChange={(data) => formik.setFieldValue("productName", data)}
                        isSearchable={true}
                        placeholder="Select Product"
                    />
                    {formik.errors.productName && formik.touched.productName ? (
                        <Alert variant="danger" className="error-message">{formik.errors.productName}</Alert>
                    ) : null}
                    <br />

                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <div className="nextstatselect">
                            <h4>First Station</h4>
                            <Select
                                value={formik.values.firstStation}
                                name="firstStation"
                                onChange={(data) => {
                                    formik.setFieldValue("firstStation", data);
                                    setFirstStation(data.value);
                                }}
                                // onChange={(data)=>setFirstStation(data)}
                                options={[
                                    ...nextStationAllocation
                                        .map((station) => ({
                                            label: station.currentStation,
                                            value: station.currentStation
                                        })),
                                    { label: "Null", value: null } // Add null option
                                ]}
                                isSearchable={true}
                            />

                        </div>

                        <div className="nextstatselect">
                            <h4>Last Station</h4>
                            <Select
                                value={formik.values.lastStation}
                                name="lastStation"
                                onChange={(data) => {
                                    formik.setFieldValue("lastStation", data);
                                    setLastStation(data.value);
                            }}
                                options={[
                                    ...nextStationAllocation
                                    .filter((station) => (station.currentStation!==firstStation))
                                        .map((station) => ({
                                            label: station.currentStation,
                                            value: station.currentStation
                                        })),
                                    { label: "Null", value: null } // Add null option
                                ]}
                                isSearchable={true}
                            />
                        </div>

                    </div>

                </div>
                {formik.values.productName !== "" && (
                    <div className="stattable" style={{ marginTop: 30 }}>
                        <table className="nstable">
                            <thead>
                                <tr>
                                    <th>Station</th>
                                    <th>Next Station</th>
                                </tr>
                            </thead>
                            <tbody>
                                {nextStationAllocation.map((allocation, index) => (
                                    <tr key={index}>
                                        {allocation.currentStation!==lastStation ? (<td>{allocation.currentStation}</td>) : null}
                                        {allocation.currentStation!==lastStation ? (
                                        <td>
                                            <Select
                                               options={[
                                                    ...nextStationAllocation
                                                        .filter((station) => (station.currentStation !== allocation.currentStation) && (station.currentStation!==firstStation))
                                                        .map((station) => ({
                                                            label: station.currentStation,
                                                            value: station.currentStation
                                                        })),
                                                    { label: "Null", value: null } // Add null option
                                                ]}
                                                placeholder="Select Next Station"
                                                value={allocation.nextStation}
                                                onChange={(data) => {
                                                    const updatedNextStationAllocation = [...nextStationAllocation];
                                                    updatedNextStationAllocation[index] = {
                                                        ...updatedNextStationAllocation[index],
                                                        nextStation: data
                                                    };
                                                    setNextStationAllocation(updatedNextStationAllocation);
                                                    formik.setFieldValue("nextStationAllocation", updatedNextStationAllocation);
                                                }}
                                                isSearchable={true}
                                            />

                                        </td>
                                        ):null}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <br />
                <button onClick={formik.handleSubmit}>Save configuration</button>
            </div>
            <br />

            <Footer />
        </>
    );
}

export default NextStationAllocation;
