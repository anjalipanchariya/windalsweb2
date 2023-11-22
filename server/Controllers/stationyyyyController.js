import db from "../Database/connection.js";

async function insertInStationyyyyFirst(req,res){
    const {product_name, station_id, job_name,  employee_id,machine_id} = req.body;
    
    try {
        const searchQuery = "SELECT job_id FROM productyyyy WHERE job_name=? AND product_name=?"
        const [selectResult] = await db.promise().query(searchQuery,[job_name,product_name])
        const job_id=selectResult[0]["job_id"];
        

        const insertQuery = "INSERT INTO station_yyyy (product_name, station_id, job_id, employee_id,status,intime,out_time,machine_id) VALUES (?, ?, ?,?,1,NOW(),NOW(),?)";
        const [insertResult] = await db.promise().query(insertQuery, [product_name, station_id, job_id,employee_id,machine_id]);
            
        res.status(201).send({ msg: "Record inserted successfully"});
        
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}` });
    }

}

async function insertInStationyyyyFirstNextStation(req,res){
    const {product_name, station_id, job_name} = req.body;
    console.log("firstnextstation");
    try {
        const searchQueryJob = "SELECT job_id FROM productyyyy WHERE job_name=? AND product_name=? "
        const [selectResultJob] = await db.promise().query(searchQueryJob,[job_name,product_name])
        const job_id=selectResultJob[0]["job_id"];
        console.log(job_id)

        const selectNextStationNameQuery = "SELECT next_station_name FROM station_master WHERE station_id=? AND product_name=?"
        const [selectNextStationNameResult] = await db.promise().query(selectNextStationNameQuery,[station_id,product_name])

        console.log(selectNextStationNameResult);
        
        if(selectNextStationNameResult[0].next_station_name===null)
        {
            return res.status(201).send({msg: "This is final station."})
        }

        const searchQueryNextStation = "SELECT station_id FROM station_master WHERE station_name=(select next_station_name from station_master where station_id=? and product_name=?) AND product_name=? "
        const [selectResultNextStation] = await db.promise().query(searchQueryNextStation,[station_id,product_name,product_name])
        const next_station_id=selectResultNextStation[0]["station_id"];
        console.log(next_station_id)

        const insertQuery = "INSERT INTO station_yyyy (product_name, station_id, job_id,intime) VALUES (?, ?, ?,NOW())";
        const [insertResult] = await db.promise().query(insertQuery, [product_name, next_station_id, job_id]);
            
        res.status(201).send({ msg: "Record inserted successfully"});
        
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}` });
    }

}

async function updateInStationyyyy(req,res){
    const {product_name, station_id, job_name,employee_id,status,parameters, machine_id} = req.body;
    // console.log(req.body);
    try {
        const searchQueryJob = "SELECT job_id FROM productyyyy WHERE job_name=? and product_name=?"
        const [selectResultJob] = await db.promise().query(searchQueryJob,[job_name,product_name])
        const job_id=selectResultJob[0]["job_id"];
        // console.log(job_id)


        // const searchQueryNextStation = "SELECT station_id FROM station_master WHERE station_name=(select next_station_name from station_master where station_id=?) "
        // const [selectResultNextStation] = await db.promise().query(searchQueryNextStation,[station_id])
        // const next_station_id=selectResultNextStation[0]["station_id"];
        // console.log(next_station_id)

        const searchQintime="select intime from station_yyyy where station_id=? and product_name=? and job_id=?;"
        const [selectRintime] = await db.promise().query(searchQintime,[station_id,product_name,job_id])
        const intime=selectRintime[0]["intime"];
        // console.log(intime)


        const updateQuery = "UPDATE station_yyyy SET employee_id = ?, status = ?, parameters = ? ,out_time=NOW(), machine_id=? WHERE (intime = ?) and (station_id = ?) and (product_name = ?) and (job_id = ?);";
        const [updateResult] = await db.promise().query(updateQuery, [employee_id,status,parameters,machine_id,intime,station_id,product_name, job_id]);
            
        res.status(201).send({ msg: "Record updated successfully"});
        
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}` });
    }
}

async function jobsAtStation(req,res){
    const {station_id} = req.body;
    // console.log(station_id);
    try {
        const searchQueryJob = "SELECT job_id, job_name, product_name FROM productyyyy as py  where py.job_id in (select job_id from station_yyyy where `status` is null and `station_id`=?);"
        const [selectResultJob] = await db.promise().query(searchQueryJob,[station_id])
        // console.log(selectResultJob);
            
        res.status(201).send(selectResultJob);
        
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}` });
    }

}

async function jobsAtReworkStation(req,res){
    // const {station_id} = req.body;
    // console.log(station_id);
    try {
        const searchQueryJob = "select newt2.job_id,newt2.product_name,newt2.station_id,newt2.employee_id,newt2.machine_id,newt2.parameters,newt2.job_name,employee_master.first_name,employee_master.last_name from (select newt.job_id,newt.product_name,newt.station_id,newt.employee_id,newt.machine_id,newt.parameters,productyyyy.job_name from (select * from station_yyyy where status='-1') as newt inner join productyyyy on newt.job_id=productyyyy.job_id) as newt2 inner join employee_master on newt2.employee_id=employee_master.employee_id ;"
        const [selectResultJob] = await db.promise().query(searchQueryJob)
        // console.log(selectResultJob);
            
        res.status(201).send(selectResultJob);
        
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}` });
    }

}

async function insertInStationyyyySameStation(req,res){
    const {product_name, station_id, job_name} = req.body;
    
    try {
        const searchQueryJob = "SELECT job_id FROM productyyyy WHERE job_name=? AND product_name=? "
        const [selectResultJob] = await db.promise().query(searchQueryJob,[job_name,product_name])
        const job_id=selectResultJob[0]["job_id"];
        console.log(job_id)

        const insertQuery = "INSERT INTO station_yyyy (product_name, station_id, job_id,intime) VALUES (?, ?, ?,NOW())";
        const [insertResult] = await db.promise().query(insertQuery, [product_name, station_id, job_id]);
            
        res.status(201).send({ msg: "Record inserted successfully"});
        
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}` });
    }

}

async function countOfWorkAtStation(req,res){
    const { stationName } = req.query;

    try {
    const searchStationIdQuery = "SELECT station_id FROM station_master WHERE station_name = ?";
    const [selectstationIdResult] = await db.promise().query(searchStationIdQuery, [stationName]);

    const stationIds = selectstationIdResult.map((station) => station.station_id);
    const placeholders = stationIds.map(() => '?').join(', ');


    const searchQueryDone = `SELECT COUNT(*) AS ok FROM station_yyyy WHERE status = 1 AND station_id IN (${placeholders})`;
    const [selectResultDone] = await db.promise().query(searchQueryDone, stationIds);
    const done = selectResultDone[0]['ok'];

    const searchQueryNotDone = `SELECT COUNT(*) AS notok FROM station_yyyy WHERE status = -1 AND station_id IN (${placeholders})`;
    const [selectResultNotDone] = await db.promise().query(searchQueryNotDone, stationIds);
    const notdone = selectResultNotDone[0]['notok'];

    const searchQueryRework = `SELECT COUNT(*) AS rework FROM station_yyyy WHERE status = 0 AND station_id IN (${placeholders})`;
    const [selectResultRework] = await db.promise().query(searchQueryRework, stationIds);
    const rework = selectResultRework[0]['rework'];

    res.status(201).send({ ok: done, notok: notdone, rework: rework });
    } catch (err) {
    console.error("Database error:", err);
    res.status(500).send({ msg: `Internal server error: ${err}` });
    }
}

async function getJobesSubmitedAtStation(req,res){
    const {stationId} = req.body;

    try {
        // const date='2023-09-05'; //date format YYYY-MM-DD
        const searchQueryWork = "select newt2.product_name,job_name,status,first_name,last_name,intime from (select newt.product_name, employee_id,job_name, status,intime from (select * from station_yyyy where employee_id is not null and status is not null and station_id = ?) as newt left join productyyyy on newt.job_id=productyyyy.job_id) as newt2 left join employee_master on newt2.employee_id=employee_master.employee_id where intime between ? AND ?;"
        const [selectResultWork] = await db.promise().query(searchQueryWork,[stationId])

        res.status(201).send(selectResultWork);

    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}` });
    }

}

async function workAtStationInDay(req, res) {
  const { stationId, date } = req.query;
  console.log(req.query);
  try {
    const start = date + ' 00:00:00';
    const end = date + ' 23:59:59';
    const searchQuery =
      "SELECT newt.product_name, newt.status, newt.parameters, newt.intime, newt.out_time, newt.job_id, job_name FROM (SELECT * FROM station_yyyy WHERE employee_id IS NOT NULL AND status IS NOT NULL AND station_id = ?) as newt LEFT JOIN productyyyy ON newt.job_id=productyyyy.job_id WHERE intime BETWEEN ? AND ?;";
    const [selectResult] = await db.promise().query(searchQuery, [stationId, start, end]);

    // // Iterate through selectResult and split parameters and reason
    // for (const row of selectResult) {
    //   const formattedString = row.parameters || "";
    //   let reason = null;
    //   let parameters = null;

    //   // Split the formattedString into parts using ';'
    //   const parts = formattedString.split(';');

    //   for (const part of parts) {
    //     if (part.startsWith("Not-Ok-Reason:") || part.startsWith("Rework-Reason:")) {
    //       reason = part;
    //     } else if (part.startsWith("Parameters:")) {
    //       parameters = part.substring("Parameters:".length);
    //     }
    //   }

    //   // Store reason and parameters as strings, or set them to null if absent
    //   row.reason = reason ? reason : null;
    //   row.parameters = parameters ? parameters : null;
    // }

    console.log({ selectResult: selectResult });
    res.status(201).send(selectResult);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).send({ msg: `Internal server error: ${err}` });
  }
}

async function productReport(req,res){
    const {product_name} = req.body;

    try {
        const searchQueryid="select station_id from station_master where next_station_name is null and product_name=?"
        const [selectResultid] = await db.promise().query(searchQueryid,[product_name])
        if(selectResultid.length!=1){
            res.status(409).send({ msg: `allocate next station` });
        }
        else{
            
            const lastStationId=selectResultid[0]['station_id']
            const searchQueryWork = "select date(temp.out_time) as 'date' ,time(temp.out_time) as 'time',productyyyy.job_name from (select job_id , out_time from station_yyyy  where status=1 and station_id=? and product_name=?) as temp inner join productyyyy on productyyyy.job_id=temp.job_id;"
            const [selectResultWork] = await db.promise().query(searchQueryWork,[lastStationId,product_name])
            res.status(201).send(selectResultWork);
        }        

    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}` });
    }

}  

async function jobDetailsReport(req,res){
    const {jobName} = req.body;
    try {
        const searchQueryJob = "SELECT job_id FROM productyyyy WHERE job_name=?"
        const [selectResultJob] = await db.promise().query(searchQueryJob,[jobName])
        if(selectResultJob.length==0)
        {
            
            res.status(409).send({ msg: `These job name does not exist.` });

        } 
        else{
            const job_id=selectResultJob[0]["job_id"];


            const searchQueryWork = "select first_name, last_name, station_name, temp2.product_name, status, intime, out_time from (select station_name, temp1.product_name, employee_id, status, intime, out_time from (select station_id,product_name, employee_id,status,intime,out_time from station_yyyy where job_id=?) as temp1 inner join station_master on temp1.station_id=station_master.station_id) as temp2 inner join employee_master on temp2.employee_id=employee_master.employee_id;"
            const [selectResultWork] = await db.promise().query(searchQueryWork,[job_id])

            console.log(selectResultWork);
            res.status(201).send(selectResultWork);
        }
        

    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}` });
    }

} 

export {insertInStationyyyyFirst, insertInStationyyyyFirstNextStation,updateInStationyyyy, jobsAtStation,countOfWorkAtStation,workAtStationInDay,getJobesSubmitedAtStation,productReport,jobDetailsReport,jobsAtReworkStation,insertInStationyyyySameStation};