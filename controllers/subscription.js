import shortid from "shortid";
import Subscription from "../models/subscription.js";
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
    key_id: 'rzp_live_Kh5siGVFciiGl3',
    key_secret: '8bLCA036RKUBPx7Re3kjeaXC'
})



export const subscribe = async(req,res) => {


    const amount = 1199
    const currency = "INR"
    const payment_capture = 1

    const options = {
        amount: (amount * 100),
        currency: currency,
        receipt: shortid.generate(),
        payment_capture
    }
    try{
        const response = await razorpay.orders.create(options)
        res.json({
            id: response.id,
            currency: response.currency,
            amount: response.amount
    })
    }catch(error){
        console.log(error)
    }
    

}

export const verifySubscription = async(req,res) => {
    var success = false;
    await razorpay.payments.fetch(req.body.razorpay_payment_id).then((document) => {

        console.log(document)

        if(document.status == "captured"){
            success = true;
            // const today = new Date()
            
              
            // const newSubscription = {
            //     currentPlan : 0,
            //     expiry_date: date.addDays(30)
            // }

            // console.log(newSubscription.expiry_date)
            // console.log(req.userId)          

            // await Subscription.findByIdAndUpdate({user: req.userId},,{new: true})
            // try{
            // // const updatedSub = Subscription.findOneAndUpdate({user:req.userId},{currentPlan : 0,expiry_date: date.addDays(30)},{new:true})
            // const subID = Subscription.findOne({user: req.userId})
            // const updatedSub = Subscription.findByIdAndUpdate(subID,{...newSubscription,subID},{new: true})
            // console.log(updatedSub)
            
            
            // res.status(200)
            // }
            // catch(error){
            //     console.log(error)
            // }
            // const subID = await Subscription.findOne({user: req.userId})

        }
        else{
            success = false;
            
        }
    })
    try{
        if(success == true){
            Date.prototype.addDays = function (days) {
                let date = new Date(this.valueOf());
                date.setDate(date.getDate() + days);
                return date;
              }
            let date = new Date();
            const updatedSub = await Subscription.findOneAndUpdate({user:req.userId},{currentPlan : 0,expiry_date: date.addDays(30)})
            res.send(success)
        }
        else{
            console.log("success is false")
            res.send(success)
        }
        
    }
    catch(error){
        console.log(error)
    }
}


export const fetchSubscription = async(req,res) => {
    

        
        
    
        try{
        
        // Subscription.findByIdAndUpdate(data._id,{...newSubscription},{new:true})
        const data = await Subscription.findOne({user: req.userId})
        console.log(data)
        
        res.send(200)
    }
    catch(error){
        console.log(error)
    }
}