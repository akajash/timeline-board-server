import mongoose from 'mongoose'

const packageSchema = mongoose.Schema({
    package_name: String,
    services: [],
    amount: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    description: String,
    createdAt: {
        type: Date,
        default: new Date()
    },
    
})

const Package = new mongoose.model("Package",packageSchema)

export default Package