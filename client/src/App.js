import {React, useState} from 'react';
import './App.css';

import LoginPage from './components/login';
import { Routes, Route, Link} from 'react-router-dom';
import WorkerReg from './components/user/adduser';
import DeleteUser from './components/user/deleteuser';
import UpdateProduct from './components/product/updateproduct';
import UpdateStation from './components/station/updateStation';
import AddProduct from './components/product/addProduct';
import AddStation from './components/station/addStation';
import Admin from './components/Admin';
import ViewUser from './components/user/viewUser';
import ViewProduct from './components/product/viewProduct';
import ViewStation from './components/station/viewStation';
import StationAllocation from './components/station/allocateStation';
import FirstStation from './components/station/firstStation';
import NextStationAllocation from './components/station/nextStationAllocation';
import StationPage from './components/station/stationPage';
import ShiftConfig from './components/shift/shiftConfiguration';
import ViewShifts from './components/shift/viewShift';
// import LoginLog from './components/reports/loginLog';
import JobReport from './components/reports/jobReport';
import ProductReport from './components/reports/productReport';
import LoginLog from './components/reports/loginLog';
import LandingPage from './components/landingPage.js';
import Supervisor from './components/supervisor/supervisor';
import SupervisorAllocation from './components/supervisor/supervisorAllocation';

function App() {
  console.log(window.location.href);
  
  return (
    <>

      <Routes>
        <Route path='/:userName/LandingPage' element={<LandingPage/>}></Route>
        
        <Route path='/:userName/AdminPanel' element={<Admin/>}></Route>
        
        <Route path='/:userName/AddUser' element={<WorkerReg />} />
        <Route path='/:userName/UpdateAndDeleteUser' element={<DeleteUser />} />
        <Route path='/:userName/ViewUser' element={<ViewUser />} />

        <Route path='/:userName/AddProduct' element={<AddProduct />}></Route>
        <Route path='/:userName/UpdateProduct' element={<UpdateProduct />}></Route>
        <Route path='/:userName/ViewProduct' element={<ViewProduct />}></Route>

        <Route path='/:userName/Add' element={<AddStation />}></Route>
        <Route path='/:userName/UpdateAndDeleteStation' element={<AddStation />}></Route>
        {/* <Route path='/:userName/updateStation' element={<UpdateStation />}></Route> */}
        <Route path='/:userName/ViewStation' element={<ViewStation />}></Route>
        <Route path='/:userName/AllocateStationToWorker' element={<StationAllocation />}></Route>
        <Route path='/:userName/AllocateNextStation' element={<NextStationAllocation />}></Route>
        
        <Route path='/Station/:employeeId/:userName/:stationName' element={<StationPage />}></Route>
        <Route path='/FirstStation/:employeeId/:userName/:stationName' element={<FirstStation />}></Route>
        
        <Route path='/:userName/ShiftConfig' element={<ShiftConfig />}></Route>
        <Route path='/:userName/ViewShifts' element={<ViewShifts />}></Route>

        {/* <Route path='/:userName/LoginLog' element={<LoginLog />}></Route> */}
        <Route path='/:userName/JobReport' element={<JobReport />} />
        <Route path='/:userName/ProductReport' element={<ProductReport />} />
        <Route path='/:userName/LoginLog' element={<LoginLog />} />
        <Route path='/' element={<LoginPage />} />

        <Route path='/:userName/SupervisorDash' element={<Supervisor/>}/>
        <Route path='/:userName/SupervisorAllocation' element={<SupervisorAllocation/>}/>
      </Routes>
    </>
  );
}

export default App;