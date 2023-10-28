import db from "../Database/connection.js";

async function insertInLoginLog(req,res){
    const {userName,stationName} = req.body
    try{
        const employeeIdSelectQuery = "SELECT employee_id FROM employee_master WHERE user_name = ?"
        const employeeIdSelectResult = await db.promise().query(employeeIdSelectQuery,[userName])
        if(employeeIdSelectResult.length==0){
            res.status(501).send({msg:"There was an error in finding the employee"})
            return
        }
        const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        // console.log('Current DateTime (SQL DATETIME format):', currentDateTime);
        // console.log(employeeIdSelectResult[0][0])
        console.log(userName);
        const insertQuery = userName === "admin" ? "INSERT INTO login_log (employee_id,login_date_time) VALUES (?,?)" : "INSERT INTO login_log(employee_id,login_date_time,station_name) VALUES (?,?,?)" 
        const insertResult = userName === "admin" ? await db.promise().query(insertQuery,[employeeIdSelectResult[0][0].employee_id,currentDateTime]) : await db.promise().query(insertQuery,[employeeIdSelectResult[0][0].employee_id,currentDateTime,stationName]) 
        res.end()
    }catch(err){
        console.error(`Database error: ${err}`);
        res.status(500).send({ msg: `Internal server error: ${err}` });
    }
}

async function getFromLoginLog(req,res){
    const {userName} = req.query.values
    try {
        const selectEmployeeIdQuery = "SELECT employee_id FROM employee_master WHERE user_name = ?"
        const [selectEmployeeIdResult] = await db.promise().query(selectEmployeeIdQuery,[userName])

        if(selectEmployeeIdResult.length<=0){
            return res.status(501).send({msg:"Username does not exist."})
        }

        const selectLoginInfoQuery = "SELECT station_name,login_date_time,logout_date_time FROM login_log WHERE employee_id = ?"
        const [selectLoginInfoResult] = await db.promise().query(selectLoginInfoQuery,[selectEmployeeIdResult[0]["employee_id"]])
    
        res.status(201).send(selectLoginInfoResult)
    } catch (err) {
        console.error(`Database error: ${err}`);
        res.status(500).send({ msg: `Internal server error: ${err}` });
    }
}

export {insertInLoginLog,getFromLoginLog}