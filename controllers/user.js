import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import sendEmail from './mail.js'
import ErrorResponse from './customError.js'
import EmailSettings from '../models/emailSettings.js'
import Analytics from '../models/analytics.js'
import Subscription from '../models/subscription.js'
import Designation from '../models/designation.js'
import Reference from '../models/reference.js'


export const signin = async (req,res,next) => {
    const {email,password} = req.body
    const today = new Date()

    try{
        const existingUser = await User.findOne({email});

        if(!existingUser){
            return next(new ErrorResponse("User doesn't exist!",404))
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if(!isPasswordCorrect){
            return next(new ErrorResponse("Invalid Credentials!",400))
        } 

        const isSubscribed = await Subscription.findOne({user: existingUser._id})

        if(isSubscribed.expiry_date >= today){
            const token = jwt.sign({email: existingUser.email, id: existingUser._id}, 'test', {expiresIn: '12h'})
            console.log("real")
            res.status(200).json({ result: existingUser, token, subscribed: true})
        }
        else{
            const token = jwt.sign({email: existingUser.email, id: existingUser._id}, 'test', {expiresIn: '10m'})
            console.log("fake")
            res.status(200).json({ result: existingUser, token, subscribed: false})
            
        }

        

    } catch(error){
        res.status(500).json({
            message: "Something went wrong"
        })
    }

}   

export const signup = async (req,res,next) => {
    const {email, password, confirmPassword, firstName, lastName,country,currency} = req.body
    console.log("signing up")

    try {
        const existingUser = await User.findOne({ email })

        if(existingUser){
            return next(new ErrorResponse("User already exists!",400)) 
        } 

        if(password !== confirmPassword){
            return next(new ErrorResponse("Password and confim Password doesn't match",400))
        } 

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await User.create({email, password: hashedPassword, name : `${firstName} ${lastName}`,country,currency });
        await EmailSettings.create({user: result._id})
        await Analytics.create({creator: result._id})
        await Subscription.create({user: result._id})

        const newReference = new Reference({reference_name: "Instagram", user: result._id, createdAt: new Date().toISOString()})
        await newReference.save()
        
        const newDesignation = new Designation({title: "Photographer", creator: result._id})
        await newDesignation.save()
        
        const token = jwt.sign({ email: result.email, id: result._id}, 'test', {expiresIn: "12h"})

        res.status(200).json({result, token})
    }catch(error){
        res.status(500).json({
            message: "Something went wrong"
        })
    }

}


export const forgotPassword = async(req,res,next) => {
    const {email} = req.body

    try{
        const user = await User.findOne({email});

        if(!user){
            return next(new ErrorResponse("There is no account associated with the registered mail.",404))
        }

        const resetToken = user.getResetPasswordToken()

        await user.save(); 

        const resetUrl = `http://studio.timelinesuite.com/auth/reset-password/${resetToken}`

        const message = `
            <h1>You have requested a password reset</h1>
            <p>Please click the link below to reset your password:</p>
            <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
        `

        try {
            await sendEmail({
                to: user.email,
                subject: "Password Reset", 
                text: message
            })

            res.status(200).json({success: true, data: "Check your inbox"})

        } catch(error){
            user.resetPasswordToken = undefined
            user.resetPasswordExpire = undefined

            await user.save()

            return next(new ErrorResponse("Email couldn't be sent",500))
        }

    }catch(error){
        next(error)
    }
}

export const resetPassword = async(req,res,next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex")
    
    try{
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: {$gt: Date.now()}
        })

        if(!user){
            return next(new ErrorResponse("Invalid Reset Token",400))
        }

        user.password = await bcrypt.hash(req.body.password, 12);
        
        user.resetPasswordToken=undefined
        user.resetPasswordExpire=undefined

        
        await user.save()

        res.status(201).json({
            success: true,
            data: "Password resetted successfully"
        })

    }catch(error){
        next(error)
    }
} 


export const getUsers = async(req,res) => {


    try{
        
        let users = await User.find()
        
        res.status(200).json(users)

    }catch(error){
        res.status(404).json({message: error.message});
    }
}


export const manualSub = async(req,res) => {
    const body = req.body
    try{
    Date.prototype.addDays = function (days) {
        let date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
        }
    let date = new Date();
    const updatedSub = await Subscription.findOneAndUpdate({user: body.user},{currentPlan : 0,expiry_date: date.addDays(30)})
    console.log(updatedSub)
    res.status(200).json(updatedSub)
    }
    catch(error){
        res.status(404).json({message: error.message});
    }
}

