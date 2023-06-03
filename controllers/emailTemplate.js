import fs from "fs"

import EmailTemplate from "../models/emailTemplate.js"
import  {uploadFile, deleteFile}  from "./aws.js";
import Mongoose from 'mongoose';

export const fetchAll = async(req,res) => {

    const userId = req.userId

    try{
        
        let query = EmailTemplate.find({creator: userId})

        const page = parseInt(req.query.page) || 1;
        const pageSize = 5;
        const skip = (page - 1) * pageSize;
        const total = await EmailTemplate.countDocuments({creator: userId});
        

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

export const fetchTemplateDD = async(req,res) => {
    try{
        const data = await EmailTemplate.find({creator: req.userId},{title: 1})
        res.status(200).json(data);

    }catch(error){
        res.status(404).json({message: error.message})
    }
}

export const fetchSingleTemplate = async(req,res) => {

    const {id} = req.params

    if(!Mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("Template doesn't exist!")

    const result = await EmailTemplate.findById(id)
        
    if(result?.creator === req.userId)
    {
        res.status(200).json(result)
        
    }
    else {
        return res.status(403).send("Unauthorized");
    }

}

export const createTemplate = async(req,res) => {
    
    const template = req.body;    
    const newTemplate = new EmailTemplate({...template, creator: req.userId})

    try{
        await newTemplate.save()
        res.status(201).json(newTemplate)
        const filename = `${newTemplate._id}.hbs`
        fs.appendFile(filename,newTemplate.body,function(err){
            uploadFile(req.userId,filename)
            if(err){
                console.log(error)
            }
        })
        
    }
    catch(error){
        res.status(409).json({message: error.message})
    }
}

export const updateTemplate = async(req,res) => {
    const template = req.body
    const {id} = req.params



    if(!Mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("Template doesn't exist!")

    const result = await EmailTemplate.findById(id)

    if(result?.creator === req.userId)
    {
        const updatedTemplate = await EmailTemplate.findByIdAndUpdate(id,{...template, id},{new: true})
        res.json(updatedTemplate)
        const filename = `${id}.hbs`
        fs.appendFile(filename,updatedTemplate.body,function(err){
            uploadFile(req.userId,filename)
            if(err){
                console.log(error)
            }
        })
    }
    else {
        return res.status(403).send("Unauthorized");
    }
    
}

export const deleteTemplate = async(req,res) => {

    const {id} = req.params

    if(!Mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("Template doesn't exist!")

    const result = await EmailTemplate.findById(id)
        
    if(result?.creator === req.userId)
    {
        await EmailTemplate.findByIdAndRemove(id)
        const filename = `${id}.hbs`
    
        deleteFile(req.userId,filename)
          
        
        res.json({message: "Template deleted Successfully"})
    }
    else {
        return res.status(403).send("Unauthorized");
    }

}
