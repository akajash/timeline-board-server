import Mongoose from "mongoose";

import Workforce from '../models/Workforce.js'

export const getEmployees = async(req,res) => {
    
    const userId = req.userId

    try{
        
        let query = Workforce.find({creator: userId})

        const page = parseInt(req.query.page) || 1;
        const pageSize = 10;
        const skip = (page - 1) * pageSize;
        const total = await Workforce.countDocuments({creator: userId});
        

        const pages = Math.ceil(total / pageSize);

        query = query.skip(skip).limit(pageSize)

        if(page > pages){
            return res.status(404).json({
                status: 'fail',
                message: "Page not Found"
            })
        }

        const result = await query;
        
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


export const fetchAllEmployees = async(req,res) => {
    const userId = req.userId
    try{
        const workforce = await Workforce.find({creator: userId},{name:1,id:1})
        res.status(200).json(workforce)
        

    }catch(error){
        res.status(404).json({message: error.message});
        
    }
}

export const createEmployee = async(req,res) => {
    const workforce = req.body

    const newWorkForce = new Workforce({...workforce, creator: req.userId, createdAt: new Date().toISOString()})

    try{
        await newWorkForce.save()
        res.status(201).json(newWorkForce)
    }catch(error){
        res.status(409).json({message: error.message})
    }
}



export const updateEmployee = async(req,res) => {

    const {id} = req.params
    const employee = req.body

    if(!Mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("Employee doesn't exist")

    const result = await Workforce.findById(id)

    if(result?.creator === req.userId){
        const updatedEmployee = await Workforce.findByIdAndUpdate(id, {...employee, id},{new: true})
        res.json(updatedEmployee)
    }
    else{
        return res.status(403).send("Unauthorized");
    }
}

export const deleteEmployee = async(req,res) => {
    const {id} = req.params

    if(!Mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("Employee doesn't exist!")

    const result = await Workforce.findById(id)
        
    if(result?.creator === req.userId)
    {
        await Workforce.findByIdAndRemove(id)
        res.json({message: "Workforce deleted Successfully"})
    }
    else {
        return res.status(403).send("Unauthorized");
    }

}