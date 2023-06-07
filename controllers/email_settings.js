import Mongoose from 'mongoose';
import EmailSettings from '../models/emailSettings.js'

export const getSettings = async(req,res) => {
    const userId = req.userId
    try{
        const settings = await EmailSettings.findOne({user:userId})
        settings.password = undefined
        res.status(200).json(settings)
  
    }catch(error){
        console.log(error.message)
    }

}


// export const createSettings = async(req,res) => {
    
//     const newSettings = new EmailSettings({user: req.userId})

//     try{
//         await newSettings.save()
//         res.status(201)
//         console.log("new id created")
//     }
//     catch(error){
//         res.status(409).json({message: error.message})
//     }
// }

export const updateSettings = async(req,res) => {
    const settings = req.body
    try{
        const updatedSettings = await EmailSettings.findOneAndUpdate({user:req.userId}, {...settings})
        res.json(updatedSettings)
    }
    catch(error){
        res.status(409).json({message: error.message})
    }
    

    
    
}

