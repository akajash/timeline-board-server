import mongoose from 'mongoose'

const workforceSchema = mongoose.Schema({
    name: String,
    primaryContact : String,
    secondaryContact: String,
    dateOfJoining: Date,
    identity: String,
    payout_type: String,
    payout_amount : Number,
    noOfTasks : Number,
    designation: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    email: String,
    work_type: String,
    about : String,
    createdAt: {
        type: Date,
        default: new Date()
    },
    creator: String
})


const Workforce = new mongoose.model("Workforce",workforceSchema)

export default Workforce