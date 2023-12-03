import { useFormik} from "formik";
import * as Yup from "yup";
import Table from "../table"
import WindalsNav from "../navbar";
import './jobReport.css'

function ProductReport() {
    const productName = "Fetched Product Name"
    const columns = [
        {field:'date', label:'Date'},
        {field:'intime', label:'In Time'},
        {field:'outtime', label:'Out Time'},
        {field:'job_name', label:'Job Name'},
    ]

    const table = [
        {
            date: "10/10/2023",
            intime: "12:54",
            outtime: "13:05",
            job_name: "A",
        },
        {
            date: "20/10/2023",
            intime: "12:54",
            outtime: "13:05",
            job_name: "B",
        },
        {
            date: "20/10/2023",
            intime: "12:54",
            outtime: "13:05",
            job_name: "C",
        },
        {
            date: "20/10/2023",
            intime: "12:54",
            outtime: "13:05",
            job_name: "D",
        },
    ]

    const validationSchema = Yup.object().shape({
        productName: Yup.string().required("Required")
    })

    const formik = useFormik({
        initialValues: {
            productName: ""
        },
        validationSchema: validationSchema,
    })

    return (
        <div>
            <WindalsNav/>
            <div className="jobreport">
                <h1 className="heading" style={{marginBottom:'3vh'}}>Product Report</h1>
                
                    <label htmlFor="" style={{fontWeight:600, fontSize:'1.4rem'}}>Product Name</label>
                    <input
                className=""
                type="text"
                value={formik.values.jobName}
                placeholder=""
                name="Product Name"
                style={{borderRadius:'12px', height:'5vh'}}
            />
                
            
            <button className="buttoncss">Submit</button>
            <br />
            <p>{productName}</p>
            <Table columns={columns} data={table}/>
            </div>
            
        </div>
    )
}

export default ProductReport