import db from "../Database/connection.js";

async function insertIntoStationMaster(req, res) {
    var { stationName,
        productName,
        reportType, //0-for ok/notok, 1-for parameters
        stationParameter,
        machines, multipleMachines } = req.body
    if (stationParameter.length === 0) {
        stationParameter = null;
    }
    else {
        stationParameter = stationParameter.map((parameter) => parameter).join(",")
    }
    try {
        const selectQuery = "SELECT station_id FROM station_master WHERE station_name = ? && product_name = ?"
        const [selectResult] = await db.promise().query(selectQuery, [stationName, productName])
        console.log(selectResult);
        if (selectResult.length > 0) {
            const station_id = selectResult[0]["station_id"];
            const insertQuery = "insert into machine_master (station_id,machine_name,cycle_time,daily_count,product_per_hour) values (?,?,?,?,?)";

            for (const machine of machines) {
                const { machineName, cycleTime, dailyCount, productPerHour } = machine;
                const [insertResult] = await db.promise().query(insertQuery, [station_id, machineName, cycleTime, dailyCount, productPerHour]);
            }
            res.status(201).send({ msg: "Record inserted successfully" });

        }
        else {
            const insertQuery = "INSERT INTO station_master (station_name, product_name, report, station_parameters,multiple_machine) VALUES (?,?,?,?,?)"
            const [insertResult] = await db.promise().query(insertQuery, [stationName, productName, reportType, stationParameter, multipleMachines])
            const selectQuery = "SELECT station_id FROM station_master WHERE station_name = ? && product_name = ?"
            const [selectResult] = await db.promise().query(selectQuery, [stationName, productName])
            const station_id = selectResult[0].station_id;
            console.log(selectResult[0].station_id);
            const insertQuery2 = "insert into machine_master (station_id,machine_name,cycle_time,daily_count,product_per_hour) values (?,?,?,?,?)";

            for (const machine of machines) {
                const { machineName, cycleTime, dailyCount, productPerHour } = machine;
                const [insertResult2] = await db.promise().query(insertQuery2, [station_id, machineName, cycleTime, dailyCount, productPerHour]);
            }
            res.status(201).send({ msg: "Record inserted successfully" });
            
        }
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}` });
    }
}

async function deleteFromStationMaster(req, res) {
    const { stationId,machineId } = req.query.values
    try {
        const deleteStationQuery = "DELETE FROM station_master WHERE station_id = ?"
        const [deleteStationResult] = await db.promise().query(deleteStationQuery,[stationId])
        const deleteMachineQuery = "DELETE FROM machine_master WHERE machine_id = ?"
        for(const machine_id of machineId)
        {
            const [deleteMachineResult] = await db.promise().query(deleteMachineQuery,[machine_id])
        }
        res.status(201).send({ msg: `Station deleted from database successfully` })

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
        machines,
        multipleMachines
        } = req.body
        console.log(stationId);
    if (stationParameter.length === 0) {
        stationParameter = null;
    }
    else {
        stationParameter = stationParameter.map((parameter) => parameter).join(", ")
    }
    try {
        if (stationId === undefined) {
            res.status(409).send({ msg: "The station configuration of this product does not exist." })
        }
        else {
            const updateStationMasterQuery = "UPDATE station_master SET station_name = ?, product_name = ?, report = ?, station_parameters = ?, multiple_machine = ? WHERE station_id = ?"
            const [updateStationMasterResult] = await db.promise().query(updateStationMasterQuery, [stationName, productName, reportType, stationParameter, multipleMachines, stationId])
            const updateMachineMasterQuery = "UPDATE machine_master SET machine_name = ?, cycle_time = ?, product_per_hour = ?, daily_count = ? WHERE machine_id = ? "
            const insertIntoMachineMasterQuery = "INSERT INTO machine_master (station_id,machine_name,cycle_time,daily_count,product_per_hour) VALUES (?,?,?,?,?)";
            for(const machine of machines)
            {
               const {machineId,machineName,dailyCount,cycleTime,productPerHour} = machine
               if(machineId!==undefined)
               {
                    const [updateMachineMasterResult] = await db.promise().query(updateMachineMasterQuery, [machineName,dailyCount,cycleTime,productPerHour,machineId])
               }
               else
               {
                    const [insertIntoMachineMasterResult] = await db.promise().query(insertIntoMachineMasterQuery, [stationId, machineName, cycleTime, dailyCount, productPerHour]);
               } 
            }
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
            const station_id = searchResult[0]["station_id"]
            const searchQuery2 = "SELECT machine_id,machine_name,cycle_time,daily_count,product_per_hour FROM machine_master WHERE station_id = ?"
            const searchResult2 = await db.promise().query(searchQuery2,[station_id])
            const machines = searchResult2[0]
            const finalResult = {...searchResult[0],machines}
            res.status(201).send(finalResult)
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
    const { productName, nextStationAllocation, firstStation, lastStation } = req.body;
    // console.log({ productName, nextStationAllocation, firstStation, lastStation });
    try {
      const updateQuery = "UPDATE station_master SET next_station_name = ?, position = ? WHERE product_name=? AND station_name=?";
      for (const station of nextStationAllocation) {
        const { currentStation, nextStation } = station;
        const position = currentStation === firstStation ? 1 : (currentStation === lastStation ? -1 : 0);
        const [updateResult] = await db.promise().query(updateQuery, [nextStation, position, productName, currentStation]);
      }
      res.status(201).send({ msg: "Configuration saved successfully" });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).send({ msg: `Internal server error: ${error}` });
    }
}


async function getStationAndMachinesInfo(req,res){
    try {
        const searchQuery = "SELECT sm.station_id,sm.station_name,mm.machine_id,mm.machine_name FROM station_master sm JOIN machine_master mm ON sm.station_id = mm.station_id;"
        const [searchResult] = await db.promise().query(searchQuery)
        res.status(201).send(searchResult)
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send({ msg: `Internal server error: ${error}` })
    }
}

export { insertIntoStationMaster, deleteFromStationMaster, getInfoFromStationMaster, getOneStationFromStationMaster, getOneStationOneProductFromStationMaster, updateStationMaster, getStationNamesFromStationMaster, getStationNamesForOneProduct, addNextStationInStationMaster, mobileGetOneStationOneProductFromStationMaster,getStationAndMachinesInfo }