import mongoose from "mongoose"

const autoSchema = mongoose.Schema({
    title: String,
    event: Number,
    offset: Number,
    actions: [],
    creator: String,
    createdAt: {
        type: Date,
        default: new Date()
    }
})

const Automation = new mongoose.model("Automation",autoSchema)
export default Automation