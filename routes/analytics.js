import { dashboardData, profileData, updateProfile } from "../controllers/analytics.js"
import auth from '../middleware/auth.js'
import express from "express"

const router = express.Router()

router.get("/",auth,dashboardData)
router.get("/profile",auth,profileData)
router.post("/profile/update",auth,updateProfile)



export default router