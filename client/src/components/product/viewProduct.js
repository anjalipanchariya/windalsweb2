import React, { useEffect, useState } from 'react';
import { getAllProducts } from '../../helper/helper';
import toast, { Toaster } from 'react-hot-toast';
import Table from '../table';
import WindalsNav from '../navbar';
import Footer from '../footer';
function ViewProduct() { // Changed the function name to start with an uppercase letter

  const [products, setProducts] = useState([]);

  const columns = [
    
    { field: 'product_name', label: 'Product Name' },
    { field: 'parameter', label: 'Parameter' },
    { field: 'min_parameter', label: 'Min Parameter' },
    { field: 'max_parameter', label: 'Max Parameter' },
    { field: 'unit', label: 'Unit' },
    { field: 'evaluation', label: 'Evaluation Technique' },
    { field: 'sample_size', label: 'Sample Size' },
    { field: 'compulsory', label: 'Compulsory' },
    { field: 'value_oknotok', label: 'Paramete Status' }

  ];
  
  useEffect(() => {
    const getProductInfoPromise = getAllProducts();

    toast.promise(getProductInfoPromise, { // Changed toast.process to toast.promise
      loading: "Fetching data",
      success: (result) => {
        setProducts(result);
        toast.success(<b>Data fetched successfully</b>);
      },
      error: (err) => {
        toast.error(err.msg);
      },
    });
  }, []);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <WindalsNav />
      <div style={{marginTop:'20vh'}}>
        <h1 className='heading'>Product Details</h1>
      <Table columns={columns} data={products} />
      </div>
      <br />
      <br />
      
      <Footer/>
      
    </>
  );
}

export default ViewProduct;
