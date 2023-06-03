import mongoose from 'mongoose'

const taskSchema = mongoose.Schema({
    job_title: String,
    description: String,
    allocated_to: {},
    assigned_by: String,
    deadline: {
        type: Date,
        default: new Date()
    },
    feedback: String,
    ratings: Number,
    projectId: String,
    creator: String,
    status: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
})

const Task = new mongoose.model("Task",taskSchema)
export default Task