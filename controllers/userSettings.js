
import Mongoose from 'mongoose';
import Settings from '../models/userSettings.js'

export const getSettings = async(req,res) => {
    const userId = req.userId
    try{
    const settings = await Settings.find({creator:userId})
    if(settings.length < 1){
        createSettings()
    }

    res.status(200).json(settings[0])
  
    }catch(error){
        console.log(error.message)
    }

}


export const createSettings = async(req,res) => {
    const settings = {
        entries: 5,
        delete_tasks: true
    }
    const newSettings = new Settings({...settings,creator: req.userId, createdAt: new Date().toISOString() })

    try{
        await newSettings.save()
        res.status(201)
    }
    catch(error){
        res.status(409).json({message: error.message})
    }
}

export const updateSettings = async(req,res) => {
    const settings = req.body
    const {id} = req.params

    if(!Mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("Settings doesn't exist!")

    const result = await Settings.findById(id)

    if(result?.creator === req.userId)
    {
        const updatedSettings = await Settings.findByIdAndUpdate(id,{...settings, id},{new: true})
        res.json(updatedSettings)
    }
    else {
        return res.status(403).send("Unauthorized");
    }
    
}

