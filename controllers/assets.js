import Mongoose from "mongoose";
import Assets from "../models/assets.js";


export const fetchAssets = async(req,res) => {
    
    const userId = req.userId

    try{
        
        let query = Assets.find({user: userId})

        const page = parseInt(req.query.page) || 1;
        const pageSize = 10;
        const skip = (page - 1) * pageSize;
        const total = await Assets.countDocuments({user: userId});
        

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


export const createAsset = async(req,res) => {
    const asset = req.body

    const newAsset = new Assets({...asset, user: req.userId, createdAt: new Date().toISOString()})

    try{
        await newAsset.save()
        res.status(201).json(newAsset)
    }catch(error){
        res.status(409).json({message: error.message})
    }
}



export const updateAsset = async(req,res) => {

    const {id} = req.params
    const asset = req.body

    if(!Mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("Asset doesn't exist")

    const result = await Assets.findById(id)

    if(result?.user === req.userId){
        const updatedAsset = await Assets.findByIdAndUpdate(id, {...asset, id},{new: true})
        res.json(updatedAsset)
    }
    else{
        return res.status(403).send("Unauthorized");
    }
}

export const deleteAsset = async(req,res) => {
    const {id} = req.params

    if(!Mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("Asset doesn't exist!")

    const result = await Assets.findById(id)
        
    if(result?.user === req.userId)
    {
        await Assets.findByIdAndRemove(id)
        res.json({message: "Asset deleted Successfully"})
    }
    else {
        return res.status(403).send("Unauthorized");
    }

}

