import mongoose from "mongoose"

const expenseSchema = mongoose.Schema({
    transaction: {
        type: Number,
        default: 0
    },
    title: String,
    amount: Number,
    order_id: String,
    user: String,
    createdAt: {
        type: Date,
        default: new Date()
    }
})

const Expense = new mongoose.model("Expense", expenseSchema)
export default Expense