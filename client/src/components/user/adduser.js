import React, { useState } from "react";
import './adduser.css'
import { useFormik } from "formik";
import { registerUser } from "../../helper/helper";
import toast, { Toaster } from 'react-hot-toast';
import WindalsNav from "../navbar";
import * as Yup from "yup";
import { Alert } from "react-bootstrap";
import Footer from '../footer';


function WorkerReg() {
  const today = new Date();
   
  const accessOptions = ["View User", "Add User", "Update User", " Delete User", " View Product", "Add Product", "Update Product", "Delete Product",
  "View Station", "Add Station", "Update Station", "Delete Station", "Allocate Station To Worker", "Allocate Next Station", 
  "View Shifs", "Add Shifts", "Update Shifts", "Delete Shifts","Supervisor","Admin Panel"] 
  
  const [accessGiven, setAccessGiven] = useState(new Array(accessOptions.length).fill(false));

  const userValidationSchema = Yup.object().shape({
    userName: Yup.string().required("Username is required"),
    firstName: Yup.string().required("Username is required"),
    lastName: Yup.string().required("Username is required"),
    nickName: Yup.string().required("Username is required"),
    password: Yup.string().required("Username is required"),
    confirmPassword: Yup.string().required("Username is required"),
    designation: Yup.string().required("Username is required"),
    mobileNo: Yup.string()
      .matches(/^[0-9]{10}$/, "Invalid mobile number")
      .test("is-positive", "Mobile number must be positive", (value) => {
        return parseInt(value) > 0;
      }),
    joiningDate: Yup.date()
      .required()
      .max(today, "Joining date cannot be in the future")
  })

  const formik = useFormik({
    initialValues:{
      userName:"",
      firstName:"",
      lastName:"",
      nickName:"",
      password:"",
      confirmPassword:"",
      designation:"",
      joiningDate:today.toISOString().substring(0, 10), // Set the initial value to the current date
      mobileNo:"",
      accessGiven: "0000000000000000000"
    },
    validationSchema: userValidationSchema,
    validateOnBlur: false,
    onSubmit: values => {
      values.accessGiven = accessGiven.map(val => val ? "1" : "0").join("");
      console.log(values);
      const registerUserPromise = registerUser(values)
      toast.promise(
        registerUserPromise,
        {
          loading: "Registering user",
          success: (reuslt) => {
            formik.resetForm()
            setAccessGiven(new Array(accessOptions.length).fill(false))
            return reuslt.msg
          },
          error: err => err.msg
        }
      )
    }
  })

  const handleAccessOptionCheck = (index) => {
    const updatedAccess = [...accessGiven];
    updatedAccess[index] = !updatedAccess[index];
    setAccessGiven(updatedAccess);
  }
  
  return(

    <div>
      <WindalsNav />
      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <div className="adduser">
        <form className="workerreg">
          <h1 className="heading">User Registration</h1>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="worklist">
            <div className="inplab">
              <label htmlFor="">User ID</label>
              <input type="text" placeholder="" />
            </div>

              <div className="inplab">
                <label htmlFor="">Username</label>
                <input type='text' value={formik.values.userName} name="userName" onChange={formik.handleChange} />
                {formik.errors.userName && formik.touched.userName ? (
                  <Alert variant="danger" className="error-message">{formik.errors.userName}</Alert>
                ) : null}
              </div>
              <div className="inplab">
                <label htmlFor="">First Name</label>
                <input type='text' value={formik.values.firstName} name="firstName" onChange={formik.handleChange} />
                {formik.errors.firstName && formik.touched.firstName ? (
                  <Alert variant="danger" className="error-message">{formik.errors.firstName}</Alert>
                ) : null}
              </div>

              <div className="inplab">
                <label htmlFor="">Last Name</label>
                <input type='text' value={formik.values.lastName} name="lastName" onChange={formik.handleChange} />
                {formik.errors.lastName && formik.touched.lastName ? (
                  <Alert variant="danger" className="error-message">{formik.errors.lastName}</Alert>
                ) : null}
              </div>

              

            </div>
            <div className="worklist">

            <div className="inplab">
                <label htmlFor="">Nickname</label>
                <input type='text' value={formik.values.nickName} name="nickName" onChange={formik.handleChange} />
                {formik.errors.nickName && formik.touched.nickName ? (
                  <Alert variant="danger" className="error-message">{formik.errors.nickName}</Alert>
                ) : null}
              </div>
              
              <div className="inplab">
                <label htmlFor="">Mobile Number</label>
                <input type="text" value={formik.values.mobileNo} name="mobileNo" onChange={formik.handleChange} />
                {formik.errors.mobileNo && formik.touched.mobileNo ? (
                  <Alert variant="danger" className="error-message">{formik.errors.mobileNo}</Alert>
                ) : null}
              </div>

              <div className="inplab">
                <label htmlFor="">Password</label>
                <input type='password' value={formik.values.password} name="password" onChange={formik.handleChange} />
                {formik.errors.password && formik.touched.password ? (
                  <Alert variant="danger" className="error-message">{formik.errors.password}</Alert>
                ) : null}
              </div>

              <div className="inplab">
                <label htmlFor="">Confirm Password</label>
                <input type='password' value={formik.values.confirmPassword} name="confirmPassword" onChange={formik.handleChange} />
                {formik.errors.confirmPassword && formik.touched.confirmPassword ? (
                  <Alert variant="danger" className="error-message">{formik.errors.confirmPassword}</Alert>)
                  : null}
              </div>

              

            </div>

            <div className="worklist">
            
            <div className="inplab">
                <label htmlFor="">Designation</label>
                <input type='text' value={formik.values.designation} name="designation" onChange={formik.handleChange} />
                {formik.errors.designation && formik.touched.designation ? (
                  <Alert variant="danger" className="error-message">{formik.errors.designation}</Alert>
                ) : null}
              </div>

            <div className="inplab">
            <label>Joining date</label>
            <input type='date' value={formik.values.joiningDate} name="joiningDate" onChange={formik.handleChange} />
            {formik.errors.joiningDate && formik.touched.joiningDate ? (
              <Alert variant="danger" className="error-message">{formik.errors.joiningDate}</Alert>
            ) : null}
          </div>
          </div>

            </div>
            

          <br />
        </form>
        <div className="checkbox-groups">
          <hr />
          <div className="checkbox-row">
            <h5>User Access - </h5>
            {accessOptions.slice(0, 4).map((option, index) => (
              <div key={option} style={{ marginLeft: 10, marginRight: 10 }}>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={accessGiven[index]}
                    onChange={() => handleAccessOptionCheck(index)}
                  />
                  {option}
                </label>
              </div>
            ))}
          </div>
          <hr />
          <br />
          <div className="checkbox-row">
            <h5>Product Access - </h5>
            {accessOptions.slice(4, 8).map((option, index) => (
              <div key={option} style={{ marginLeft: 10, marginRight: 10 }}>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={accessGiven[index + 4]}
                    onChange={() => handleAccessOptionCheck(index + 4)}
                  />
                  {option}
                </label>
              </div>
            ))}
          </div>
          <hr />
          <br />
          <div className="checkbox-row">
            <h5>Station Access - </h5>
            {accessOptions.slice(8, 12).map((option, index) => (
              <div key={option} style={{ marginLeft: 10, marginRight: 10 }}>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={accessGiven[index + 8]}
                    onChange={() => handleAccessOptionCheck(index + 8)}
                  />
                  {option}
                </label>
              </div>
            ))}
          </div>
          <hr />
          <br />
          <div className="checkbox-row">
          <h5>Allocation Access - </h5>
            {accessOptions.slice(12,14).map((option, index) => (
              <div key={option} className="col-md-2">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={accessGiven[index + 12]}
                    onChange={() => handleAccessOptionCheck(index + 12)}
                  />
                  {option}
                </label>
              </div>
            ))}
          </div>
          <hr />
          <br />
          <div className="checkbox-row">
          <h5>Shift Access - </h5>
            {accessOptions.slice(14,18).map((option, index) => (
              <div key={option} className="col-md-2">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={accessGiven[index + 14]}
                    onChange={() => handleAccessOptionCheck(index + 14)}
                  />
                  {option}
                </label>
              </div>
            ))}
          </div>
          <br />
          <hr />
          <br />
          <div className="checkbox-row">
          <h5>Extra</h5>
            {accessOptions.slice(18,20).map((option, index) => (
              <div key={option} className="col-md-2">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={accessGiven[index + 18]}
                    onChange={() => handleAccessOptionCheck(index + 18)}
                  />
                  {option}
                </label>
              </div>
            ))}
          </div>
          <br />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2vh' }}>
          <button type="submit" onClick={formik.handleSubmit}>Register</button>
        </div>
        <br />
      </div>

      <br />
      <Footer />
    </div>
  )
}

export default WorkerReg;