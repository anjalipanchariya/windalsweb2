import { useFormik } from "formik";
import * as Yup from "yup";
import { getLoginLogInfo } from "../../helper/helper";
import { useState } from "react";
import Table from "../table";
import { Alert } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import WindalsNav from "../navbar";
import './jobReport.css'

function LoginLog() {

    const [loginLogInfo, setLoginLogInfo] = useState([])

    const columns = [
        { field: 'station_name', label: 'Station Name' },
        { field: 'login_date_time', label: 'Login date and time' },
        { field: 'logout_date_time', label: 'Logout date and time' },
    ]

    const validationSchema = Yup.object().shape({
        userName: Yup.string().required("Required")
    })

    const formik = useFormik({
        initialValues: {
            userName: ""
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            const getLoginLogInfoPromice = getLoginLogInfo(values)
            toast.promise(getLoginLogInfoPromice, {
                loading: "Fetching data",
                error: (err) => { return err.msg },
                success: (result) => {
                    const newResult = result.map((log) => {



                        return {
                            ...log,
                            station_name: log.station_name === null ? "null" : log.station_name,
                            login_date_time: log.login_date_time
                                ? [
                                    new Date(log.login_date_time).toLocaleDateString(),
                                    new Date(log.login_date_time).toLocaleTimeString(),
                                ].join(" ")
                                : "null",
                            logout_date_time: log.logout_date_time
                                ? [
                                    new Date(log.logout_date_time).toLocaleDateString(),
                                    new Date(log.logout_date_time).toLocaleTimeString(),
                                ].join(" ")
                                : "null"
                        }
                    })

                    setLoginLogInfo(newResult)
                    return "Fetched data successfully"
                }
            })
        }
    })

    console.log({ loginLogInfo: loginLogInfo });
    return (
        <div>
            <WindalsNav />
            <Toaster position="top-center" reverseOrder={false}></Toaster>
            <div className="jobreport">
                <h1 className="heading" style={{marginBottom:'3vh'}}>Login Log</h1>
                
                    <label htmlFor="" style={{fontWeight:600, fontSize:'1.4rem'}}>Username</label>
                    <input
                    type="text"
                    value={formik.values.userName}
                    placeholder=""
                    onChange={formik.handleChange}
                    name="userName"
                    style={{borderRadius:'12px', height:'5vh'}}
                />
                
                
                {formik.errors.userName && formik.touched.userName ? (
                    <Alert variant="danger" className="error-message">{formik.errors.userName}</Alert>) : null}
                    <br />
                <button type="button" onClick={formik.handleSubmit} className="buttoncss">Submit</button>
                <p>{formik.userName}</p>

                {loginLogInfo.length > 0 && <Table columns={columns} data={loginLogInfo} />}
            </div>


        </div>
    )
}

export default LoginLog