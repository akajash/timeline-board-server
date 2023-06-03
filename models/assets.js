import mongoose from 'mongoose'

const assetsSchema = mongoose.Schema({
    name: String,
    incharge: {},
    description: String,
    createdAt: {
        type: Date,
        default: new Date()
    },
    user: String
})


const Assets = new mongoose.model("Assets",assetsSchema)

export default Assets