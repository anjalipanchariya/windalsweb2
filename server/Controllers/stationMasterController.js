import db from "../Database/connection.js";

async function insertIntoStationMaster(req, res) {
    var { stationName,
        productName,
        reportType, //0-for ok/notok, 1-for parameters
        stationParameter,
        machines, multipleMachine } = req.body
    if (stationParameter.length === 0) {
        stationParameter = null;
    }
    else {
        stationParameter = stationParameter.map((parameter) => parameter).join(", ")
    }
    try {
        const selectQuery = "SELECT station_id FROM station_master WHERE station_name = ? && product_name = ?"
        const [selectResult] = await db.promise().query(selectQuery, [stationName, productName])
        if (selectResult.length > 0) {
            const station_id = selectResult["station_id"];
            const insertQuery = "insert into machine_master (station_id,machine_name,cycle_time,daily_count,product_per_hour) values (?,?,?,?,?)";

            for (const machine of machines) {
                const { machine_name, cycle_time, daily_count, product_per_hour } = machine;
                const [insertResult] = await db.promise().query(insertQuery, [station_id, machine_name, cycle_time, daily_count, product_per_hour]);
            }
            res.status(201).send({ msg: "Record inserted successfully" });

        }
        else {
            const insertQuery = "INSERT INTO station_master (station_name, product_name, report, station_parameters,multiple_machine) VALUES (?,?,?,?,?)"
            const [insertResult] = await db.promise().query(insertQuery, [stationName, productName, reportType, stationParameter, multipleMachine])
            const selectQuery = "SELECT station_id FROM station_master WHERE station_name = ? && product_name = ?"
            const [selectResult] = await db.promise().query(selectQuery, [stationName, productName])
            const station_id = selectResult["station_id"];
            const insertQuery2 = "insert into machine_master (station_id,machine_name,cycle_time,daily_count,product_per_hour) values (?,?,?,?,?)";

            for (const machine of machines) {
                const { machine_name, cycle_time, daily_count, product_per_hour } = machine;
                const [insertResult2] = await db.promise().query(insertQuery2, [station_id, machine_name, cycle_time, daily_count, product_per_hour]);
            }
            res.status(201).send({ msg: "Record inserted successfully" });
            
        }
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}` });
    }
}

async function deleteFromStationMaster(req, res) {
    const { stationId,machineId } = req.query
    try {
        const selectQuery = "SELECT station_id FROM station_master WHERE station_id = ?"
        const [selectResult] = await db.promise().query(selectQuery, [stationId])
        if (selectResult.length === 0) {
            res.status(409).send({ msg: "The station configuration of this product does not exist." })
        }
        else {
            const selectQuery2 = "SELECT * FROM machine_master WHERE station_id = ?"
            const [selectResult] = await db.promise().query(selectQuery2, [stationId])
            if(selectResult.length ==1){
                const deleteQuery = "DELETE FROM station_master WHERE station_id = ?"
                const [deleteResult] = await db.promise().query(deleteQuery, [stationId])
                const deleteQuery2 = "DELETE FROM machine_master WHERE station_id = ? and machine_id=?"
                const [deleteResult2] = await db.promise().query(deleteQuery2, [stationId,machineId])
            }
            else{
                const deleteQuery2 = "DELETE FROM machine_master WHERE station_id = ? and machine_id=?"
                const [deleteResult2] = await db.promise().query(deleteQuery2, [stationId,machineId])
            }
            
            res.status(201).send({ msg: `Station: ${selectResult[0].station_name} configuration of product: ${selectResult[0].product_name} deleted from database successfully` })
        }
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}` });
    }
}

async function updateStationMaster(req, res) {
    var { stationId,
        stationName,
        productName,
        reportType,
        stationParameter,
        machineId,
        machineName,
        multipleMachine,
        cycleTime,
        dailyCount,
        productPerHour } = req.body
    if (stationParameter.length === 0) {
        stationParameter = null;
    }
    else {
        stationParameter = stationParameter.map((parameter) => parameter).join(", ")
    }
    try {
        const selectQuery = "SELECT station_id FROM station_master WHERE station_name = ? && product_name = ?"
        const [selectResult] = await db.promise().query(selectQuery, [stationName, productName])
        if (selectResult.length === 0) {
            res.status(409).send({ msg: "The station configuration of this product does not exist." })
        }
        else {
            const updateQuery = "UPDATE station_master SET station_name = ?, product_name = ?, report = ?, station_parameters = ?, cycle_time = ?, daily_count = ?, product_per_hour = ? WHERE station_id = ?"
            const [updateResult] = await db.promise().query(updateQuery, [stationName, productName, reportType, stationParameter, cycleTime, dailyCount, productPerHour, stationId])
            res.status(201).send({ msg: `Data updated successfully` })
        }
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}` });
    }
}

async function getInfoFromStationMaster(req, res) {
    try {
        var query = "SELECT * FROM station_master"
        const [result] = await db.promise().query(query)
        if (result.length === 0) {
            res.status(409).send({ msg: "No infomation about stations exist in database." })
        }
        else {
            res.status(201).send(result)
        }
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}` })
    }
}

async function getOneStationFromStationMaster(req, res) {
    const { stationName } = req.query
    try {
        const searchQuery = "SELECT * FROM station_master WHERE station_name = ?"
        const [searchResult] = await db.promise().query(searchQuery, [stationName])
        if (searchResult.length === 0) {
            res.status(409).send({ msg: "No such station exist in database." })
        }
        else {
            res.status(201).send(searchResult)
        }
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}` })
    }
}

async function getOneStationOneProductFromStationMaster(req, res) {
    const { stationName, productName } = req.query.values
    try {
        const searchQuery = "SELECT * FROM station_master WHERE station_name = ? AND product_name = ?"
        const [searchResult] = await db.promise().query(searchQuery, [stationName, productName])
        if (searchResult.length === 0) {
            res.status(409).send({ msg: "Station configuration of this product does not exist in database." })
        }
        else {
            res.status(201).send(searchResult)
        }
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}` })
    }
}
async function mobileGetOneStationOneProductFromStationMaster(req, res) {
    const { stationName, productName } = req.query
    try {
        const searchQuery = "SELECT * FROM station_master WHERE station_name = ? AND product_name = ?"
        const [searchResult] = await db.promise().query(searchQuery, [stationName, productName])
        if (searchResult.length === 0) {
            res.status(409).send({ msg: "Station configuration of this product does not exist in database." })
        }
        else {
            res.status(201).send(searchResult)
        }
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}` })
    }
}

async function getStationNamesFromStationMaster(req, res) {
    try {
        const selectQuery = "SELECT DISTINCT station_name FROM station_master"
        const [selectResult] = await db.promise().query(selectQuery)
        res.status(201).send(selectResult)
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send({ msg: `Internal server error: ${error}` })
    }
}

async function getStationNamesForOneProduct(req, res) {
    const { productName } = req.query
    try {
        const searchQuery = "SELECT station_name FROM station_master WHERE product_name = ?"
        const [searchResult] = await db.promise().query(searchQuery, [productName])
        res.status(201).send(searchResult)
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send({ msg: `Internal server error: ${error}` })
    }
}

async function addNextStationInStationMaster(req, res) {
    const { productName, nextStationAllocation } = req.body
    try {
        const updateQuery = "UPDATE station_master SET next_station_name = ? WHERE product_name=? AND station_name=?"
        for (const station of nextStationAllocation) {
            const { currentStation, nextStation } = station
            const [updateResult] = await db.promise().query(updateQuery, [nextStation, productName, currentStation])
        }
        res.status(201).send({ msg: "Configuration saved successfully" })
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send({ msg: `Internal server error: ${error}` })
    }
}

export { insertIntoStationMaster, deleteFromStationMaster, getInfoFromStationMaster, getOneStationFromStationMaster, getOneStationOneProductFromStationMaster, updateStationMaster, getStationNamesFromStationMaster, getStationNamesForOneProduct, addNextStationInStationMaster, mobileGetOneStationOneProductFromStationMaster }