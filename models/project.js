import mongoose from 'mongoose'

const projectSchema = mongoose.Schema({
    eventName : String,
    eventType: String,
    eventLocation : String,
    primaryContact : Number,
    secondaryContact : Number,
    dateFrom : Date,
    dateTo: Date,
    package: String,
    reference: {},
    amountQuoted: Number,
    amountPaid : Number,
    creator: String,
    email: String,
    discount: Number,
    discount_type: String,
    services: [],
    createdAt: {
        type: Date,
        default: new Date()
    },
    additionalNotes: String,
    status: 0

})

const Project = new mongoose.model("Project",projectSchema)

export default Project