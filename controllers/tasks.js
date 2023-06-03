import Task from "../models/Tasks.js"
import Mongoose from 'mongoose';
import Automation from "../models/automation.js";

export const fetchAllTasks = async(req,res) => {
    const {id} = req.params
    
    try{
        if(id==0){
            const tasks = await Task.find({creator: req.userId}).sort({createdAt: -1})
            res.status(200).json(tasks)
        }
        else{
            const tasks = await Task.find({creator: req.userId, projectId: id }).sort({createdAt: -1})
            res.status(200).json(tasks)
        }
        
        

    }catch(error){
        res.status(500).json({message: error.message});
    }
}

export const fetchPendingTasks = async(req,res) => {

    const date = new Date()
    try{
        const tasks = await Task.find({creator: req.userId, deadline: { $lt : date}}).limit(4)
        res.status(200).json(tasks)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
    
}

export const fetchTasksByWorkforce = async(req,res) => {

    const {wfid} = req.params


    try{
        
        const tasks = await Task.find({allocated_to: wfid})

        res.status(200).json(tasks)


    }catch(error){
        res.status(500).json({message: error.message});
    }
}

export const createTask = async(req,res) => {
    
    const task = req.body;
    const newTask = new Task({...task, creator: req.userId, createdAt: new Date().toISOString()})

    try{
        await newTask.save()
        const auto = await Automation.find({creator: req.userId,event:{$eq:6}})
        if(auto){
            //perform actions
            console.log(auto)
        }
        res.status(201).json(newTask)
        
    }
    catch(error){
        res.status(409).json({message: error.message})
    }
}

export const updateTask = async(req,res) => {
    const task = req.body
    const {id} = req.params

    if(!Mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("Task doesn't exist!")

    const result = await Task.findById(id)

    if(result?.creator === req.userId)
    {
        const updatedTask = await Task.findByIdAndUpdate(id,{...task, id},{new: true})
        res.json(updatedTask)
    }
    else {
        return res.status(403).send("Unauthorized");
    }
    
}

export const deleteTask = async(req,res) => {

    const {id} = req.params

    if(!Mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("Task doesn't exist!")

    const result = await Task.findById(id)
        
    if(result?.creator === req.userId)
    {
        await Task.findByIdAndRemove(id)
        res.json({message: "Task deleted Successfully"})
    }
    else {
        return res.status(403).send("Unauthorized");
    }

}

export const taskProgress = async(req,res) => {
    const {id} = req.params

    if(!Mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("Task doesn't exist!")

    const result = await Task.findById(id)

    if(result?.creator === req.userId)
    {
        if(result?.status == 0){
            const updatedTask = await Task.findByIdAndUpdate(id,{status:1, id},{new: true})
            res.json(updatedTask)
        }
        else{
            const updatedTask = await Task.findByIdAndUpdate(id,{status:0, id},{new: true})
            res.json(updatedTask)
        }
        
    }
    else {
        return res.status(403).send("Unauthorized");
    }

}