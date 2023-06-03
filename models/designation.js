import mongoose from 'mongoose'

const designationSchema = mongoose.Schema({
    title: String,
    creator: String,
})

const Designation = new mongoose.model("Designation",designationSchema)
export default Designation