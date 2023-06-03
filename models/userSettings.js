import mongoose from 'mongoose'

const settingsSchema = mongoose.Schema({
    entries: Number,
    delete_tasks: Boolean,
    creator: String,
    createdAt: {
        type: Date,
        default: new Date()
    }
})

const Settings = new mongoose.model("Settings",settingsSchema);
export default Settings