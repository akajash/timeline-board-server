import express from 'express'

import auth from '../middleware/auth.js'

import {getSettings, updateSettings} from "../controllers/email_settings.js"

const router = express.Router()

router.get("/",auth,getSettings)
router.patch("/",auth,updateSettings)


export default router