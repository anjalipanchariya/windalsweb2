import db from "../Database/connection.js";

async function insertInProductMaster(req,res){
    const { productName, parameters } = req.body;
    const parameterNames = parameters.map((parameter) => parameter.parameterName)
    try {
        const searchQuery = "SELECT parameter FROM product_master WHERE product_name = ? AND parameter IN (?)"
        const [selectResult] = await db.promise().query(searchQuery,[productName,parameterNames])
        if(selectResult.length>0)
        {
            const conflictingParameters = selectResult.map(result => result.parameter);
            res.status(409).send({ msg: `Failed for parameters:${conflictingParameters.join(', ')}. These parameters already exist for the product.` });

        }       
        else
        {
            const insertQuery = "INSERT INTO product_master (product_name, parameter, min_parameter, max_parameter, unit,value_oknotok, compulsory) VALUES (?, ?, ?, ?, ?, ?, ?)";
            for(const parameter of parameters)
            {
                const {parameterName,minVal,maxVal,unit,val,comp} = parameter
                const [insertResult] = await db.promise().query(insertQuery, [productName, parameterName, minVal, maxVal, unit,val,comp]);
            }
            res.status(201).send({ msg: "Record inserted successfully"});
        }
    } catch (err) {
        console.error(`Database error: ${err}`);
        res.status(500).send({ msg: `Internal server error: ${err}` });
    }

}

 async function getInfoFromProductMaster(req,res){
    try{
        var query = "SELECT * FROM product_master"
        const [result] = await db.promise().query(query)
        if(result.length===0){
            res.status(200).send({msg:"No infomation about products exist in database."})
        }
        else{
            res.status(201).send(result)
        }
    }catch(err){
        console.error(`Database error: ${err}`);
        res.status(500).send({msg:`Internal server error: ${err}`})
    }
}

 async function deleteFromProductMaster(req,res){
    const {productId} = req.query
    try{
        var selectQuery = "SELECT id,product_name,parameter FROM product_master WHERE id = ?"
        const [selectResult] = await db.promise().query(selectQuery,[productId])

        if(selectResult.length === 0){
            res.status(404).send({msg:"Product does not exist in database"})
            return;
        }

        
        var deleteQuery = "DELETE FROM product_master WHERE id = ?"
        const [deleteResult] = await db.promise().query(deleteQuery,[productId])
        
        // console.log({"Rows deleted":deleteResult.affectedRows,"Row deleted":selectResult});
        res.status(201).send({msg:`Parameter: ${selectResult[0].parameter} of product: ${selectResult[0].product_name} deleted from database successfully  `})
    }catch(err){
        console.error(`Database error: ${err}`);
        res.status(500).send({msg:`Internal server error: ${err}`})
    }
}

 async function updateProductMaster(req,res){
    // const { productId, updatedFields } = req.body;
    const {productName,parameters} = req.body
    try {
        const updateQuery = "UPDATE product_master SET max_parameter = ?, min_parameter = ?, unit = ? ,value_oknotok =? , compulsory=? WHERE id = ? "
        const updateData = []
        for(const parameter of parameters)
        {
            const {id,maxVal,minVal,unit,val,comp} = parameter
            const updateResult = await db.promise().query(updateQuery,[maxVal,minVal,unit,id,val,comp])
            updateData.push(updateResult)
        }
        if(updateData.length===0){
            res.status(409).send({msg:"Server Error: Product not found"})
            return
        }
        res.status(200).send({ msg: "Data updated successfully" });
    } catch (err) {
        console.error(`Database error: ${err}`);
        res.status(500).send({ msg: `Internal server error: ${err}` });
    }
}

async function getOneProductAllParametersInfoFromProductMaster(req,res){
    const {productName} = req.query
    try{
        const selectQuery = "SELECT * FROM product_master WHERE product_name = ?"
        const [selectResult] = await db.promise().query(selectQuery,[productName])
        if(selectResult.length===0){
            return res.status(409).send({msg:"Product does not exist in database"})
        }
        res.status(201).send(selectResult)
    }catch(err){
        console.error(`Database error: ${err}`);
        res.status(500).send({ msg: `Internal server error: ${err}` });
    }
}

async function getOneProductOneParameterInfoFromProductMaster(req,res){
    const {productName,productParameter} = req.query
    try{
        const selectQuery = "SELECT * FROM product_master WHERE product_name = ? && parameter = ?"
        const [selectResult] = await db.promise().query(selectQuery,[productName,productParameter])
        if(selectResult.length===0){
            return res.status(409).send({msg:"Product does not exist in database"})
        }
        res.status(201).send(selectResult)
    }catch(err){
        console.error(`Database error: ${err}`);
        res.status(500).send({ msg: `Internal server error: ${err}` });
    }
}

async function getProductNames(req,res){
    try {
        const searchQuery = "SELECT DISTINCT product_name FROM product_master"
        const [searchResult] = await db.promise().query(searchQuery)
        res.status(201).send(searchResult)
    } catch (err) {
        console.error(`Database error: ${err}`);
        res.status(500).send({ msg: `Internal server error: ${err}` });
    }
}

export { insertInProductMaster, getInfoFromProductMaster, deleteFromProductMaster, updateProductMaster, getOneProductAllParametersInfoFromProductMaster, getOneProductOneParameterInfoFromProductMaster, getProductNames };
