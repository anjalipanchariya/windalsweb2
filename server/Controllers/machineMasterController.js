import db from "../Database/connection.js";

async function getMachineDataForStation(req, res) {
    const { stationId } = req.body
    try {
        const searchQuery = "SELECT * FROM machine_master WHERE station_id = ?"
        const [searchResult] = await db.promise().query(searchQuery, [stationId])
        res.status(201).send(searchResult)
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send({ msg: `Internal server error: ${error}` })
    }
}

async function deleteMachineFromMachineMaster(req,res){
    const {machineId} = req.query
    console.log(machineId);
    try{
        const deleteQuery = "DELETE FROM machine_master WHERE machine_id = ?"
        const [deleteResult] = await db.promise().query(deleteQuery,[machineId])
        res.status(201).send({msg:"Machine deleted successfully"})
    }catch(error)
    {
        console.error("Database error:", error);
        res.status(500).send({ msg: `Internal server error: ${error}` })
    }
}

async function getInfoFromStationMasterWithMachine(req, res) {
    try {
        var query = "select station_master.station_name, station_master.product_name, station_master.report, station_master.station_parameters, machine_master.machine_name, cycle_time, daily_count, product_per_hour, next_station_name from machine_master inner join station_master on station_master.station_id=machine_master.station_id"
        const [result] = await db.promise().query(query)
        if (result.length === 0) {
            res.status(409).send({ msg: "No infomation about stations exist in database." })
        }
        else {
            res.status(201).send(result)
        }
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}`})
    }
}

export {getMachineDataForStation,deleteMachineFromMachineMaster, getInfoFromStationMasterWithMachine}