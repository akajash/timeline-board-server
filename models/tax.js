import mongoose from 'mongoose'

const taxSchema = mongoose.Schema({
    name: String,
    percent: Number,
    additional_amount : Number,
    description: String,
    creator: String,
    createdAt: {
        type: Date,
        default: new Date()
    }
})

const Tax = new mongoose.model("Tax",taxSchema)
export default Tax