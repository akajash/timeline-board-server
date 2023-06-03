import mongoose from 'mongoose'
import crypto from 'crypto'

const userSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    id: {type: String},
    role: {
        type: Number,
        default: 0
    },
    parent: {type: String},
    products: [],
    country:String,
    currency:String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
})

userSchema.methods.getResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex")

    this.resetPasswordExpire = Date.now() + 10 * (60 * 1000)

    return resetToken;
}

export default mongoose.model("User", userSchema);