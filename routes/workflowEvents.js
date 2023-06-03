import express from 'express'

import auth from '../middleware/auth.js'

import {getEvents} from "../controllers/workflowEvents.js"

const router = express.Router()

router.get("/",auth,getEvents)


export default router