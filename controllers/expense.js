import Mongoose from 'mongoose';
import Expense from '../models/expense.js'
import Analytics from '../models/analytics.js'

export const fetchProjectExpenses = async(req,res) => {

    const userId = req.userId
    const {order_id} = req.params

    try{
        
        

        const page = parseInt(req.query.page) || 1;
        const pageSize = 25;
        const skip = (page - 1) * pageSize;
        const total = await Expense.countDocuments({user: userId, order_id: order_id});
        

        const pages = Math.ceil(total / pageSize);


        if(page > pages){
            return res.status(404).json({
                status: 'fail',
                message: "Page not Found"
            })
        }

        const result = await Expense.find({user: userId,order_id: order_id}).sort({createdAt: -1}).skip(skip).limit(pageSize);
        
        res.status(200).json({
            status: 'success',
            count: result.length,
            page,
            pages,
            data: result
        })

    }catch(error){
        res.status(404).json({message: error.message});
    }
}

export const fetchGeneralExpenses = async(req,res) => {

    const userId = req.userId


    try{
        
        let query = Expense.find({user: userId})

        const page = parseInt(req.query.page) || 1;
        const pageSize = 25;
        const skip = (page - 1) * pageSize;
        const total = await Expense.countDocuments({user: userId});
        

        const pages = Math.ceil(total / pageSize);

        

        if(page > pages){
            return res.status(404).json({
                status: 'fail',
                message: "Page not Found"
            })
        }

        const result = await query.skip(skip).limit(pageSize);
        
        res.status(200).json({
            status: 'success',
            count: result.length,
            page,
            pages,
            data: result
        })

    }catch(error){
        res.status(404).json({message: error.message});
    }
}

export const createExpense = async(req,res) => {
    
    const expense = req.body;
    const newExpense = new Expense({...expense, user: req.userId, createdAt: new Date().toISOString()})

    try{
        await newExpense.save()
        // const analytics = await Analytics.findOne({creator:req.userId})

        // const analyticData = {
        //     revenue: parseFloat(analytics.revenue) - parseFloat(expense.amount)
        // }

        // const updatedAnalytics = await Analytics.findByIdAndUpdate(analytics.id,analyticData,{new:true})
        // console.log(updatedAnalytics)
        res.status(201).json(newExpense)
    }
    catch(error){
        res.status(409).json({message: error.message})
    }
}

export const updateExpense = async(req,res) => {
    const expense = req.body
    const {id} = req.params

    if(!Mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("Expense doesn't exist!")

    const result = await Expense.findById(id)

    if(result?.user === req.userId)
    {
        const updatedExpense = await Expense.findByIdAndUpdate(id,{...expense, id},{new: true})

    // if(result.amount !== expense.amount){

    //     const analytics = await Analytics.findOne({creator:req.userId})
    //     console.log(result.amount)
    //     console.log(expense.amount)
    //     var diff = 0

    //     if(result.amount >= expense.amount){
    //         diff = parseFloat(result.amount) - parseFloat(expense.amount)
    //     }
    //     else{
    //         diff = parseFloat(expense.amount) - parseFloat(result.amount)
    //     }
        

    //     const analyticData = {
    //         revenue: parseFloat(analytics.revenue) - diff
    //     }

    //     await Analytics.findByIdAndUpdate(analytics.id,analyticData,{new:true})
        // const analyticss = await Analytics.findOne({creator:req.userId})
        // console.log(analyticss.revenue)

        // const analyticNewData = {
        //     revenue: parseFloat(analytics.revenue) - parseFloat(expense.amount)
        // }

        // await Analytics.findByIdAndUpdate(analytics.id,analyticNewData,{new:true})

    // }
        res.json(updatedExpense)
    }
    else {
        return res.status(403).send("Unauthorized");
    }
    
}

export const deleteExpense = async(req,res) => {
    

    const {id} = req.params

    if(!Mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("Expense doesn't exist!")

    const result = await Expense.findById(id)
    

    if(result?.user == req.userId)
    {
        await Expense.findByIdAndRemove(id)
        // const analytics = await Analytics.findOne({creator:req.userId})

        // const analyticData = {
        //     revenue: parseFloat(analytics.revenue) + parseFloat(result.amount)
        // }

        // await Analytics.findByIdAndUpdate(analytics.id,analyticData,{new:true})
        res.json({message: "Expense deleted Successfully"})
    }
    else {
        return res.status(403).send("Unauthorized");
    }

}