import Task from "../models/Tasks.js"
import Mongoose from 'mongoose';
import Automation from "../models/automation.js";
import Workforce from "../models/Workforce.js";
import sendEmail from './mail.js'

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
    const newTask = await new Task({...task, creator: req.userId, createdAt: new Date().toISOString()})

    try{
        await newTask.save()
        const {email} =  await Workforce.find({id:newTask.allocated_to.id})
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          };
          
          const formattedDate = newTask.deadline.toLocaleDateString('en-US', options);
        const message = `
            <h1>You've been assigned with a Task</h1>
            <p><b>Task Title : </b>${newTask.job_title}</p>
            <p><b>Task Deadline : </b>${formattedDate}</p>
            <p><b>Task Description : </b>${newTask.description}</p>

        `

        try {
            await sendEmail({
                to: email,
                subject: "Task Assigned", 
                text: message
            })

            res.status(200).json({success: true, data: "Check your inbox"})

        } catch(error){
            user.resetPasswordToken = undefined
            user.resetPasswordExpire = undefined

            await user.save()

            return next(new ErrorResponse("Email couldn't be sent",500))
        }
        // const auto = await Automation.find({creator: req.userId,event:{$eq:6}})
        // if(auto){
        //     //perform actions
        //     console.log(auto)
        // }
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