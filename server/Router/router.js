import Router from "express"
import { insertInProductMaster, getInfoFromProductMaster, deleteFromProductMaster, updateProductMaster, getOneProductAllParametersInfoFromProductMaster, getOneProductOneParameterInfoFromProductMaster, getProductNames } from "../Controllers/productMasterController.js";
import {insertIntoStationMaster,deleteFromStationMaster,getInfoFromStationMaster,getOneStationFromStationMaster,getOneStationOneProductFromStationMaster,updateStationMaster,getStationNamesFromStationMaster, getStationNamesForOneProduct,addNextStationInStationMaster,mobileGetOneStationOneProductFromStationMaster,getStationAndMachinesInfo} from "../Controllers/stationMasterController.js";
import {insertInProductyyyy} from "../Controllers/productyyyyController.js";
import {insertIntoEmployeeMaster,getAllFromEmployee,getOneFromEmployee,updateEmployeeMaster, deleteFromEmployeeMaster, resetPassword} from "../Controllers/employeeMasterController.js"
import {insertInStationyyyyFirst, insertInStationyyyyFirstNextStation,updateInStationyyyy,jobsAtStation,countOfWorkAtStation,workAtStationInDay,getJobesSubmitedAtStation,productReport,jobDetailsReport,insertInStationyyyySameStation,jobsAtReworkStation} from "../Controllers/stationyyyyController.js"
import { login,getNamesFromEmployeeMaster } from "../Controllers/employeeMasterController.js";
import {getOneWorkerStation, insertIntoStationAllocation,getStationAllocated} from "../Controllers/stationAllocationController.js"
import {getAllFromShiftConfig,insertIntoShiftConfig,deleteFromShiftConfig,updateShiftConfig,getActiveShiftNames,getCurrentShift} from "../Controllers/shiftConfigController.js";
import { insertInLoginLog,getFromLoginLog } from "../Controllers/loginlogController.js";
import { deleteMachineFromMachineMaster, getMachineDataForStation, getInfoFromStationMasterWithMachine } from "../Controllers/machineMasterController.js";
import { auth } from "../Middleware/auth.js";

const router = Router()

/**POST MEATHODS */
router.route("/ProductMasterInsert").post(auth,insertInProductMaster)
router.route("/StationMasterInsert").post(auth,insertIntoStationMaster)
router.route("/EmployeeMasterInsert").post(auth,insertIntoEmployeeMaster)
router.route("/login").post(login)
router.route("/ProductyyyyInsert").post(insertInProductyyyy);
router.route("/StationyyyyInsertFirst").post(insertInStationyyyyFirst);
router.route("/StationyyyyInsertFirstNextStation").post(insertInStationyyyyFirstNextStation);
router.route("/StationAllocationInsert").post(auth,insertIntoStationAllocation)
router.route("/StationyyyyShowJob").post(jobsAtStation);
router.route("/StationyyyyCountAtStation").post(countOfWorkAtStation)
router.route("/StationyyyyProductReport").post(productReport)
router.route("/StationyyyyJobReport").post(jobDetailsReport)
router.route("/StationyyyyInsertSameStation").post(insertInStationyyyySameStation)
// router.route("/StationyyyyWorkInDay").post(workAtStationInDay)
router.route("/ShiftConfigInsert").post(auth,insertIntoShiftConfig)
router.route("/loginLogInsert").post(insertInLoginLog)
router.route("/MachineMasterGetMachine").post(getMachineDataForStation)



/**GET MEATHODS */
router.route('/ProductMasterGet').get(getInfoFromProductMaster)
router.route('/ProductMasterGetOneProductAllParameters').get(getOneProductAllParametersInfoFromProductMaster)
router.route('/ProductMasterGetOneProductOneParameter').get(getOneProductOneParameterInfoFromProductMaster)
router.route("/StationMasterGet").get(getInfoFromStationMaster)
router.route('/ProductMasterGetProductNames').get(getProductNames)
router.route('/StationMasterGetOneStation').get(getOneStationFromStationMaster)
router.route('/StationMasterGetOneStationOneProduct').get(getOneStationOneProductFromStationMaster)
router.route('/MobileStationMasterGetOneStationOneProduct').get(mobileGetOneStationOneProductFromStationMaster)
router.route('/EmployeeMasterGet').get(getAllFromEmployee)
router.route('/EmployeeMasterGetOne').get(getOneFromEmployee)
router.route('/EmployeeMasterGetNames').get(getNamesFromEmployeeMaster)
router.route('/StationMasterGetNames').get(getStationNamesFromStationMaster)
router.route('/StationMasterGetNamesForOneProduct').get(getStationNamesForOneProduct)
router.route('/getOneWorkerStation').get(getOneWorkerStation)
router.route("/StationyyyyWorkAtStationInDay").get(workAtStationInDay)
router.route('/StationyyyyGetJobsSubmitted').get(getJobesSubmitedAtStation)
router.route('/StationyyyyGetCountOfWorkAtStation').get(countOfWorkAtStation)
router.route('/StationyyyyReworkJob').get(jobsAtReworkStation)
router.route("/ShiftConfigGet").get(getAllFromShiftConfig)
router.route("/ShiftConfigGetActiveShiftNames").get(getActiveShiftNames)
router.route("/ShiftConfigGetCurrentShift").get(getCurrentShift)
router.route('/WorkerAllocation').get(getStationAllocated)
router.route('/GetStationAndMachinesInfo').get(getStationAndMachinesInfo)
router.route("/loginLogGet").get(getFromLoginLog)
router.route("/StationMasterInfoWithMachine").get(getInfoFromStationMasterWithMachine)
router.route('/verifyLogin').get(auth,(req,res)=>{
    const {userId} = req.body.token
    try{
        if(!userId || userId===null || userId===undefined){
            return res.status(401).send({msg:"Authorization Failed",redirectUrl:"http://localhost:3000"})
        }
        res.status(200).end()
    }catch(err){
        console.error(`Database error: ${err}`);
        res.status(500).send({ msg: `Internal server error: ${err}` });
    }
})



/**DELETE MEATHODS */
router.route('/ProductMasterDelete').delete(auth,deleteFromProductMaster)
router.route('/StationMasterDelete').delete(auth,deleteFromStationMaster)
router.route('/EmployeeMasterDelete').delete(auth,deleteFromEmployeeMaster)
router.route("/ShiftConfigDelete").delete(auth,deleteFromShiftConfig)
router.route("/MachineMasterDelete").delete(auth,deleteMachineFromMachineMaster)

/**PUT MEATHOD */
router.route('/ProductMasterUpdate').put(auth,updateProductMaster);
router.route('/StationMasterUpdate').put(auth,updateStationMaster)
router.route('/EmployeeMasterUpdate').put(auth,updateEmployeeMaster)
router.route('/StationMasterAddNextStation').put(auth,addNextStationInStationMaster)
router.route('/Stationyyyyupdate').put(updateInStationyyyy)
router.route("/ShiftConfigUpdate").put(auth,updateShiftConfig)
router.route('/ResetPassword').put(auth,resetPassword)

export default router;