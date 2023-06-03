import Mongoose from 'mongoose';
import WorkFlowEvents from '../models/workflowEvents.js'
import Automation from '../models/automation.js';
import Task from '../models/Tasks.js';
import { sendPayload } from './mailManager.js';


export const getEvents = async(req,res) => {
    const userId = req.userId
    try{
        const events = await Automation.find({creator: userId},{event:1})
        const allEvents = [{ label: "On Lead", value: 1 },  { label: "On Order", value: 2 },  { label: "On Pre-Production", value: 3 },{ label: "On Production", value: 4 },{ label: "On Post Production", value: 5 },{ label: "On Delivery", value: 6 },{ label: "On Wrapped Up", value: 7 }]
        // const events = await WorkFlowEvents.findOne({user:userId})
        
        const availableEvents = allEvents.filter((item) => !events.some((obj) => obj.event == item.value))
        
        
        res.status(200).json(availableEvents)
  
    }catch(error){
        console.log(error.message)
    }

}

export const AutomationHandler = async(userId,projectId,eventId) => {
    const workflow = await Automation.find({creator: userId,event: eventId})
    console.log(workflow)
    if(workflow[0] && workflow[0].actions.length){
        console.log("Automation available")
            for(let i = 0; i<workflow[0].actions.length;i++){
                switch(workflow[0].actions[i].action){
                    case 1: const mail = workflow[0].actions[i]
                            mail.project = projectId  
                            console.log(mail) 
                            sendPayload(userId,mail)
                            break;

                    case 2: const task = workflow[0].actions[i]
                            task.projectId = projectId
                            var today = new Date()
                            console.log(today)
                            var deadline = new Date(today.getTime() + task.deadline * 24 * 60 * 60 * 1000)
                            console.log(deadline)
                            task.deadline = deadline
                            console.log(task)
                            const newTask = new Task({...task, creator: userId, createdAt: new Date().toISOString()})
                            await newTask.save()
                            break;

                    case 3: SendInvoice
                }
            }
        }
}
