
import Mongoose from 'mongoose';
import Automation from '../models/automation.js';
import WorkflowEvents from '../models/workflowEvents.js';


export const fetchAll = async(req,res) => {
    
    const userId = req.userId

    try{
        
        let query = Automation.find({creator: userId},{title : 1})

        const page = parseInt(req.query.page) || 1;
        const pageSize = 6;
        const skip = (page - 1) * pageSize;
        const total = await Automation.countDocuments({creator: userId});
        

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

export const createWorkflow = async(req,res) => {
    
    const workflow = req.body;
    const newWorkflow = new Automation({...workflow, creator: req.userId, createdAt: new Date().toISOString(),status: 0})

    try{
        await newWorkflow.save()
        // let events = await WorkflowEvents.findOne({user: req.userId})
        // let workflows = await Automation.find({creator: req.userId},{title: 1})
        // if(Object.keys(events.availableEvents).length == 0 && workflows.length == 0){
        //     await WorkflowEvents.create({user: req.userId})

        // }
        // delete(events.availableEvents[`${newWorkflow.event}`])        
        // await WorkflowEvents.findByIdAndUpdate(events.id,{...events},{new: true})
        res.status(201).json(newWorkflow)
    }
    catch(error){
        res.status(409).json({message: error.message})
    }
}

export const updateWorkflow = async(req,res) => {
    const workflow = req.body
    const {id} = req.params

    if(!Mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("Workflow doesn't exist!")

    const result = await Automation.findById(id)

    if(result?.creator === req.userId)
    {
        const updatedWorkflow = await Automation.findByIdAndUpdate(id,{...workflow, id},{new: true})
        res.json(updatedWorkflow)
    }
    else {
        return res.status(403).send("Unauthorized");
    }
    
}

export const deleteWorkflow = async(req,res) => {

    const {id} = req.params

    if(!Mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("Workflow doesn't exist!")

    const result = await Automation.findById(id)
        
    if(result?.creator === req.userId)
    {
        await Automation.findByIdAndRemove(id)
        // let events = await WorkflowEvents.findOne({user: req.userId})
        // var options = {
        //         1: "On new lead",
        //         2: "On Lead conversion",
        //         3: "On Post Production",
        //         4: "On Wrapped Up"
        // }

        // console.log(events)
        // events.availableEvents[result.event] = options[result.event]    

        // await WorkflowEvents.findByIdAndUpdate(events.id,{...events},{new: true}) 
        res.json({message: "Workflow deleted Successfully"})
    }
    else {
        return res.status(403).send("Unauthorized");
    }

}

export const fetchSingleWorkflow = async(req,res) => {
    const workflowId = req.params
    
    const data = await Automation.findOne({"_id": workflowId.id})
    
    if(req.userId === data?.creator)
    {
        res.status(200).json(data)

    }
    else{
        res.status(404).json({error: "Data not found"})
    }



}

