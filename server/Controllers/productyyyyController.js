import db from "../Database/connection.js";

async function insertInProductyyyy(req,res){
    const {product_name, station_id, job_name, machine_id } = req.body;

    
    try {
        const searchQuery = "SELECT job_name FROM productyyyy WHERE job_name=?"
        const [selectResult] = await db.promise().query(searchQuery,[job_name,product_name])
        if(selectResult.length>0)
        {
            
            res.status(409).send({ msg: `These job name already exist.` });

        }       
        else
        {
            const insertQuery = "INSERT INTO productyyyy (product_name, station_id, job_name,machine_id) VALUES (?, ?, ?,?)";
            const [insertResult] = await db.promise().query(insertQuery, [product_name, station_id, job_name,machine_id]);
            
            res.status(201).send({ msg: "Record inserted successfully"});
        }
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}` });
    }

}

export {insertInProductyyyy};