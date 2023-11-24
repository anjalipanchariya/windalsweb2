import db from "../Database/connection.js";

async function insertIntoStationAllocation(req,res){
    const {date,shift,stationAllocations} = req.body
    // console.log(stationAllocations);
    try {
        const selectQuery = "SELECT employee_id FROM station_allocation WHERE date = ? AND shift_id = ?"
        const [selectResult] = await db.promise().query(selectQuery,[date,shift])
        if(selectResult.length>0){
            res.status(501).send({msg:`Workers already allocated to stations for this shift_id and this date:${date}`})
        }
        else{
            const insertQuery = "INSERT INTO station_allocation (date,shift_id,station_name,machine_id,employee_id) VALUES (?, ?, ?, ?, ?)"
            for(const stationAllocation of stationAllocations)
            {
                const {station_name,machine_id,workers} = stationAllocation
                for(const workerID of workers){
                    const [insertResult] = await db.promise().query(insertQuery,[date,shift,station_name,machine_id,workerID])
                }
            }
            res.status(201).send({msg:"Stations allocated to workers successfully."})
        }
    } catch (error) {
        console.error(`Database error: ${error}`);
        res.status(500).send({ msg: `Internal server error: ${error}` });
    }
} 

async function getOneWorkerStation(req,res){
    const {employeeId,date,shift} = req.query
    // console.log(req.query);
    try {
        const selectQuery = "select t2.station_name,t2.machine_id, t2.machine_name, station_master.position from (select machine_master.station_id,t1.station_name,t1.machine_id, machine_master.machine_name from (select station_name, machine_id from station_allocation where date=? and employee_id=? and shift_id=?) as t1 inner join machine_master on t1.machine_id=machine_master.machine_id) as t2 inner join station_master on t2.station_id=station_master.station_id;"

        const [selectResult] = await db.promise().query(selectQuery,[date,employeeId,shift])
        console.log({query:req.query,result:selectResult});

        if(selectResult.length<=0)
        {
            res.status(501).send({msg:"No station has been allocated to you."})
        }
        else
        {
            res.status(201).send(selectResult)
        }
    } catch (error) {
        console.error(`Database error: ${error}`);
        res.status(500).send({ msg: `Internal server error: ${error}` });
    }
}

async function getStationAllocated(req,res){
    const {date} = req.query
    // console.log(date);
    try{
        const selectQuery= "SELECT station_allocation.station_name ,station_allocation.date, employee_master.first_name, employee_master.last_name, employee_master.user_name,shift_config.shift_name FROM station_allocation JOIN employee_master ON station_allocation.employee_id = employee_master.employee_id JOIN shift_config ON station_allocation.shift_id = shift_config.shift_id WHERE station_allocation.date = ?"
        const [selectResult] = await db.promise().query(selectQuery,[date])
        // console.log(selectResult);
        if(selectResult.length<=0)
        {
            res.status(501).send({msg:"No station has been allocated to any worker yet."})
        }
        else{
            res.status(201).send(selectResult)
        }
    }
    catch(error){
        console.error(`Database error: ${error}`);
        res.status(500).send({ msg: `Internal server error: ${error}` });
    }
}

    
export {insertIntoStationAllocation,getOneWorkerStation, getStationAllocated}