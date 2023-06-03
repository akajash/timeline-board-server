import Mongoose from 'mongoose';
import Reference from '../models/reference.js'
import ErrorResponse from './customError.js'

export const fetchReferences = async(req,res) => {

    const userId = req.userId

    try{
        
        let query = Reference.find({user: userId}).sort({count: -1})

        const page = parseInt(req.query.page) || 1;
        const pageSize = 5;
        const skip = (page - 1) * pageSize;
        const total = await Reference.countDocuments({user: userId});
        

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

export const fetchAllReferences = async(req,res) => {
    try{
        const data = await Reference.find({user: req.userId})
        res.status(200).json(data);

    }catch(error){
        res.status(404).json({message: error.message})
    }
}

export const createReference = async(req,res) => {
    
    const reference = req.body;
    const newReference = new Reference({...reference, user: req.userId, createdAt: new Date().toISOString()})

    try{
        await newReference.save()
        res.status(201).json(newReference)
        return next(new ErrorResponse("Referral created successfully",201))
    }
    catch(error){
        res.status(409).json({message: error.message})
    }
}

export const updateReference = async(req,res) => {
    const reference = req.body
    const {id} = req.params

    if(!Mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("Reference doesn't exist!")

    const result = await Reference.findById(id)
    
    if(result?.user === req.userId)
    {
        const updatedReference = await Reference.findByIdAndUpdate(id,{...reference, id},{new: true})
        res.json(updatedReference)
    }
    else {
        return res.status(403).send("Unauthorized");
    }
    
}

export const deleteReference = async(req,res) => {

    const {id} = req.params

    if(!Mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("Reference doesn't exist!")

    const result = await Reference.findById(id)
        
    if(result?.user === req.userId)
    {
        await Reference.findByIdAndRemove(id)
        res.json({message: "Reference deleted Successfully"})
    }
    else {
        return res.status(403).send("Unauthorized");
    }

}