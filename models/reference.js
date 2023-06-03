import mongoose from 'mongoose'

const referenceSchema = mongoose.Schema({
    reference_name: String,
    count: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
})

const Reference = new mongoose.model("Reference",referenceSchema)
export default Reference