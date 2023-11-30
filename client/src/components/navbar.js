import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import {Link, useNavigate, useParams} from 'react-router-dom';
import { logout,getOneEmployee } from '../helper/helper';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import logo from '../images/logo.png'
import logoutimg from '../images/logout.png'
import './navbar.css';

function WindalsNav() {

  const {userName} = useParams()
  const [workerAccess,setWorkerAccess] = useState("")
  const navigate = useNavigate()

  const accessOptions = [ "0-AddUser", "1-ViewUser", "2-DeleteUser", "3-UpdateUser", "4-AddProduct", "5-VeiwProduct", "6-DeleteProduct", "7-UpdateProduct",
  "8-AddStation", "9-ViewStation", "10-DeleteStation", "11-UpdateStation", "12-AllocateNextStation", "13-UpdateNextStationAllocated", 
  "14-DeleteNextStationAllocated", "15-ViewNextStationAllocated", "16-AllocateStationToWorker", "17-ViewStationAllocatedToWorker","18-ShiftConfig"] 
 
  useEffect(()=>{
    const getWorkerDataPromise = getOneEmployee(userName)
    getWorkerDataPromise.then((result)=>{
      const access = result[0].access_given.split('').map((char) => parseInt(char));
      //console.log(access)
      setWorkerAccess(access)
    }).catch((err)=>{
      toast.error(err.msg)
    })
  },[])

  const redirectToHome = () => {
    if(userName==="admin"){
      navigate(`/${userName}/AdminPanel`,{ replace: true })
    }
  }

  // console.log({workerAccess:workerAccess,userName:userName});
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary fixed-top">
          <div class="col" style={{ marginLeft: 5 }} >
          <button type='button' style={{backgroundColor:'white'}} onClick={redirectToHome}><img src={logo} alt='' style={{ height: 40, width: 50 }} /></button>
          </div>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
          <div class="col">
          <Nav className="me-auto">
              <NavDropdown title="User Configuration" id="basic-nav-dropdown" style={{marginRight:12}}>
              {workerAccess[1] === 1 && <NavDropdown.Item as={Link} to={`/${userName}/ViewUser`}>View</NavDropdown.Item>}
                {workerAccess[0] === 1 && <NavDropdown.Item as={Link} to={`/${userName}/AddUser`}>Add</NavDropdown.Item>}
                {(workerAccess[2] === 1 || workerAccess[3] === 1) && <NavDropdown.Item as={Link} to={`/${userName}/UpdateAndDeleteUser`}>Update</NavDropdown.Item>}
                {(workerAccess[2] === 1 || workerAccess[3] === 1) && <NavDropdown.Item as={Link} to={`/${userName}/UpdateAndDeleteUser`}>Delete</NavDropdown.Item>}
              </NavDropdown>

              <NavDropdown title="Product Configuration" id="basic-nav-dropdown" style={{marginRight:12}}>
                {workerAccess[4] === 1 && <NavDropdown.Item as={Link} to={`/${userName}/ViewProduct`}>View</NavDropdown.Item>}
                {workerAccess[4] === 1 && <NavDropdown.Item as={Link} to={`/${userName}/AddProduct`}>Add</NavDropdown.Item>}
                {workerAccess[4] === 1 && <NavDropdown.Item as={Link} to={`/${userName}/UpdateProduct`}>Update</NavDropdown.Item>}
                  {(workerAccess[6] === 1 || workerAccess[7] === 1) && <NavDropdown.Item as={Link} to={`/${userName}/UpdateProduct`}>Delete</NavDropdown.Item>}
              </NavDropdown>

              <NavDropdown title="Station Configuration" id="basic-nav-dropdown" style={{marginRight:12}}>
              {workerAccess[9] === 1 && <NavDropdown.Item as={Link} to={`/${userName}/ViewStation`}>View</NavDropdown.Item>}
                
                {(workerAccess[8] === 1 || workerAccess[10] === 1 || workerAccess[11] === 1) && <NavDropdown.Item as={Link} to={`/${userName}/Add`}>Add</NavDropdown.Item>}
                {(workerAccess[8] === 1 || workerAccess[10] === 1 || workerAccess[11] === 1) && <NavDropdown.Item as={Link} to={`/${userName}/UpdateAndDeleteStation`}>Update</NavDropdown.Item>}
                {(workerAccess[8] === 1 || workerAccess[10] === 1 || workerAccess[11] === 1) && <NavDropdown.Item as={Link} to={`/${userName}/UpdateAndDeleteStation`}>Delete</NavDropdown.Item>}
                {/* <NavDropdown.Item as={Link} to={`/${userName}/updateStation`}>Update Station</NavDropdown.Item> */}
                
                {workerAccess[16] === 1 && <NavDropdown.Item as={Link} to={`/${userName}/AllocateStationToWorker`}>Allocate Station To Worker</NavDropdown.Item>}
                {workerAccess[12] === 1 && <NavDropdown.Item as={Link} to={`/${userName}/AllocateNextStation`}>Allocate Next Station</NavDropdown.Item>}
              </NavDropdown>

              <NavDropdown title="Shift Configuration" id="basic-nav-dropdown" style={{marginRight:12}}>
              {workerAccess[18] === 1 && <Nav.Link href={`/${userName}/ViewShifts`}>View</Nav.Link>} 
              {workerAccess[18] === 1 && <Nav.Link href={`/${userName}/ShiftConfig`}>Add</Nav.Link>} 
              {workerAccess[18] === 1 && <Nav.Link href={`/${userName}/ShiftConfig`}>Update</Nav.Link>} 
              {workerAccess[18] === 1 && <Nav.Link href={`/${userName}/ShiftConfig`}>Delete</Nav.Link>} 
              </NavDropdown>
              <NavDropdown title="Reports" id="basic-nav-dropdown" style={{marginRight:12}}>
              <Nav.Link href={`/${userName}/ProductReport`}>Product</Nav.Link> 
              <Nav.Link href={`/${userName}/JobReport`}>Job</Nav.Link>
              <Nav.Link href={`/${userName}/LoginLog`}>Login</Nav.Link>
              {/* <Nav.Link href={`/${userName}/LoginLog`}>Login Logs</Nav.Link> */}
              </NavDropdown>
              <NavDropdown title="Supervisor Configuration" id="basic-nav-dropdown" style={{marginRight:12}}>
              <Nav.Link href={`/${userName}/SupervisorDash`}>Supervisor Dashboard</Nav.Link> 
              {/* <Nav.Link href={`/${userName}/SupervisorAllocation`}>Supervisor Allocation</Nav.Link> */}
              </NavDropdown>
            </Nav>
          </div>
          <div class="nav navbar-nav navbar-right" style={{marginRight:20}}>
            
            <img src={logoutimg} style={{ width: 30, height: 28, marginTop: 12, marginLeft: 5,  cursor:'pointer'}} alt="" onClick={() => {
                  logout()
                }}/>
          
          </div>
          </Navbar.Collapse>
      </Navbar>
      
      {/* <br /> */}
      
    </>
  );
}

export default WindalsNav;