import React, {useState, useEffect} from 'react';
import {  Button, Alert } from 'react-bootstrap';
import './addProduct.css';
import { addProduct } from '../../helper/helper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import WindalsNav from '../navbar';
import * as Yup from 'yup';
import Select from 'react-select'
import { getProductNames } from "../../helper/helper";
import Table from '../table'
import Footer from '../footer';

const AddProduct = () => {
  const validationSchema = Yup.object().shape({
    productName: Yup.string().required('Product name is required'),
    parameters: Yup.array().of(
      Yup.object().shape({
        parameterName: Yup.string()
          .required('Name is required')
          .matches(/^[A-Za-z]+$/, 'Parameter name should contain only letters'),
        minVal: Yup.number()
          .required('Min value is required')
          .typeError('Min value must be a number')
          .lessThan(Yup.ref('maxVal'), 'Min value should be less than max value'),
        maxVal: Yup.number()
          .required('Max value is required')
          .typeError('Max value must be a number'),
        unit: Yup.string().required('Unit is required'),
      })
    ),
  });

  const formik = useFormik({
    initialValues: {
      productName: '',
      parameters: [],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const addProductPromise = addProduct(values);
      toast.promise(
        addProductPromise,
        {
          loading: 'Uploading data', // This should be a plain string
          success:  result => {
                     formik.resetForm();
                     formik.setFieldValue("parameters",[])
                    return result.msg
                },
          error: err => <b>{err.msg}</b>
        }
      );
      
    },
  });

  const addRow = () => {
    formik.setFieldValue('parameters', [
      ...formik.values.parameters,
      { parameterName: '', minVal: '', maxVal: '', unit: '' },
    ]);
  };

  const handleParameterChange = (index, field, value) => {
    const updatedParameters = [...formik.values.parameters];
    updatedParameters[index][field] = value;
    formik.setFieldValue('parameters', updatedParameters);
  };

  const handleDeleteRow = (index) => {
    const updatedParameters = [...formik.values.parameters];
    updatedParameters.splice(index, 1);
    formik.setFieldValue('parameters', updatedParameters);
  };

//anjali code
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
  return (
    <div className="productadd">
      <WindalsNav />
      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <div className="product-name-container">
        <h3 className="product-name">Product name</h3>

        <input
          className="product-input"
          type="text"
          value={formik.values.productName}
          placeholder="Enter Product Name"
          onChange={formik.handleChange}
          name="productName"
        />
        {formik.touched.productName && formik.errors.productName && (
          <Alert variant="danger" className="paramererName-error-message">
            {formik.errors.productName}
          </Alert>
        )}
      

      <div className="parameter-buttons">
        <Button className="add-parameter-button" onClick={addRow}>Add parameter</Button>
        
        {/* <Button className="save-button" onClick={formik.handleSubmit}>Save</Button> */}
      </div>
       <br />  


    { formik.values.parameters.length>0 ? 
      <table className="product-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Max</th>
            <th>Min</th>
            <th>Unit</th>
            <th>Delete row</th>
          </tr>
        </thead>
        <tbody>
          {formik.values.parameters.map((parameter, index) => (
            <tr key={index} className={index % 2 === 0 ? 'light-red-row' : 'red-row'}>
              <td>{index + 1}</td>
              <td>
                <input
                  type="text"
                  value={parameter.parameterName}
                  onChange={(e) =>
                    handleParameterChange(index, 'parameterName', e.target.value)
                  }
                  name={`parameters[${index}].parameterName`}
                />
                {formik.touched.parameters && formik.touched.parameters[index] && formik.errors.parameters?.[index]?.parameterName && (
                  <Alert variant="danger" className="error-message">
                    {formik.errors.parameters[index].parameterName}
                  </Alert>
                )}
              </td>
              <td>
                <input
                  type="number"
                  value={parameter.maxVal}
                  onChange={(e) =>
                    handleParameterChange(index, 'maxVal', e.target.value)
                  }
                  name={`parameters[${index}].maxVal`}
                />
                {formik.touched.parameters && formik.touched.parameters[index] && formik.errors.parameters?.[index]?.maxVal && (
                  <Alert variant="danger" className="error-message">
                    {formik.errors.parameters[index].maxVal}
                  </Alert>
                )}
              </td>
              <td>
                <input
                  type="number"
                  value={parameter.minVal}
                  onChange={(e) =>
                    handleParameterChange(index, 'minVal', e.target.value)
                  }
                  name={`parameters[${index}].minVal`}
                />
                {formik.touched.parameters && formik.touched.parameters[index] && formik.errors.parameters?.[index]?.minVal && (
                  <Alert variant="danger" className="error-message">
                    {formik.errors.parameters[index].minVal}
                  </Alert>
                )}
              </td>
              <td>
                <input
                  type="text"
                  value={parameter.unit}
                  onChange={(e) =>
                    handleParameterChange(index, 'unit', e.target.value)
                  }
                  name={`parameters[${index}].unit`}
                />
                {formik.touched.parameters && formik.touched.parameters[index] && formik.errors.parameters?.[index]?.unit && (
                  <Alert variant="danger" className="error-message">
                    {formik.errors.parameters[index].unit}
                  </Alert>
                )}
              </td>
              <td>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteRow(index)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
       : null
      }
      <br />
      <Button className="save-button" onClick={formik.handleSubmit}>Save</Button>
      </div>
      <br />
      <br />
      <Footer/>
    </div>
  );
};

export default AddProduct;
