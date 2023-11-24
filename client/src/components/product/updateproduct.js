import React, { useState , useEffect} from 'react';
import { Table, Button, Alert } from 'react-bootstrap';
import './updateproduct.css';
import './addProduct.css'
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { addProduct, getAllProducts, updateProducts, deleteProductParameter, getOneProductAllParameters, getOneProductOneParameter } from "../../helper/helper";
import WindalsNav from '../navbar';
import Select from 'react-select';
import {getProductNames} from "../../helper/helper";
import { useNavigate } from 'react-router-dom';
import Footer from '../footer';


function UpdateProduct() {

    const validationSchema = Yup.object().shape({

        productName:Yup.string().required('Product name is required'),
        newParameters:Yup.array().of(
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
              unit: Yup.string().required('Unit is required')
            })
        ),
        existingParameters:Yup.array().of(
            Yup.object().shape({
              
              minVal: Yup.number()
                .required('Min value is required')
                .typeError('Min value must be a number')
                .lessThan(Yup.ref('maxVal'), 'Min value should be less than max value'),
              maxVal: Yup.number()
                .required('Max value is required')
                .typeError('Max value must be a number'),
              unit: Yup.string().required('Unit is required')
            })
        )
});
    const navigate = useNavigate()


    const formik = useFormik({
        initialValues: {
            productName: "",
            existingParameters: [],
            newParameters: [],
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            console.log(values);
            const updateProductsPromise = updateProducts(values.productName, values.existingParameters)
            toast.promise(
                    updateProductsPromise,
                    {
                        loading: 'Updating data',
                        success: result => {
                            if(values.newParameters.length>0){
                                const addValues = {productName: values.productName,parameters:values.newParameters}
                                const addProductPromise = addProduct(addValues);
                                toast.promise(
                                    addProductPromise,
                                    {
                                        loading: 'Adding New newParameters',
                                        success: addResult => {
                                            formik.setFieldValue('newParameters',[])
                                            return addResult.msg
                                        }

                                }
                            )
                        }
                        formik.resetForm()
                        formik.setFieldValue('existingParameters', [])
                        return result.msg
                    },
                    error: err => { 
                      <b>err.msg</b>
                      if(err.redirectUrl){
                        navigate(err.redirectUrl)
                      } 
                    }
                }
            )
        }
    })

    const addRow = () => {
        formik.setFieldValue('newParameters', [
            ...formik.values.newParameters,
            { parameterName: '', minVal: '', maxVal: '', unit: '',evaluation:'',sample_size:'',unitPresent:false,parameterStatus:'1' },
        ]);
    };

    const handleExistingParameterChange = (index, field, value) => {
        const updatedParameters = [...formik.values.existingParameters];
        updatedParameters[index][field] = value;
        formik.setFieldValue('existingParameters', updatedParameters);
    };

    const handleNewParameterChange = (index, field, value) => {
        const updatedParameters = [...formik.values.newParameters];
        updatedParameters[index][field] = value;
        formik.setFieldValue('newParameters', updatedParameters);
    };

    const handleSearch = () => {
        const getAllProductParameterPromise = getOneProductAllParameters(formik.values.productName)

        getAllProductParameterPromise.then((result) => {
            const newParameters = result.map((parameter) => {

                return {
                    id: parameter.id,
                    parameterName: parameter.parameter,
                    maxVal: parameter.max_parameter,
                    minVal: parameter.min_parameter,
                    unit: parameter.unit,
                    evaluation:parameter.evaluation,
                    sample_size:parameter.sample_size,
                    unitPresent: parameter.compulsory==1 ? true : false,
                    parameterStatus: parameter.value_oknotok==1 ? '1' : '0'
                }
            })

            formik.setFieldValue('existingParameters',newParameters)
            console.log(formik.values.existingParameters)
        }).catch((err)=>{

            toast.error(err.msg)
        })
    }

    const handleExistingParametersDeleteRow = (index, productId) => {
        const deleteProductParameterPromise = deleteProductParameter(productId)
        toast.promise(
            deleteProductParameterPromise,
            {
                loading: `Deleting product at index ${index}`,
                success: result => {
                    handleSearch();
                    return result.msg
                },
                error: err => { return err.msg }
            }
        )
        // const updatedParameters = [...formik.values.existingParameters];
        // updatedParameters.splice(index, 1);
        // formik.setFieldValue('existingParameters', updatedParameters);
    };

    const handleNewParametersDeleteRow = (index) => {
        const updatedParameters = [...formik.values.newParameters];
        updatedParameters.splice(index, 1);
        formik.setFieldValue('newParameters', updatedParameters);
    };

    // const opts = [
    //     {value:"abc", label:"ABC"},
    //     {value:"xyz", label:"XYZ"},
    //     {value:"pqr", label:"PQR"},
    //     {value:"product-a", label:"Product A"},
    //   ]

      const [productnames, setproductnames] = useState([]);
      useEffect(() => {
        const getProductNamesPromise = getProductNames()
        const arr = [];
        getProductNamesPromise.then(async (result) => {
            const productnames = await result.map((product) => {
                return arr.push({value: product.product_name,label:product.product_name})
            })
            setproductnames(arr)
        }).catch((err) => { })
    }, [])

    

    return (
        <>
        
            <WindalsNav />
            <Toaster position="top-center" reverseOrder={false}></Toaster>
            <div>
            <div className="updateprod">
                <h3>Product name:</h3>
                {/* <input
                    type="text"
                    value={formik.values.productName}
                    placeholder="Enter Product Name"
                    onChange={formik.handleChange}
                    name='productName'
                /> */}

                <Select
                    className='selectopts'
                    options={productnames}
                    value={{
                        value: formik.values.productName,
                        label: formik.values.productName
                    }}
                    onChange={(selectedOption) =>
                        formik.setFieldValue('productName', selectedOption.value)
                    }
                    name="productName"
                    isSearchable={true}
                />
                {formik.touched.productName && formik.errors.productName && (
                    <Alert variant="danger" className="paramererName-error-message">
                        {formik.errors.productName}
                    </Alert>
                )}

                <div className='buttons'>
                    <Button onClick={handleSearch} style={{ margin: 6 }}>Search</Button>
                    <Button onClick={addRow} style={{ margin: 10 }}>Add parameter</Button>
                    
                </div>
            
            <p style={{ textAlign: 'center', fontWeight:'bold' }}>
                Existing parameter
            </p>
            <table className='product-table'>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Max</th>
                        <th>Min</th>
                        <th>Unit</th>
                        <th>Evaluation Technique</th>
                        <th>Sample Size</th>
                        <th>Compulsory</th> 
                        <th>Parameter Status</th>
                        <th>Delete row(paramterer)</th>
                    </tr>
                </thead>

                <tbody>
                    {Array.isArray(formik.values.existingParameters) && formik.values.existingParameters.map((parameter, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                                {parameter.parameterName}
                            </td>
                            <td>
                                <input
                                    type="number"
                                    value={parameter.maxVal}
                                    onChange={(e) => handleExistingParameterChange(index, 'maxVal', e.target.value)}
                                    name={`existingParameters[${index}].maxVal`}
                                />
                                {formik.touched.existingParameters && formik.touched.existingParameters[index] && formik.errors.existingParameters?.[index]?.maxVal && (
                                <Alert variant="danger" className="error-message">
                                    {formik.errors.existingParameters[index].maxVal}
                                </Alert>
                                )}
                                
                            </td>
                            <td>
                                <input
                                    type="number"
                                    value={parameter.minVal}
                                    onChange={(e) => handleExistingParameterChange(index, 'minVal', e.target.value)}
                                    name={`existingParameters[${index}].minVal`}
                                />
                                {formik.touched.existingParameters && formik.touched.existingParameters[index] && formik.errors.existingParameters?.[index]?.minVal && (
                                <Alert variant="danger" className="error-message">
                                    {formik.errors.existingParameters[index].minVal}
                                </Alert>
                                )}
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={parameter.unit}
                                    onChange={(e) => handleExistingParameterChange(index, 'unit', e.target.value)}
                                    name={`existingParameters[${index}].unit`}
                                />
                                {formik.touched.existingParameters && formik.touched.existingParameters[index] && formik.errors.existingParameters?.[index]?.unit && (
                                <Alert variant="danger" className="error-message">
                                    {formik.errors.existingParameters[index].unit}
                                </Alert>
                                )}
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={parameter.evaluation}
                                    onChange={(e) => handleExistingParameterChange(index, 'evaluation', e.target.value)}
                                    name={`existingParameters[${index}].evaluation`}
                                />
                                {formik.touched.existingParameters && formik.touched.existingParameters[index] && formik.errors.existingParameters?.[index]?.evaluation && (
                                <Alert variant="danger" className="error-message">
                                    {formik.errors.existingParameters[index].evaluation}
                                </Alert>
                                )}
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={parameter.sample_size}
                                    onChange={(e) => handleExistingParameterChange(index, 'sample_size', e.target.value)}
                                    name={`existingParameters[${index}].sample_size`}
                                />
                                {formik.touched.existingParameters && formik.touched.existingParameters[index] && formik.errors.existingParameters?.[index]?.sample_size && (
                                <Alert variant="danger" className="error-message">
                                    {formik.errors.existingParameters[index].sample_size}
                                </Alert>
                                )}
                            </td>
                            <td>
                                <input
                                    type="checkbox"
                                    name={`existingParameters[${index}].unitPresent`}
                                    checked={parameter.unitPresent} 
                                    onChange={(e) =>
                                        handleExistingParameterChange(index, 'unitPresent', e.target.checked)
                                    }
                                />
                            </td>
                            <td>
                                <select
                                    value={parameter.parameterStatus}
                                    name={`existingParameters[${index}].parameterStatus`}
                                    onChange={(e) =>
                                        handleExistingParameterChange(index, 'parameterStatus', e.target.value)
                                    }
                                >
                                    <option value="1">Value</option>
                                    <option value="0">Okay/Not-Okay</option>
                                </select>
                            </td>
                            <td>
                                <button
                                className="delete-button"
                                onClick={() => handleExistingParametersDeleteRow(index,parameter.id)}
                                >
                                <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>



            <p style={{ textAlign: 'center', fontWeight:'bold' }}>
                New parameter
            </p>

            <table className='product-table'>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Max</th>
                        <th>Min</th>
                        <th>Unit</th>
                        <th>Evaluation Technique</th>
                        <th>Sample Size</th>
                        <th>Compulsory</th>  
                        <th>Parameter Status</th>
                        <th>Delete row</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(formik.values.newParameters) && formik.values.newParameters.map((parameter, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>

                            <input
                                type="text"
                                value={parameter.parameterName}
                                onChange={(e) =>
                                    handleNewParameterChange(index, 'parameterName', e.target.value)
                                }
                                name={`newParameters[${index}].parameterName`}
                            />
                            {formik.touched.newParameters && formik.touched.newParameters[index] && formik.errors.newParameters?.[index]?.parameterName && (
                            <Alert variant="danger" className="error-message">
                                {formik.errors.newParameters[index].parameterName}
                            </Alert>
                            )}

                            </td>
                            <td>
                                <input
                                    type="number"
                                    value={parameter.maxVal}
                                    onChange={(e) => handleNewParameterChange(index, 'maxVal', e.target.value)}
                                    name={`newParameters[${index}].maxVal`}
                                />
                                {formik.touched.newParameters && formik.touched.newParameters[index] && formik.errors.newParameters?.[index]?.maxVal && (
                                <Alert variant="danger" className="error-message">
                                    {formik.errors.newParameters[index].maxVal}
                                </Alert>
                                )}
                            </td>
                            <td>
                                <input
                                    type="number"
                                    value={parameter.minVal}
                                    onChange={(e) => handleNewParameterChange(index, 'minVal', e.target.value)}
                                    name={`newParameters[${index}].minVal`}
                                />
                                {formik.touched.newParameters && formik.touched.newParameters[index] && formik.errors.newParameters?.[index]?.minVal && (
                                <Alert variant="danger" className="error-message">
                                    {formik.errors.newParameters[index].minVal}
                                </Alert>
                                )}
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={parameter.unit}
                                    onChange={(e) => handleNewParameterChange(index, 'unit', e.target.value)}
                                    name={`newParameters[${index}].unit`}
                                />
                                {formik.touched.newParameters && formik.touched.newParameters[index] && formik.errors.newParameters?.[index]?.unit && (
                                <Alert variant="danger" className="error-message">
                                    {formik.errors.newParameters[index].unit}
                                </Alert>
                                )}
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={parameter.evaluation}
                                    onChange={(e) => handleNewParameterChange(index, 'evaluation', e.target.value)}
                                    name={`newParameters[${index}].evaluation`}
                                />
                                {formik.touched.newParameters && formik.touched.newParameters[index] && formik.errors.newParameters?.[index]?.evaluation && (
                                <Alert variant="danger" className="error-message">
                                    {formik.errors.newParameters[index].evaluation}
                                </Alert>
                                )}
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={parameter.sample_size}
                                    onChange={(e) => handleNewParameterChange(index, 'sample_size', e.target.value)}
                                    name={`newParameters[${index}].sample_size`}
                                />
                                {formik.touched.newParameters && formik.touched.newParameters[index] && formik.errors.newParameters?.[index]?.sample_size && (
                                <Alert variant="danger" className="error-message">
                                    {formik.errors.newParameters[index].sample_size}
                                </Alert>
                                )}
                            </td>
                            <td>
                                <input
                                    type="checkbox"
                                    name={`existingParameters[${index}].unitPresent`}
                                    checked={parameter.unitPresent} 
                                    onChange={(e) =>
                                        handleNewParameterChange(index, 'unitPresent', e.target.checked)
                                    }
                                />
                            </td>
                            <td>
                                <select
                                    value={parameter.parameterStatus}
                                    name={`existingParameters[${index}].parameterStatus`}
                                    onChange={(e) =>
                                        handleNewParameterChange(index, 'parameterStatus', e.target.value)
                                    }
                                >
                                    <option value="1">Value</option>
                                    <option value="0">Okay/Not-Okay</option>
                                </select>
                            </td>
                            <td>
                                <button
                                    className="delete-button"
                                    onClick={() => handleNewParametersDeleteRow(index)}
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <br />
            
            <Button onClick={formik.handleSubmit}>Save</Button>
            </div>
            
            </div>
            <br />
            <br />
        <Footer/>
        </>
    );
}

export default UpdateProduct;