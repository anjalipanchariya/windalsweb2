import db from "../Database/connection.js";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import path from 'path'
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });
const JWT_SECRET = process.env.JWT_SECRET;

async function insertIntoEmployeeMaster(req, res) {
    var {
      userName,
      firstName,
      lastName,
      nickName,
      password,
      designation,
      joiningDate,
      mobileNo,
      accessGiven
    } = req.body;
    
    if (mobileNo === '') {
      mobileNo = null;
    }
  
    try {
      const searchUserNameQuery = "SELECT employee_id FROM employee_master WHERE user_name = ?";
      const [searchUserNameResult] = await db.promise().query(searchUserNameQuery, [userName]);
  
      const searchMobileNoQuery = "SELECT employee_id FROM employee_master WHERE mobile_no = ?";
      const [searchMobileNoResult] = await db.promise().query(searchMobileNoQuery, [mobileNo]);
  
      if (searchUserNameResult.length > 0) {
        res.status(409).send({ msg: "User name already exists. Use another username." });
      } else if (searchMobileNoResult.length > 0) {
        res.status(409).send({ msg: "Mobile number already exists. Enter a different mobile no." });
      } else {
        bcrypt.hash(password, 10, async (err, hash) => {
          if (err) {
            res.status(409).send({ msg: `SERVER ERROR: Error in encrypting password: ${err}` });
          } else {
            const insertQuery =
              "INSERT INTO employee_master (user_name,first_name,last_name,nick_name,password,designation,joining_date,mobile_no,access_given) VALUES (?,?,?,?,?,?,?,?,?)";
  
            try {
              const [insertResult] = await db
                .promise()
                .query(insertQuery, [userName, firstName, lastName, nickName, hash, designation, joiningDate, mobileNo, accessGiven]);
              
              res.status(201).send({ msg: "Record inserted successfully", insertedId: insertResult.insertId });
            } catch (error) {
              console.error("Database error:", error);
              res.status(500).send({ msg: `Internal server error: ${error}` });
            }
          }
        });
      }
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).send({ msg: `Internal server error: ${error}` });
    }
}

async function getAllFromEmployee(req,res){
    try{
        var query = "SELECT employee_id,first_name,last_name,user_name,nick_name,mobile_no,joining_date,leaving_date,designation,access_given FROM employee_master"
        const [result] = await db.promise().query(query)
        const updatedResult = result.filter((employee)=>employee.user_name!=="admin")
        res.status(201).send(updatedResult)
    }catch(err){
        console.error("Database error:", err);
        res.status(500).send({msg:`Internal server error: ${err}`})
    }
}

async function getOneFromEmployee(req,res){
    const {userName} = req.query
    try{
        const selectQuery="SELECT * FROM employee_master WHERE user_name = ?"
        const [selectResult]= await db.promise().query(selectQuery,[userName]);
        if(selectResult.length>0)
        {
            res.status(201).send(selectResult)
        }
        else if(selectResult[0].user_name==='admin')
        { 
          res.status(501).send({msg:"You cant excess admin info"})
        }
        else{
            res.status(501).send({msg:"Employee does not exist in the database"})
        }
    }catch(err){
        console.error("Database error",err);
        res.status(500).send({msg:`Internal server error: ${err}`})
    }
}

async function updateEmployeeMaster(req, res) {
  let { userName, firstName, lastName, nickName, designation, joiningDate, mobileNo, employeeId, accessGiven } = req.body;
  joiningDate = new Date(req.body.joiningDate); // Convert to a JavaScript Date object

  try {
      const updateQuery = `UPDATE employee_master SET user_name=?, first_name=?, last_name=?, nick_name=?, designation=?, joining_date=?, mobile_no=?, access_given=? WHERE employee_id = ?`;
      const updateResult = await db.promise().query(updateQuery, [userName, firstName, lastName, nickName, designation, joiningDate, mobileNo, accessGiven, employeeId]);

      const affectedRows = updateResult.affectedRows;

      if (affectedRows === 0) {
          return res.status(404).send({ msg: "Employee not found" });
      }

      res.status(200).send({ msg: "Employee data updated successfully" });
  } catch (err) {
      console.error("Database error:", err);
      res.status(500).send({ msg: `Internal server error: ${err}` });
  }
}


async function deleteFromEmployeeMaster(req,res){
  const {employeeId} = req.query
  try{
      var selectQuery = "SELECT employee_id FROM employee_master WHERE employee_id = ?"
      const [selectResult] = await db.promise().query(selectQuery,[employeeId])

      if(selectResult.length === 0){
          res.status(404).send({msg:"Employee does not exist in database"})
          return;
      }

      var deleteQuery = "DELETE FROM employee_master WHERE employee_id = ?"
      const [deleteResult] = await db.promise().query(deleteQuery,[employeeId])
      
      // console.log({"Rows deleted":deleteResult.affectedRows,"Row deleted":selectResult});
      res.status(201).send({msg:`Employee: firstname-${selectResult[0].first_name} lastname-${selectResult[0].last_name} username-${selectResult[0].user_name} deleted from database successfully  `})
  }catch(err){
      console.error(`Database error: ${err}`);
      res.status(500).send({msg:`Internal server error: ${err}`})
  }
}

async function login(req, res) {
    const { userName, password } = req.body;
    try {
      const selectUserQuery = "SELECT password,employee_id,user_name FROM employee_master WHERE user_name = ?";
      const [selectUserResult] = await db.promise().query(selectUserQuery, [userName]);
      if (selectUserResult.length === 0) {
        res.status(401).send({ msg: "Error:Username does not exist" });
        return;
      } else {
        const hashedPassword = selectUserResult[0].password;
        bcrypt.compare(password, hashedPassword, (err, result) => {
          if (err) {
            res.status(500).send({ msg: `Error:Internal server error: ${err}` });
            return;
          } else if (result) {
             const token = jwt.sign({
              userId: selectUserResult[0].employee_id,
              designation: selectUserResult[0].designation
            },JWT_SECRET,{
              expiresIn: "12h"
            })
            res.status(201).send({ msg: "Done:Login successful",employeeId:selectUserResult[0].employee_id,userName:selectUserResult[0].user_name,token:token });
            return;
          } else {
            res.status(401).send({ msg: "Error:Invalid password" });
            return;
          }
        });
      }
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).send({ msg: `Internal server error: ${error}` });
    }
  }

async function getNamesFromEmployeeMaster(req,res){
  try {
    const selectQuery = "SELECT DISTINCT first_name,last_name,user_name,employee_id from employee_master"
    const [selectResult] = await db.promise().query(selectQuery)
    const updatedResult = selectResult.filter((employee)=>employee.user_name!=='admin')
    res.status(201).send(updatedResult)
  } catch (error) {
      console.error("Database error:", error);
      res.status(500).send({ msg: `Internal server error: ${error}` });
  }
}

async function resetPassword(req,res) {
  const {userName,newPassword} = req.body
  try {
    const selectQuery = "SELECT employee_id FROM employee_master WHERE user_name = ?"
    const [selectResult] = await db.promise().query(selectQuery,[userName])
    if(selectResult.length === 0){
      return res.status(409).send({msg:"No such user exists."})
    }
    bcrypt.hash(newPassword, 10, async (err,hashedPassword)=>{
      if (err) {
        res.status(409).send({ msg: `SERVER ERROR: Error in encrypting password: ${err}` });
      } else {
        const updateQuery =
          "UPDATE employee_master SET password = ? WHERE user_name = ?"
        try {
          const [updateResult] = await db
            .promise()
            .query(updateQuery,[hashedPassword,userName])
          res.status(201).send({ msg: "Password changed successfully"});
        } catch (error) {
          console.error("Database error:", error);
          res.status(500).send({ msg: `Internal server error: ${error}` });
        }
      }
    })
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).send({ msg: `Internal server error: ${error}` });
  }
}

export {insertIntoEmployeeMaster,getAllFromEmployee,getOneFromEmployee,updateEmployeeMaster,login,getNamesFromEmployeeMaster,deleteFromEmployeeMaster,resetPassword}

/** accessOptionsOrder = [ "Add User", "View User", "Delete User", "Modify User", "Add Product", "Veiw Product", "Delete Product", "Modify Product",
   "Add Station", "View Station", "Delete Station", "Modify Station", "Allocate Next Station for Product", "Update Next Station Allocated for Product", 
  "Delete Next Station Allocated for Product", "View Next Station Allocated for Product", "Allocate Station to Worker", "View Station allocated to worker","Configure Shift"] 
  
  1 for access given 0 for not given
*/