import Mongoose from 'mongoose';
import Tax from '../models/tax.js'

export const fetchAll = async(req,res) => {

    const userId = req.userId

    try{
        
        let query = Tax.find({creator: userId})

        const page = parseInt(req.query.page) || 1;
        const pageSize = 5;
        const skip = (page - 1) * pageSize;
        const total = await Tax.countDocuments({creator: userId});
        

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

export const createTax = async(req,res) => {
    
    const tax = req.body;
    const newTax = new Tax({...tax, creator: req.userId})

    try{
        await newTax.save()
        res.status(201).json(newTax)
    }
    catch(error){
        res.status(409).json({message: error.message})
    }
}

export const updateTax = async(req,res) => {
    const tax = req.body
    const {id} = req.params

    if(!Mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("Tax doesn't exist!")

    const result = await Tax.findById(id)

    if(result?.creator === req.userId)
    {
        const updatedTax = await Tax.findByIdAndUpdate(id,{...tax, id},{new: true})
        res.json(updatedTax)
    }
    else {
        return res.status(403).send("Unauthorized");
    }
    
}

export const deleteTax = async(req,res) => {

    const {id} = req.params

    if(!Mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("Tax doesn't exist!")

    const result = await Tax.findById(id)
        
    if(result?.creator === req.userId)
    {
        await Tax.findByIdAndRemove(id)
        res.json({message: "Tax deleted Successfully"})
    }
    else {
        return res.status(403).send("Unauthorized");
    }

}