import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import './stationcards.css'
import { getCountOfWorkAtStation } from "../helper/helper";
import toast, { Toaster } from 'react-hot-toast';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

function StationCard(props){
  
  const [jobCountInfo,setJobCountInfo] = useState({
    ok:0,
    notok:0,
    rework:0
  })
  
  useEffect(()=>{
    const getCountOfWorkAtStationPromise = getCountOfWorkAtStation(props.name)
    getCountOfWorkAtStationPromise.then((result)=>{
      setJobCountInfo(result)
    }).catch((err)=>{
      toast.error(err.msg)
    })
  },[])  
  
  console.log({stationName:props.name,jobCountInfo:jobCountInfo});
  return(
        <>
       <Toaster position="top-center" reverseOrder={false}></Toaster>
       {/*<Row xs={1} md={6} className="g-4">
      {Array.from({ length: 30 }).map((_, idx) => (
        <Col key={idx}>
      */}
        <Card
          border="danger" 
          bg={'info'}
          key={'info'}
          text={'white'}
          style={{ width: '18rem' }}
          className="mb-2"
        >
          <Card.Header>{props.number} : {props.name}</Card.Header>
      <Card.Body>
        <Card.Title>Attendee : {props.worker}</Card.Title>
        <Card.Text >
          <table>
            <tr>
            <th style={{width:90}}>Accept</th>
            <th style={{width:90}}>Reject</th>
            <th style={{width:90}}>Rework</th>
            </tr>
            <tr>
                <td style={{color:"darkgreen",fontSize:30}}>{jobCountInfo.ok}</td>
                <td>{jobCountInfo.notok}</td>
                <td>{jobCountInfo.rework}</td>
            </tr>
          </table>
        </Card.Text>
      </Card.Body>
    </Card>
    {/*</Col>
      ))}
    </Row>*/}
        </>
    )
}

export default StationCard;