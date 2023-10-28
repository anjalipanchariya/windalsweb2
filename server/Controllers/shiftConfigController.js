import db from "../Database/connection.js";

async function insertIntoShiftConfig(req,res){
    var {
        shiftName,
        startTime,
        endTime,
        active
    }=req.body

    try{
        const selectQuery="SELECT shift_id FROM shift_config WHERE shift_name=?"
        const [selectResult]=await db.promise().query(selectQuery,[shiftName])
        if(selectResult.length > 0 ){
            res.status(409).send({msg:"Shift name already exist.Choose another name."})
        }
        else{
            const insertQuery = "INSERT INTO shift_config (shift_name,start_time,end_time,active) VALUES (?,?,?,?)"
            const [insertResult] = await db.promise().query(insertQuery,[shiftName,startTime,endTime,active])
            res.status(201).send({ msg: "Record inserted successfully" });
        }
    }
    catch(err){
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}` });

    }
}

async function deleteFromShiftConfig(req,res){
    const {shiftId}=req.query
    try{
        const selectQuery = "SELECT shift_id FROM shift_config WHERE shift_id = ?"
        const [selectResult] = await db.promise().query(selectQuery,[shiftId])
        if(selectResult.length === 0 ){
            res.status(409).send({msg:"The shift does not exist."})
        }
        else{
            const deleteQuery = "DELETE FROM shift_config WHERE shift_id = ?"
            const [deleteResult] = await db.promise().query(deleteQuery,[shiftId])
            res.status(201).send({msg:`Shift: ${selectResult[0].shift_name} deleted from database successfully`})
            }
        }
    catch(err){
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}` });
    }
}

async function updateShiftConfig(req,res){
    var {shiftName,
        startTime,
        endTime,
        active,shiftId} = req.body
        // console.log(req.body);
        try {
            const selectQuery = "SELECT shift_id FROM shift_config WHERE shift_id=?"
            const [selectResult] = await db.promise().query(selectQuery,[shiftId])
            if(selectResult.length === 0 ){
                res.status(409).send({msg:"The shift does not exist."})
            }
            else{
                const updateQuery = "UPDATE shift_config SET shift_name=?,start_time=?,end_time=?,active=? WHERE shift_id = ?"
                const [updateResult] = await db.promise().query(updateQuery,[shiftName,startTime,endTime,active,shiftId])
                res.status(201).send({msg:`Data updated successfully`})
            } 
        } catch (err) {
            console.error("Database error:", err);
            res.status(500).send({ msg: `Internal server error: ${err}` });
        }

}

async function getAllFromShiftConfig(req,res){
    try{
        var query = "SELECT * FROM shift_config"
        const [result] = await db.promise().query(query)
        if(result.length===0){
            res.status(409).send({msg:"No infomation about shifts exist in database."})
        }
        else{
            res.status(201).send(result)
        }
    }catch(err){
        console.error("Database error:", err);
        res.status(500).send({msg:`Internal server error: ${err}`})
    }
}

async function getActiveShiftNames(req,res) {
    try {
        const selectQuery = "SELECT shift_name,shift_id FROM shift_config WHERE active = ?"
        const [selectResult] = await db.promise().query(selectQuery,1)
        if(selectResult.length == 0)
        {
            return res.status(409).send({msg:"There are no active shifts."})
        }
        res.status(201).send(selectResult)
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({msg:`Internal server error: ${err}`})
    }   
}

async function getCurrentShift(req,res) {
    try {
        const selectQuery = "SELECT shift_id FROM shift_config WHERE active = 1 AND CURTIME() BETWEEN start_time AND end_time"
        const [selectResult] = await db.promise().query(selectQuery)
        if(selectResult.length == 0)
        {
            return res.status(409).send({msg:"There are no active shifts."})
        }
        res.status(201).send(selectResult[0])
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({msg:`Internal server error: ${err}`})
    }
}

export {getAllFromShiftConfig,insertIntoShiftConfig,deleteFromShiftConfig,updateShiftConfig,getActiveShiftNames,getCurrentShift}
