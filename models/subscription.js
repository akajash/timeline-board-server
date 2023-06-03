import mongoose from 'mongoose'

const subscriptionSchema = mongoose.Schema({
    currentPlan: Number,
    expiry_date: {
        type: Date,
        default: new Date()
    } ,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    
})

const Subscription = new mongoose.model("Subscription",subscriptionSchema);
export default Subscription