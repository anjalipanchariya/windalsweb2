import React from 'react';
import { Button, Form, Modal, Table, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { addShift, getShift, deleteShift, updateShift } from '../../helper/helper';
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import toast, { Toaster } from 'react-hot-toast';
import WindalsNav from '../navbar';
import Footer from '../footer';
import './shiftConfiguration.css';
import moment from 'moment';
import * as Yup from "yup";

function ShiftConfiguration() {
  const [shiftData, setShiftData] = useState([])
  const [showEditModal, setShowEditModal] = useState(false);


  const shiftValidationSchema = Yup.object().shape({
    shiftName: Yup.string().max(100, "Too long").required("Required"),

    startAmPm: Yup.string().required("AM/PM is required"),
    startHour: Yup.string().required("Hour is required"),
    startMinute: Yup.string().required("Minute is required"),

    endAmPm: Yup.string().required("AM/PM is required"),
    endHour: Yup.string().required("Hour is required"),
    endMinute: Yup.string().required("Minute is required")
    // startTime: Yup.string()
    //   .required("Start time is required")
    //   .test(
    //     "is-greater",
    //     "End time should be greater than start time",
    //     function (value) {
    //       const { startTime, endTime } = this.parent;
    //       if (startTime === endTime) {
    //         return false; 
    //       }
    //       return moment(value, "HH:mm").isSameOrAfter(moment(startTime, "HH:mm"));
    //     }
    //   ),
    // endTime: Yup.string()
    //   .required("End time is required")
    //   .test(
    //     "is-greater",
    //     "End time should be greater than start time",
    //     function (value) {
    //       const { startTime, endTime } = this.parent;
    //       if (startTime === endTime) {
    //         return false; 
    //       }
    //       return moment(value, "HH:mm").isSameOrAfter(moment(startTime, "HH:mm"));
    //     }
    //   ),
  });


  const addFormFormik = useFormik({
    initialValues: {
      shiftName: '',
      startAmPm: 'AM',
      startHour: '12', // Default to 12 (you can set your own default)
      startMinute: '00',

      endAmPm: 'AM',
      endHour: '12', // Default to 12 (you can set your own default)
      endMinute: '00',

      active: false
    },
    validationSchema: shiftValidationSchema,
    onSubmit: async (values) => {
      const startTime = moment(
        `${values.startHour}:${values.startMinute} ${values.startAmPm}`,
        'h:mm A').format('HH:mm');
      const endTime = moment(
        `${values.endHour}:${values.endMinute} ${values.endAmPm}`,
        'h:mm A').format('HH:mm');
      values = {
        ...values,
        startTime: startTime,
        endTime: endTime
      }
      console.log(values);

      if (moment(endTime, "hh:mm A").isSameOrAfter(moment(startTime, "hh:mm A")) &&
        !moment(endTime, "hh:mm A").isSame(moment(startTime, "hh:mm A"))) {
        const addShiftPromise = addShift(values)
        toast.promise(
          addShiftPromise,
          {
            loading: 'Adding shift',
            success: (result) => {
              addFormFormik.resetForm()
              getShiftData()
              return result.msg
            },
            error: (err) => {
              return err.msg
            }


          }
        )
      }
      else {
        alert("start time should be less than end time.")
      }

    }
  })

  const editShiftSchema = Yup.object().shape({
    startTime: Yup.string().required("Start time is required"),
    endTime: Yup.string().required("End time is required"),
    shiftName: Yup.string().max(100, "Too long").required("Required")
  })
  const editFormFormik = useFormik({
    initialValues: {
      shiftName: '',
      startTime: '',
      endTime: '',
      active: false
    },
    validationSchema: editShiftSchema,
    onSubmit: async (values) => {
      if (moment(values.endTime, "hh:mm A").isSameOrAfter(moment(values.startTime, "hh:mm A")) &&
        !moment(values.endTime, "hh:mm A").isSame(moment(values.startTime, "hh:mm A"))) {
        const updateShiftPromise = updateShift(values)
        toast.promise(
          updateShiftPromise,
          {
            loading: "Updating data",
            success: result => {
              editFormFormik.resetForm();
              setShowEditModal(false);
              getShiftData();
              // handleSearch();
              return <b>{result.msg}</b>; // Return a React element
            },
            error: err => <b>{err.msg}</b>, // Return a React element
          }
        )
      }
      else {
        alert("start time should be less than end time.")
      }
    }
  })


  const handleDelete = (shiftId) => {
    console.log(shiftId);
    const deleteShiftPromise = deleteShift(shiftId)

    toast.promise(
      deleteShiftPromise,
      {
        loading: "Deleting data",
        success: result => {
          editFormFormik.resetForm()
          // searchFormFormik.resetForm()
          setShiftData([])
          getShiftData();

          return result.msg
        },
        error: err => { return err.msg }
      }
    )

  };

  const handleEdit = (shiftData) => {
    const editValues = {
      shiftId: shiftData.shift_id,
      shiftName: shiftData.shift_name,
      startTime: shiftData.start_time,
      endTime: shiftData.end_time,
      active: shiftData.active
    }
    editFormFormik.setValues(editValues)
    setShowEditModal(true)
  };



  const handleModalClose = () => {
    editFormFormik.resetForm()
    setShowEditModal(false);
  }

  useEffect(() => {
    getShiftData();
  }, [])

  const getShiftData = () => {
    const getShiftPromise = getShift()
    getShiftPromise.then(async (result) => {
      setShiftData(result)

    }).catch((err) => { })
  }

  const handleTickBoxChangeAdd = () => {
    addFormFormik.setFieldValue("active", !addFormFormik.values.active)
  }
  console.log("The shift value is " + addFormFormik.values.active);
  const handleTickBoxChangeEdit = () => {
    editFormFormik.setFieldValue("active", !editFormFormik.values.active)
  }

  return (
    <div>
      <WindalsNav/>
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className='shiftconf'>
        <div className="form-container">
          <h1>Shift Configuration</h1>
          <p>Add a new shift</p>

          <Form>
            <Form.Group className="mb-3" controlId="formBasicName">
              <label>Shift Name</label>
              <Form.Control
                type="text"
                placeholder="Enter Shift Name"
                value={addFormFormik.values.shiftName}
                name="shiftName"
                onChange={addFormFormik.handleChange}
              />
              {addFormFormik.touched.shiftName && addFormFormik.errors.shiftName ? (
                <Alert variant="danger" className="error-message">{addFormFormik.errors.shiftName}</Alert>) : null}
            </Form.Group>

            {/* <Form.Group className="mb-3" controlId="formBasicTime">
            <Form.Control type="time" placeholder="start time" value={addFormFormik.values.startTime} name="startTime" onChange={addFormFormik.handleChange} />
            {addFormFormik.touched.startTime && addFormFormik.errors.startTime ? (
              <Alert variant="danger" className="error-message">{addFormFormik.errors.startTime}</Alert>
            ) : null}
          </Form.Group> */}

            <Form.Group className="mb-3" controlId="formBasicTime">
              <label>Start Time (AM/PM)</label>
              <div className="d-flex align-items-center">
                <Form.Control
                  as="select"
                  name="startAmPm"
                  value={addFormFormik.values.startAmPm}
                  onChange={addFormFormik.handleChange}
                  style={{margin:10}}
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </Form.Control>
                {addFormFormik.touched.startAmPm && addFormFormik.errors.startAmPm ? (
                  <Alert variant="danger" className="error-message">{addFormFormik.errors.startAmPm}</Alert>) : null}
                <Form.Control
                  type="number"
                  min="1"
                  max="12"
                  name="startHour"
                  value={addFormFormik.values.startHour}
                  onChange={addFormFormik.handleChange}
                  style={{margin:10}}
                />
                {addFormFormik.touched.startHour && addFormFormik.errors.startHour ? (
                  <Alert variant="danger" className="error-message">{addFormFormik.errors.startHour}</Alert>) : null}
                :
                <Form.Control
                  type="number"
                  min="0"
                  max="59"
                  name="startMinute"
                  value={addFormFormik.values.startMinute}
                  onChange={addFormFormik.handleChange}
                  style={{margin:10}}
                />
                {addFormFormik.touched.startMinute && addFormFormik.errors.startMinute ? (
                  <Alert variant="danger" className="error-message">{addFormFormik.errors.startMinute}</Alert>) : null}
              </div>

            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicTime">
              <label>End Time (AM/PM)</label>
              <div className="d-flex align-items-center">
                <Form.Control
                  as="select"
                  name="endAmPm"
                  value={addFormFormik.values.endAmPm}
                  onChange={addFormFormik.handleChange}
                  style={{margin:10}}
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </Form.Control>
                {addFormFormik.touched.endAmPm && addFormFormik.errors.endAmPm ? (
                  <Alert variant="danger" className="error-message">{addFormFormik.errors.endAmPm}</Alert>) : null}
                <Form.Control
                  type="number"
                  min="1"
                  max="12"
                  name="endHour"
                  value={addFormFormik.values.endHour}
                  onChange={addFormFormik.handleChange}
                  style={{margin:10}}
                />
                {addFormFormik.touched.endHour && addFormFormik.errors.endHour ? (
                  <Alert variant="danger" className="error-message">{addFormFormik.errors.endHour}</Alert>) : null}
                  :
                <Form.Control
                  type="number"
                  min="0"
                  max="59"
                  name="endMinute"
                  value={addFormFormik.values.endMinute}
                  onChange={addFormFormik.handleChange}
                  style={{margin:10}}
                />
                {addFormFormik.touched.endMinute && addFormFormik.errors.endMinute ? (
                  <Alert variant="danger" className="error-message">{addFormFormik.errors.endMinute}</Alert>) : null}
              </div>

            </Form.Group>





            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <div>
                <label>Active</label>
                <input
                  type="checkbox"
                  name="active"
                  checked={addFormFormik.values.active}
                  onChange={handleTickBoxChangeAdd}
                // onClick={changetogreen}
                />
              </div>
            </Form.Group>

            <Button className="submit-button" variant="primary" type="submit" onClick={addFormFormik.handleSubmit}>
              Submit
            </Button>
          </Form>
        </div>
        <br />



        <div >
          <table className='shifttable'>
            <thead>
            </thead>
            <tbody>
              <tr>
                <th>#</th>
                <th>Shift Name</th>
                <th>Start time</th>
                <th>End time</th>
                <th>Active</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
              {

                Array.isArray(shiftData) && shiftData.map((shiftdata, index) => (
                  <tr key={index} className={shiftdata.active == 1 ? "green-value" : "red-value"}>
                    <td>
                      {index + 1}
                    </td>
                    <td>
                      {shiftdata.shift_name}
                    </td>
                    <td>
                      {shiftdata.start_time}
                    </td>
                    <td>
                      {shiftdata.end_time}
                    </td>
                    <td>
                      {shiftdata.active == 1 ? "yes" : "no"}
                    </td>
                    <td>
                      <button
                        className="edit-button"
                        onClick={() => handleEdit(shiftdata)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                    </td>
                    <td>
                      <button
                        className="edit-button"
                        onClick={() => handleDelete(shiftdata.shift_id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))
              }

            </tbody>
          </table>

        </div>
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />

      <div>
        <Modal
          show={showEditModal}
          onHide={handleModalClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit the Shift as per required</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              Shift Name: {editFormFormik.values.shiftName}

              <Form.Group className="mb-3" controlId="formBasicEmail">
                <label>Start Time</label>
                <Form.Control type="time" placeholder="Enter Start Time" value={editFormFormik.values.startTime} name="startTime" onChange={editFormFormik.handleChange} />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicEmail">
                <label>End Time</label>
                <Form.Control type="time" placeholder="Enter End Time " value={editFormFormik.values.endTime} name="endTime" onChange={editFormFormik.handleChange} />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <div>
                  <label> Active </label>
                  <input
                    type="checkbox"
                    name="active"
                    checked={editFormFormik.values.active}
                    onChange={handleTickBoxChangeEdit}
                  />
                </div>
              </Form.Group>

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


      </div>
      <Footer />
    </div>
  )
}

export default ShiftConfiguration