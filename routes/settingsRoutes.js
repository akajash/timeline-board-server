import express from 'express'
import {AutoMailer} from "../controllers/mailByTemplate.js"
const router = express.Router()


router.get("/",AutoMailer)

export default router