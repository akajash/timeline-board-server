import express from "express"
import { fetchSubscription, subscribe, verifySubscription } from "../controllers/subscription.js"
import auth from "../middleware/auth.js"




const router = express.Router()

router.post("/subscribe",auth,subscribe)
router.get("/get",fetchSubscription)
router.post("/verify",auth,verifySubscription)

// router.get("/details",deta)

export default router