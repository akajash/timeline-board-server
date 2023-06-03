import Mongoose from 'mongoose';
import PostMessage from '../models/postMessage.js'

export const getPosts = async (req,res) => {
    try{
        const postMessages = await PostMessage.find()
        

        res.status(200).json(postMessages);

    }catch(error){
        res.status(404).json({message: error.message})
    }
}

export const createPost = async (req,res) => {
    
    const post = req.body;
    const newPost = new PostMessage({...post, creator: req.userId, createdAt: new Date().toISOString()})

    try{
        await newPost.save();
        res.status(201).json(newPost)

    }catch(error){
        res.status(409).json({message: error.message})
    }
}


export const updatePost = async (req,res) => {
    const {id : _id} = req.params
    const post = req.body

    if(!Mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send("No Post with that Id");

    const updatedPost = await PostMessage.findByIdAndUpdate(_id, {...post, _id}, {new: true})
    res.json(updatedPost)

}

export const deletePost = async (req,res) => {
    const {id} = req.params

    if(!Mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No Post with that Id");

    await PostMessage.findByIdAndRemove(id)
    res.json({message: 'Post deleted successfully'})

}

export const likePost = async (req,res) => {
    const {id} = req.params;

    console.log(res.userId)

    if(!req.userId) return res.status(403).json({message: "Unauthorized"})

    if(!Mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No post with the Id available");

    const post = await PostMessage.findById(id);

    const index = post.likes.findIndex((id) => id === String(req.userId))

    if(index === -1){
        post.likes.push(req.userId);
    }
    else{
        post.likes = post.likes.filter((id) => id !== String(req.userId));
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {new: true})

    res.json(updatedPost)
}