import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const proxy = "http://127.0.0.1:8080/"

export async function addProduct(values){
    try {
        const token = localStorage.getItem("token")
        const {data,status} = await axios.post(`${proxy}api/ProductMasterInsert`,values,{headers:{"Authorization":`Bearer ${token}`}})
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data);
    }
}

export async function updateProducts(productName,existingParameters){
    const values = {productName:productName,parameters:existingParameters}
    const token = localStorage.getItem("token")
    try {
        const {data,status} = await axios.put(`${proxy}api/ProductMasterUpdate`,values,{headers:{"Authorization":`Bearer ${token}`}})
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data);
    }
}

export async function deleteProductParameter(productId){
    try{
        const token = localStorage.getItem("token")
        const {data,status} = await axios.delete(`${proxy}api/ProductMasterDelete`,{params:{productId},headers:{"Authorization":`Bearer ${token}`}})
        return Promise.resolve(data)
    }catch(error){
        return Promise.reject(error.response.data);
    }
}

export async function getAllProducts(){
    try{
        const {data,status} = await axios.get(`${proxy}api/ProductMasterGet`)
        return Promise.resolve(data)
    } catch(error){
        return Promise.reject(error.response.data);
    }
}

export async function getOneProductAllParameters(productName){
    try {
        const {data,status} = await axios.get(`${proxy}api/ProductMasterGetOneProductAllParameters`,{params:{productName:productName}})
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data);
    }
}

export async function getOneProductOneParameter(values){
    const {productName,productParameter} = values
    try {
        const {data,status} = await axios.get(`${proxy}api/ProductMasterGetOneProductOneParameter`,{params:{productName:productName,productParameter:productParameter}})
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data);
    }
}

export async function getProductNames(){
    try {
        const {data,status} = await axios.get(`${proxy}api/ProductMasterGetProductNames`)
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function addStation(values){
    try {
        const token = localStorage.getItem("token")
        const {data,status} = await axios.post(`${proxy}api/StationMasterInsert`,values,{headers:{"Authorization":`Bearer ${token}`}})
        console.log(data);
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function getStations(){
    try {
        const {data,status} = await axios.get(`${proxy}api/StationMasterGet`)
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function getOneStation(stationName){
    try {
        const {data,status} = await axios.get(`${proxy}api/StationMasterGetOneStation`,{params:{stationName}})
        return Promise.resolve(data)
    } catch (error) {
        console.log(error);
        return Promise.reject(error.response.data)
    }
}

export async function getOneStationOneProduct(values){
    try {
        const {data,status} = await axios.get(`${proxy}api/StationMasterGetOneStationOneProduct`,{params:{values}})
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function deleteStation(values){
    try {
        const token = localStorage.getItem("token")
        const {data,status} = await  axios.delete(`${proxy}api/StationMasterDelete`,{params:{values},headers:{"Authorization":`Bearer ${token}`}})
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function updateStation(values){
    try {
        const token = localStorage.getItem("token")
        const {data,status} = await axios.put(`${proxy}api/StationMasterUpdate`,values,{headers:{"Authorization":`Bearer ${token}`}})
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function getAllStationNames(){
    try {
        const {data,status} = await axios.get(`${proxy}api/StationMasterGetNames`)
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function getAllStationsAndMachinesInfo(){
    try {
        const {data,status} = await axios.get(`${proxy}api/GetStationAndMachinesInfo`)
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}


export async function getOneProductStationNames(productName){
    try {
        const {data,status} = await axios.get(`${proxy}api/StationMasterGetNamesForOneProduct`,{params:{productName:productName.value}})
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}



export async function registerUser(values){
    try {
        const token = localStorage.getItem("token")
        const {data,status} = await axios.post(`${proxy}api/EmployeeMasterInsert`,values,{headers:{"Authorization":`Bearer ${token}`}})
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function getAllUsers(){
    try {
        const {data,status} = await axios.get(`${proxy}api/EmployeeMasterGet`)
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function getAllWorkerNames(){
    try {
        const {data,status} = await axios.get(`${proxy}api/EmployeeMasterGetNames`)
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function getOneEmployee(userName){
    try {
        const {data,status} = await axios.get(`${proxy}api/EmployeeMasterGetOne`,{params:{userName}})
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function updateEmployee(values){
    try {
        const token = localStorage.getItem("token")
        const {data,status} = await axios.put(`${proxy}api/EmployeeMasterUpdate`,values,{headers:{"Authorization":`Bearer ${token}`}})
        return Promise.resolve(data)
    } catch (error) {
        console.log(error);
        return Promise.reject(error.response.data)
    }
}

export async function deleteEmployee(employeeId){
    try {
        const token = localStorage.getItem("token")
        const {data,status} = await axios.delete(`${proxy}api/EmployeeMasterDelete`,{params:{employeeId},headers:{"Authorization":`Bearer ${token}`}})
        return Promise.resolve(data)
    } catch (error) {
        console.log(error);
        return Promise.reject(error.response.data)
    }
}

export async function addStationAllocation(values){
    try {
        const token = localStorage.getItem("token")
        const {data,status} = await axios.post(`${proxy}api/StationAllocationInsert`,values,{headers:{"Authorization":`Bearer ${token}`}})
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function getWorkerAllocation(){
    const currentDate = new Date();

  // Get year, month, and day
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are zero-indexed
  const day = String(currentDate.getDate()).padStart(2, '0');

  // Create the yyyy-mm-dd formatted date string
  const formattedDate = `${year}-${month}-${day}`;
    try{
        const token = localStorage.getItem("token")
        const {data,status} = await axios.get(`${proxy}api/WorkerAllocation`,{params:{date:formattedDate},headers:{"Authorization":`Bearer ${token}`}})
        return Promise.resolve(data)
    } catch(error){
        return Promise.reject(error.response.data)
    }
}


export async function createJobId(values){
    try {
        const {data,status} = await axios.post(`${proxy}api/ProductyyyyInsert`,values)
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function configureNextStation(values){
    const newValues = {
        productName : values.productName.value,
        nextStationAllocation: values.nextStationAllocation.map((station)=>{
            return ({
                currentStation: station.currentStation,
                nextStation: station.nextStation.value
            })
        })
    }
    const token = localStorage.getItem("token")
    try {
        const {data,status} = await axios.put(`${proxy}api/StationMasterAddNextStation`,newValues,{headers:{"Authorization":`Bearer ${token}`}})
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function insertInStationyyyyFirst(values){
    try {
        const {data,status} = await axios.post(`${proxy}api/StationyyyyInsertFirst`,values)
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function insertInStationyyyyFirstNextStation(values){
    try {
        const {data,status} = await axios.post(`${proxy}api/StationyyyyInsertFirstNextStation`,values)
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function getJobesAtStation(stationId,productName){
    try {
        const {data,status} = await axios.post(`${proxy}api/StationyyyyShowJob`,{station_id:stationId,product_name:productName})
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function updateJobesAtStation(values,stationId,employeeId){
    let formattedString = '';
    
    if (values.reason!=="") {
        // Append the reason to the string if it exists
         if(values.status == -1){
            formattedString += "Not-Okay-"
         }
         else if(values.status == 0){
            formattedString += "Rework-"
         }
          formattedString += "Reason:";
          formattedString += values.reason;
          formattedString += ";"
      }
    
    if (values.parameterValues!==null && values.parameterValues!={}) {
        // Convert parameterValues object to a string
        formattedString += "Parameters:"
        const parameterString = Object.entries(values.parameterValues)
          .map(([key, value]) => `${key},${value}`)
          .join(';');
    
        formattedString += parameterString;
      }
    
      // If neither reason nor parameters exist, set the string to null
      if (formattedString.length === 0) {
        formattedString = null;
      }
    
    const newValues = {
        product_name:values.selectedJob.product_name,
        job_name:values.selectedJob.job_name,
        status:values.status,
        parameters:formattedString,
        station_id:stationId,
        employee_id:employeeId
    }
    console.log({newValues:newValues});
    try {
        const {data,status} = await axios.put(`${proxy}api/Stationyyyyupdate`,newValues)
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function getWorkAtStationInDay(stationId){
    const currentDate = new Date();

  // Get year, month, and day
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are zero-indexed
  const day = String(currentDate.getDate()).padStart(2, '0');

  // Create the yyyy-mm-dd formatted date string
  const formattedDate = `${year}-${month}-${day}`;
    try {
        const {data,status} = await axios.get(`${proxy}api/StationyyyyWorkAtStationInDay`,{params:{stationId,date:formattedDate}})
        console.log(data);
        return Promise.resolve(data)
    } catch (error) {
        console.log(error);
        return Promise.reject(error.response.data)
    }
}

export async function loginUser(values){
    try{
        const {data:loginData,status:loginStatus} = await axios.post(`${proxy}api/login`,values)
        const {token} = loginData
        if(loginStatus===201)
        {
            localStorage.setItem("token",token)
            return Promise.resolve(loginData)
        }
        // else if(loginStatus===201 && loginData.userName!=="admin")
        // {
        //     const currentDate = new Date();
        //     const year = currentDate.getFullYear();
        //     const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-based
        //     const day = String(currentDate.getDate()).padStart(2, "0");
        //     const formattedDate = `${year}-${month}-${day}`;
        //     const {data:workerStationData,status} = await axios.get(`${proxy}api/getOneWorkerStation`,{params:{employeeId:loginData.employeeId,date:formattedDate,shift:values.shift}})
        //     const finalData = {
        //         ...loginData,
        //         ...workerStationData
        //     }
        //     localStorage.setItem("token",token)
        //     return Promise.resolve(finalData)
        // }
    }catch(error){
        return Promise.reject(error.response.data)
    }
}

export async function verifyLogin(){
    const token = localStorage.getItem("token")
    console.log(token);
    try {
        const {status} = await axios.get(`${proxy}api/verifyLogin`,{headers:{"Authorization":`Bearer ${token}`}})
        return Promise.resolve(status)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function addShift(values){
    try {
        const token = localStorage.getItem("token")
        const {data,status} = await axios.post(`${proxy}api/ShiftConfigInsert`,values,{headers:{"Authorization":`Bearer ${token}`}})
        console.log(data);
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function getShift(){
    try {
        const {data,status} = await axios.get(`${proxy}api/ShiftConfigGet`)
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function deleteShift(shiftId){
    try {
        const token = localStorage.getItem("token")
        const {data,status} = await  axios.delete(`${proxy}api/ShiftConfigDelete`,{params:{shiftId},headers:{"Authorization":`Bearer ${token}`}})
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function updateShift(values){
    try {
        const token = localStorage.getItem("token")
        const {data,status} = await axios.put(`${proxy}api/ShiftConfigUpdate`,values,{headers:{"Authorization":`Bearer ${token}`}})
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function getActiveShiftNames(){
    try {
        const token = localStorage.getItem("token")
        const {data,status} = await axios.get(`${proxy}api/ShiftConfigGetActiveShiftNames`,{headers:{"Authorization":`Bearer ${token}`}})
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function getCurrentShift(){
    try {
        const token = localStorage.getItem("token")
        const {data,status} = await axios.get(`${proxy}api/ShiftConfigGetCurrentShift`,{headers:{"Authorization":`Bearer ${token}`}})
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}

export async function logout(){
    localStorage.removeItem("token");
    window.location.href = "http://localhost:3000";
}

export async function resetPassword(values){
    try {
        const token = localStorage.getItem("token")
        const {data,status} = await axios.put(`${proxy}api/ResetPassword`,values,{headers:{"Authorization":`Bearer ${token}`}})
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }

}

export async function insertInLoginLog({userName,stationName}){
    try {
        const {data,status} = await axios.post(`${proxy}api/loginLogInsert`,{userName,stationName})
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
} 

export async function getJobReport(jobName){
    try {
        const {data,status} = await axios.post(`${proxy}api/StationyyyyJobReport`,{jobName:jobName})
        return Promise.resolve(data)
    } catch (error) {
        console.log({err:error})
        return Promise.reject(error.response.data)
    }
} 

export async function getCountOfWorkAtStation(stationName){
    try {
        const token = localStorage.getItem("token")
        const {data,status} = await axios.get(`${proxy}api/StationyyyyGetCountOfWorkAtStation`,{params:{stationName},headers:{"Authorization":`Bearer ${token}`}})
        return Promise.resolve(data)
    } catch (error) {
        console.log({err:error})
        return Promise.reject(error.response.data)
    }
}

export async function getLoginLogInfo(values){
    try {
        const token = localStorage.getItem("token")
        const {data,status} = await axios.get(`${proxy}api/loginLogGet`,{params:{values},headers:{"Authorization":`Bearer ${token}`}})
        return Promise.resolve(data)
    } catch (error) {
        console.log({err:error})
        return Promise.reject(error.response.data)
    }
}

export async function getOneWorkerStation(employeeId,shift){
    // const token = localStorage.getItem("token")
    // console.log(token);
    try {
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-based
            const day = String(currentDate.getDate()).padStart(2, "0");
            const formattedDate = `${year}-${month}-${day}`;
            const {data,status} = await axios.get(`${proxy}api/getOneWorkerStation`,{params:{employeeId:employeeId,date:formattedDate,shift:shift}})
            return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }
}
export async function deleteMachine(machineId){
    try {
        const token = localStorage.getItem("token")
        const {data,status} = await axios.delete(`${proxy}api/MachineMasterDelete`,{params:{machineId},headers:{"Authorization":`Bearer ${token}`}})
        return Promise.resolve(data)
    } catch (error) {
        console.log({err:error})
        return Promise.reject(error.response.data)
    }
}