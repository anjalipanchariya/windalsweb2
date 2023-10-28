import React, { useEffect, useState } from "react";
import WindalsNav from './navbar';
import Footer from './footer';
import toast, {Toaster} from "react-hot-toast";
import { getAllStationNames, logout, verifyLogin } from "../helper/helper";
import StationCard from "./stationcards";
import { getCurrentShift } from "../helper/helper";


function Admin(){
    
    const [currentActiveShift,setCurrentActiveShift] = useState("")
    const [stationNames,setStationNames] = useState([])

    useEffect(()=>{
        const verifyLoginPromise = verifyLogin()
        verifyLoginPromise.then((result)=>{
            console.log(result);
            const getCurrentShiftPromise = getCurrentShift()
            getCurrentShiftPromise.then((result)=>{
                console.log(result.shift_id);
                setCurrentActiveShift(result.shift_id)
            }).catch((err)=>{
                toast.error(err.msg)
            })
            return null  
        }).catch((err)=>{
            toast.error(err.msg)
            if(err.redirectUrl)
            {
                logout()
            }
        }) 
    },[])

    useEffect(()=>{
        const getStationNamesPromise = getAllStationNames()
        getStationNamesPromise.then((result)=>{
            setStationNames(result)
        }).catch((err)=>{
            toast.error(err.msg)
        })
    },[currentActiveShift])

    console.log({currentActiveShift:currentActiveShift,stationNames:stationNames});
    return (
        <div>
            <WindalsNav/>
            <Toaster position="top-center" reverseOrder={false}></Toaster>
            <div className="dashboard">
       
        <div className="cards">
        {
            stationNames.length>0 ?
            stationNames.map((station,index)=>(
                <StationCard name={station.station_name} number={index+1} worker = "abc" shift="2"/>
            ))
            : "No stations have been configured"
        }
       </div> 
       <br />
       <br />
       </div>
            <Footer/>
        </div>
    )
}

export default Admin