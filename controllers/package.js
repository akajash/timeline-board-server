
import Mongoose from 'mongoose';
import Package from '../models/package.js'

export const fetchPackages = async(req,res) => {

    const userId = req.userId

    try{
        
        let query = Package.find({user: userId})

        const page = parseInt(req.query.page) || 1;
        const pageSize = 10;
        const skip = (page - 1) * pageSize;
        const total = await Package.countDocuments({user: userId});
        

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

export const fetchAllPackages = async(req,res) => {
    try{
        const data = await Package.find({user: req.userId})
        res.status(200).json(data);

    }catch(error){
        res.status(404).json({message: error.message})
    }
}

export const createPackage = async(req,res) => {
    
    const pack = req.body;
    const newPackage = new Package({...pack, user: req.userId, createdAt: new Date().toISOString()})

    try{
        await newPackage.save()
        res.status(201).json(newPackage)
    }
    catch(error){
        res.status(409).json({message: error.message})
    }
}

export const updatePackage = async(req,res) => {
    const pack = req.body
    const {id} = req.params

    if(!Mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("Package doesn't exist!")

    const result = await Package.findById(id)

    if(result?.user == req.userId)
    {
        const updatedPackage = await Package.findByIdAndUpdate(id,{...pack, id},{new: true})
        res.json(updatedPackage)
    }
    else {
        return res.status(403).send("Unauthorized");
    }
    
}

export const deletePackage = async(req,res) => {

    const {id} = req.params

    if(!Mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("Project doesn't exist!")

    const result = await Package.findById(id)
        
    if(result?.user == req.userId)
    {
        await Package.findByIdAndRemove(id)
        res.json({message: "Package deleted Successfully"})
    }
    else {
        return res.status(403).send("Unauthorized");
    }

}