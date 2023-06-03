import mongoose from 'mongoose'

const analyticsSchema = mongoose.Schema({
    revenue: {
        type: Number,
        default: 0
    },
    leads: Number,
    sales: Number,
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
})

const Analytics = new mongoose.model("Analytics", analyticsSchema)

export default Analytics