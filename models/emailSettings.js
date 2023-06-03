import mongoose from 'mongoose'

const emailSettingsSchema = mongoose.Schema({
    server: String,
    username: String,
    password: String,
    port: Number,
    ssl: Boolean,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    
})

const EmailSettings = new mongoose.model("EmailSettings",emailSettingsSchema);
export default EmailSettings