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

export {getMachineDataForStation,deleteMachineFromMachineMaster}