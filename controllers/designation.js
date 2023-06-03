import Mongoose from 'mongoose';
import Designation from '../models/designation.js'

export const fetchAll = async(req,res) => {

    const userId = req.userId

    try{
        
        let query = Designation.find({creator: userId})

        const page = parseInt(req.query.page) || 1;
        const pageSize = 10;
        const skip = (page - 1) * pageSize;
        const total = await Designation.countDocuments({creator: userId});
        

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

export const fetchDesignationDD = async(req,res) => {
    try{
        const data = await Designation.find({creator: req.userId})
        res.status(200).json(data);

    }catch(error){
        res.status(404).json({message: error.message})
    }
}

export const createDesignation = async(req,res) => {
    
    const designation = req.body;
    const newDesignation = new Designation({...designation, creator: req.userId})

    try{
        await newDesignation.save()
        res.status(201).json(newDesignation)
    }
    catch(error){
        res.status(409).json({message: error.message})
    }
}

export const updateDesignation = async(req,res) => {
    const designation = req.body
    const {id} = req.params

    if(!Mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("Designation doesn't exist!")

    const result = await Designation.findById(id)

    if(result?.creator === req.userId)
    {
        const updatedDesignation = await Designation.findByIdAndUpdate(id,{...designation, id},{new: true})
        res.json(updatedDesignation)
    }
    else {
        return res.status(403).send("Unauthorized");
    }
    
}

export const deleteDesignation = async(req,res) => {

    const {id} = req.params

    if(!Mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("Designation doesn't exist!")

    const result = await Designation.findById(id)
        
    if(result?.creator === req.userId)
    {
        await Designation.findByIdAndRemove(id)
        res.json({message: "Designation deleted Successfully"})
    }
    else {
        return res.status(403).send("Unauthorized");
    }

}