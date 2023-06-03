import mongoose from 'mongoose'

const emailTemplateSchema = mongoose.Schema({
    title: String,
    subject: String,
    body: String,
    creator: String,
    createdAt: {
        type: Date,
        default: new Date()
    }
})

const EmailTemplate = new mongoose.model("EmailTemplate", emailTemplateSchema)

export default EmailTemplate