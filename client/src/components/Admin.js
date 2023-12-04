import React, { useEffect, useState } from "react";
import WindalsNav from './navbar';
import Footer from './footer';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import toast, { Toaster } from "react-hot-toast";
import { getAllStationNames, logout, verifyLogin } from "../helper/helper";
import StationCard from "./stationcards";
import { getCurrentShift, getWorkAtStationInDay } from "../helper/helper";


function Admin() {

    const [currentActiveShift, setCurrentActiveShift] = useState("")
    const [stationNames, setStationNames] = useState([])
    const [workAtStationInDay, setWorkAtStationInDay] = useState([])



    useEffect(() => {
        const verifyLoginPromise = verifyLogin()
        verifyLoginPromise.then((result) => {
            console.log(result);
            const getCurrentShiftPromise = getCurrentShift()
            getCurrentShiftPromise.then((result) => {
                console.log(result.shift_id);
                setCurrentActiveShift(result.shift_id)
            }).catch((err) => {
                toast.error(err.msg)
            })
            return null
        }).catch((err) => {
            toast.error(err.msg)
            if (err.redirectUrl) {
                logout()
            }
        })
    }, [])

    useEffect(() => {
        const getStationNamesPromise = getAllStationNames()
        getStationNamesPromise.then((result) => {
            setStationNames(result)
        }).catch((err) => {
            toast.error(err.msg)
        })
    }, [currentActiveShift])

    console.log({ currentActiveShift: currentActiveShift, stationNames: stationNames });

    const [showModal, setShowModal] = useState(false);

    const openModal = () => {
        console.log("Model opening")
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };
    return (
        <div>
            <WindalsNav />
            <Toaster position="top-center" reverseOrder={false}></Toaster>
            <div className="dashboard">

                <div className="cards" >
                    {
                        stationNames.length > 0 ?
                            stationNames.map((station, index) => (
                                <div>
                                    <StationCard name={station.station_name} number={index + 1} worker="abc" shift="2"
                                    />
                                </div>

                            ))

                            : "No stations have been configured"
                    }
                </div>

                <Modal show={showModal} onHide={closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>{ } </Modal.Title>
                    </Modal.Header>


                    <Modal.Body>
                        <table style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th>Job Id</th>
                                    <th>Job Name</th>
                                    <th>Product Name</th>
                                    <th>Status</th>
                                    <th>Reason</th>
                                    <th>Parameter values</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>xyz</td>
                                    <td>axel</td>
                                    <td>done</td>
                                    <td>-</td>
                                    <td>-</td>
                                </tr>
                            </tbody>
                        </table>
                    </Modal.Body>



                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                <br />
                <br />
            </div>
            <Footer />
        </div>
    )
}

export default Admin