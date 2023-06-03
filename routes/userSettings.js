import express from 'express'
import auth from '../middleware/auth.js'

import {getSettings, updateSettings} from "../controllers/userSettings.js"

const router = express.Router()

router.get("/settings",auth,getSettings)
router.patch("/settings/:userId",auth,updateSettings)


export default router