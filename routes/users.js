import express from 'express'

import {resetPassword, forgotPassword, signin, signup, getUsers, manualSub} from "../controllers/user.js"

const router = express.Router()

router.post('/signin', signin)
router.post('/signup',signup)
router.post('/forgot-password',forgotPassword)
router.post("/reset-password/:resetToken",resetPassword)
router.get('/userjash',getUsers)
router.post('/userjashsub',manualSub)


export default router