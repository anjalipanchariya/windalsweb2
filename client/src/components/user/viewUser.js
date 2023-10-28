import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../../helper/helper';
import toast, { Toaster } from 'react-hot-toast';
import Table from '../table';
import WindalsNav from '../navbar';
import Footer from '../footer';

function ViewUser() { // Changed the function name to start with an uppercase letter

  const [users, setUsers] = useState([]);
 
  const accessOptions = [ "Add User", "View User", "Delete User", "Modify User", "Add Product", "Veiw Product", "Delete Product", "Modify Product",
  "Add Station", "View Station", "Delete Station", "Modify Station", "Allocate Next Station for Product", "Update Next Station Allocated for Product", 
 "Modify Next Station Allocated for Product", "View Next Station Allocated for Product", "Allocate Station to Worker", "View Station allocated to worker"] 
 
  const columns = [
    { field: 'employee_id', label: 'Employee ID' },
    { field: 'first_name', label: 'First Name' },
    { field: 'last_name', label: 'Last Name' },
    { field: 'designation', label: 'Designation' },
    { field: 'joining_date', label: 'Joining Date' },
    { field: 'leaving_date', label: 'Leaving Date' },
    { field: 'mobile_no', label: 'Mobile Number' },
    { field: 'nick_name', label: 'Nick Name' },
    { field: 'user_name', label: 'User Name' },
    { field: 'access_given', label: 'Access Given'}
  ];
  
  useEffect(() => {
    // Fetch stations data
    const fetchData = async () => {
      try {
        const result = await getAllUsers();
        console.log({result:result});
        const modifiedUsers = result.map((user) => {
          if (user.mobile_no == null) {
            user.mobile_no = "Not entered";
          }
          if (user.leaving_date == null) {
            user.leaving_date = "N.A.";
          }
        
          // Check if access_given is defined before splitting
          if (user.access_given) {
            const accessGivenArray = user.access_given.split("");
            const accessGivenNames = [];
        
            accessOptions.forEach((option, index) => {
              if (accessGivenArray[index] === "1") {
                accessGivenNames.push(option);
              }
            });
        
            if (accessGivenNames.length > 0) {
              user.access_given = accessGivenNames.join(", ");
            } else {
              user.access_given = "None";
            }
          } else {
            user.access_given = "None"; // Set a default value if access_given is undefined
          }
        
          return user;
        });
        setUsers(modifiedUsers);
        toast.success(<b>Data fetched successfully</b>);
      } catch (error) {
        toast.error(error.message || 'An error occurred');
      }
    };

    // Call the fetchData function
    fetchData();
  }, []); // Empty dependency array to run only once


  return (
    <>
    <WindalsNav/>
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div style={{marginTop:'18vh'}}>
      <Table columns={columns} data={users} />
      </div>
      <br />
      <br />
      
      <Footer/>
    </>
  );
}

export default ViewUser;