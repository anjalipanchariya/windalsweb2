import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import 'bootstrap/dist/css/bootstrap.min.css';
import './login.css';
import { loginUser, getCurrentShift, insertInLoginLog } from '../helper/helper';
import toast, { Toaster } from 'react-hot-toast';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Alert } from 'react-bootstrap';

const LoginPage = () => {

  const navigate=useNavigate();
  const formik = useFormik({
    initialValues: {
      userName: '',
      password: '',
      shift:''
    },
    validationSchema: Yup.object().shape({
      userName: Yup.string().required('Username is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: (values) => {
      // if(values.userName == "admin" && values.password == "admin")
      //       {
      //         navigate('/admin');
      //       }
      //       else{
      //         navigate('/station/firststation');
      //       }
      const loginPromise= loginUser(values)
      toast.promise(loginPromise,
        {
          loading: "Checking creds",
          success: result =>{
            console.log(result);
            console.log(result.userName);
            navigate(`/${result.userName}/LandingPage`);
            // const loginLogInsertPromise = insertInLoginLog({userName:result.userName,stationName:result.stationName})
            // loginLogInsertPromise.then((logResult)=>{
            //   console.log("test")
            //   navigate(`/${result.userName}/LandingPage`);
            // //   if(result.userName === "admin")
            // // {
            // //   navigate(`/${result.userName}/AdminPanel`);
            // // }
            // // else{
            // //   if(result.stationName==="station 1")
            // //   {
            // //     navigate(`/FirstStation/${result.employeeId}/${result.userName}/${result.stationName}`);
            // //   }
            // //   else
            // //   {
            // //     navigate(`/Station/${result.employeeId}/${result.userName}/${result.stationName}`);
            // //   }
            // // }
            // return result.msg
            // })
            // .catch((err)=>{
            //   console.log(err);
            //   return err.msg
            // })
            
          },
          error: err => {
            console.log(err);
           return err.msg
          }
        })
    },
  });

  useEffect(()=>{
    const getCurrentShiftPromise = getCurrentShift()
    getCurrentShiftPromise.then((result)=>{
      console.log(result.shift_id);
      formik.setFieldValue("shift",result.shift_id)
    }).catch((err)=>{
      toast.error(err.msg)
    })
  },[])

  return (
    <div className='login'>
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div style={{width:400}}>
      <div className=" d-flex flex-wrap align-items-center loginform" style={{backgroundColor : '#FfFfFf' , padding : 30 , borderRadius : 20 }}>
        <form className="row g-3 " onSubmit={formik.handleSubmit}>
          <div className="col-12 align-items-center">
            <label style={{fontSize:35, fontWeight : 700 , color : '#E63946'}}>Login</label>
            <br></br>
            Welcome back !! Login to your account.
            <br></br>
            <label htmlFor="inputEmail4" style={{paddingTop : 15 , fontWeight:600}}>
              Username
            </label>
            
            <input
            style={{borderColor : 'black' , backgroundColor : '#ffffff' ,  width : 300}}
              type="text"
              className="form-control"
              id="inputEmail4"
              name="userName"
              value={formik.values.userName}
              onChange={formik.handleChange}
            />
            {formik.touched.userName && formik.errors.userName?(<Alert variant="danger" className="error-message">{formik.errors.userName}</Alert>):null}
          </div>
          
          <div className="col-12">
            <label htmlFor="inputPassword4" style={{fontWeight:600}}>
              Password
            </label>
            <input
            style={{borderColor : 'black' ,  backgroundColor : '#ffffff' , width : 300}}
              type="password"
              className="form-control"
              id="inputPassword4"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
            />
          {formik.touched.password && formik.errors.password?(<Alert variant="danger" className="error-message">{formik.errors.password}</Alert>):null}
          </div>

          <div className="d-flex flex-column">
           <button type="button" onClick={formik.handleSubmit} style={{width:300 , backgroundColor:'#E63946' , borderRadius : 10}}>
           Login
           </button>
          </div>

        </form>
      </div>
      </div>
    </div>
  );
};

export default LoginPage;