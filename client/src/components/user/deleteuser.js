import WindalsNav from '../navbar';
import Footer from '../footer';
import { Alert,Button,Form, Modal} from 'react-bootstrap';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { getAllWorkerNames, getOneEmployee, updateEmployee,deleteEmployee, resetPassword } from '../../helper/helper';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash,faEdit } from '@fortawesome/free-solid-svg-icons';
import { Prev } from 'react-bootstrap/esm/PageItem';
import './deleteuser.css';

function DeleteUser() {
  
  const [workerNames,setWorkerNames] = useState([])
  const [workerUserName,setWorkerUserName] = useState("")
  const [showResetPasswordModal,setShowResetPasswordModal] = useState(false)
  const [resetPasswordData,setResetPasswordData] = useState({
    userName: "",
    newPassword: "",
    confirmNewPassword: ""
  })

  const accessOptions = [ "Add User", "View User", "Delete User", "Modify User", "Add Product", "Veiw Product", "Delete Product", "Modify Product",
   "Add Station", "View Station", "Delete Station", "Modify Station", "Allocate Next Station for Product", "Update Next Station Allocated for Product", 
  "Delete Next Station Allocated for Product", "View Next Station Allocated for Product", "Allocate Station to Worker", "View Station allocated to worker","Configure Shift"] 
  
  const [accessGiven, setAccessGiven] = useState(new Array(accessOptions.length).fill(false));

  const validationSchema = Yup.object().shape({
      userName:Yup.string().required('User name is required'),
      firstName:Yup.string().required('First name is required'),
      lastName:Yup.string().required('Last name is required'),
      nickName:Yup.string().required('Nick name is required'),
      designation:Yup.string().required('designation is required'),
      joiningDate:Yup.date().required('Joining Date is required'),
  })
  
  
  const formik = useFormik({
    initialValues:{
      employeeId:"",
      userName:"",
      firstName:"",
      lastName:"",
      nickName:"",
      designation:"",
      joiningDate:"",
      mobileNo:"",
      accessGiven:""
    },
    validationSchema:validationSchema,
    onSubmit:(values)=>{
      values.accessGiven = accessGiven.map(val => val ? "1" : "0").join("");
      // console.log(values);
      const updateEmployeePromise = updateEmployee(values)
      toast.promise(updateEmployeePromise,{
        loading:"Updating data",
        success: (result) => {
          setWorkerUserName("")
          formik.resetForm()
          return result.msg
        },
        error: (err) => err.msg 
      })
    }
  })
  
  useEffect(()=>{
    const getWorkerNamePromise = getAllWorkerNames()
    getWorkerNamePromise.then((result)=>{
      setWorkerNames(result)
    }).catch((err)=>{
      toast.error(err.msg)
    })
  },[])

  const searchWorker = () => {
    if(workerUserName==="")
    {
      return toast.error("Select a worker first")
    }
    const getWorkerDataPromise = getOneEmployee(workerUserName.value)
    getWorkerDataPromise.then((result)=>{
      // console.log({result:result});
      formik.setFieldValue("employeeId",result[0].employee_id)
      formik.setFieldValue("userName",result[0].user_name)
      formik.setFieldValue("firstName",result[0].first_name)
      formik.setFieldValue("lastName",result[0].last_name)
      formik.setFieldValue("nickName",result[0].nick_name)
      formik.setFieldValue("designation",result[0].designation)
      formik.setFieldValue("mobileNo",result[0].mobile_no)
      formik.setFieldValue("joiningDate",result[0].joining_date.substring(0, 10))
      formik.setFieldValue("accessGiven",result[0].access_given)
      const accessArray = accessOptions.map((option, index) => result[0].access_given[index] === "1");
      setAccessGiven(accessArray);
    })
  }
  // console.log({formik:formik.values});
  const handleEmployeeDelete = () => {
    const deleteEmployeePromise = deleteEmployee(formik.values.employeeId)
    toast.promise(deleteEmployeePromise,{
      loading:"Updating data",
      success: (result) => {
        setWorkerUserName("")
        formik.resetForm()
        return result.msg
      },
      error: (err) => err.msg 
    }) 
  }

  const handleAccessOptionCheck = (index) => {
    const updatedAccess = [...accessGiven];
    updatedAccess[index] = !updatedAccess[index];
    setAccessGiven(updatedAccess);
  }

  const openResetPasswordModal = () => {
    setShowResetPasswordModal(true)
  }

  const closeResetPasswordModal = () => {
    setShowResetPasswordModal(false)
    setResetPasswordData({
      userName: "",
      newPassword: "",
      confirmNewPassword: ""
    })
  }

  const handleClickOFResetPassword = () => { 
    if(resetPasswordData.newPassword !== resetPasswordData.confirmNewPassword){
      return toast.error("Password and confirm-password do not match.")
    }
    const resetPasswordPromise = resetPassword(resetPasswordData)
    toast.promise(resetPasswordPromise,{
      loading: "Resetting password",
      success: (result) => {
        closeResetPasswordModal()
        setResetPasswordData({
          userName: "",
          newPassword: "",
          confirmNewPassword: ""
        })  
        return result.msg
      },
      error: (err) => err.msg
    })
  }

  const handleResetPasswordModalChange = (e) => {
    const {name,value} = e.target
    setResetPasswordData((PrevData)=>{
      return {
        ...PrevData,
        [name]:value
      }
    })
  }

  return (
    <>
    <WindalsNav/>
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <WindalsNav/>
      <Form style={{ margin: '15vh' , alignItems:'center',textAlign:'center'}}>
      <div className='username-not-table'  >
        <h3 style={{ width: 500, textAlign: 'center' }}>Enter Username of the User to Delete</h3>

        <div className='form' style={{margin: "10px"}}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1" style={{ width: 300 }}>
            <Form.Label>Username</Form.Label>
            <Select
                    options={workerNames.map((worker) => ({ label: worker.user_name, value: worker.user_name }))}
                    value={workerUserName}
                    onChange={(data) => {
                      setWorkerUserName(data)
                    }}
                    isSearchable={true}
                />
            
          </Form.Group>

          <Button variant="danger" type="button" onClick={searchWorker}>
            Search Worker
          </Button>
        </div>
        </div>

        <br />

        {
            formik.values.userName!=="" && 
            <div className='delusertable' >
            <table>
            
              <tbody>
                <tr>
                  <th>User Name</th>
                  <td><Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Control type="text" value={formik.values.userName} name="userName" onChange={formik.handleChange} />
                    </Form.Group>
                    {
                      formik.errors.userName && formik.touched.userName ? (
                        <Alert variant="danger" className="paramererName-error-message">
                          {formik.errors.userName}
                        </Alert>
                    ):null} </td>
                </tr>
                <tr>
                  <th>First Name</th>
                  <td><Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Control type="text" value={formik.values.firstName} name="firstName" onChange={formik.handleChange} />
                    </Form.Group>
                    {
                      formik.errors.firstName && formik.touched.firstName?(
                        <Alert variant="danger" className="paramererName-error-message">
                          {formik.errors.firstName}
                        </Alert>
                    ):null} </td>
                </tr>
                <tr>
                  <th>Last Name</th>
                  <td><Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Control type="text" value={formik.values.lastName} name="lastName" onChange={formik.handleChange} />
                    </Form.Group>
                    {
                      formik.errors.lastName && formik.touched.lastName?(
                        <Alert variant="danger" className="paramererName-error-message">
                          {formik.errors.lastName}
                        </Alert>
                    ):null} </td>
                </tr>
                <tr>
                  <th>Nick Name</th>
                  <td><Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Control type="text" value={formik.values.nickName} name="nickName" onChange={formik.handleChange} />
                    </Form.Group>
                    {
                      formik.errors.nickName && formik.touched.nickName? (
                        <Alert variant="danger" className="paramererName-error-message">
                          {formik.errors.nickName}
                        </Alert>
                    ) : null} </td>
                </tr>
                <tr>
                  <th>Mobile Number</th>
                  <td><Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Control type="text" value={formik.values.mobileNo} name="mobileNo" onChange={formik.handleChange} />
                    </Form.Group>
                    {
                      formik.errors.mobileNo && formik.touched.mobileNo? (
                        <Alert variant="danger" className="paramererName-error-message">
                          {formik.errors.mobileNo}
                        </Alert>
                    ):null} </td>
                </tr>
                <tr>
                  <th>Designation</th>
                  <td><Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Control type="text" value={formik.values.designation} name="designation" onChange={formik.handleChange} />
                    </Form.Group>
                    {
                      formik.errors.designation && formik.touched.designation?(
                        <Alert variant="danger" className="paramererName-error-message">
                          {formik.errors.designation}
                        </Alert>
                    ):null} </td>
                </tr>
                <tr>
                  <th>Joining Date</th>
                  <td><Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Control type="text" value={formik.values.joiningDate} name="joiningDate" onChange={formik.handleChange} />
                    </Form.Group>
                    {
                      formik.errors.joiningDate && formik.touched.joiningDate?(
                        <Alert variant="danger" className="paramererName-error-message">
                          {formik.errors.joiningDate}
                        </Alert>
                    ):null} </td>
                </tr>
                <tr>
                  <th>Access Given</th>
                  <td>{
                        accessOptions.map((option, index) => (
                          <div key={option}>
                            <label>
                              <input
                                type="checkbox"
                                checked={accessGiven[index]}
                                onChange={() => handleAccessOptionCheck(index)}
                              />
                              {option}
                            </label>
                          </div>
                        ))
                      }</td>
                </tr>
                <tr>
                  <th>Edit</th>
                  <td><button className="delete-button" onClick={formik.handleSubmit} >
                        <FontAwesomeIcon icon={faEdit} />
                      </button></td>
                </tr>
                <tr>
                  <th>Delete</th>
                  <td><button className="delete-button" onClick={()=>{handleEmployeeDelete()}}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button></td>
                </tr>
                <tr>
                  <th>Reset Password</th>
                  <td><button type='button' className="reset-button" onClick={()=>{
                        setResetPasswordData((prevData)=>{
                          return {
                            ...prevData,
                            userName:formik.values.userName
                          }
                        })
                        openResetPasswordModal()
                      }}>
                        Reset-Password
                      </button></td>
                </tr>
                
              </tbody>
            </table>
            </div>
        }
      </Form>
    
        <Modal
          show={showResetPasswordModal}
          onHide={closeResetPasswordModal}
          backdrop="static"
          keyboard={false}
        >

          <Modal.Header closeButton>
            <Modal.Title>Enter the new password</Modal.Title>
          </Modal.Header>

          <Modal.Body>
              <Form>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                    <label>New password</label>
                    <Form.Control type="password" placeholder="New password" name="newPassword" value={resetPasswordData.newPassword} onChange={(e)=>handleResetPasswordModalChange(e)} />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicEmail">
                    <label>Confirm new password</label>
                    <Form.Control type="password" placeholder="Confirm new password" name="confirmNewPassword" value={resetPasswordData.confirmNewPassword} onChange={(e)=>handleResetPasswordModalChange(e)} />
              </Form.Group>
              </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="danger" onClick={closeResetPasswordModal}>
              Close
            </Button>
              <Button variant="danger" onClick={handleClickOFResetPassword}>
                Save
              </Button>
          </Modal.Footer>
        </Modal>
        
    </div>
    <Footer/>
    </>
    
  );
}

export default DeleteUser;