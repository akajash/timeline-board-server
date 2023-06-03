import express from 'express'

import {resetPassword, forgotPassword, signin, signup} from "../controllers/user.js"

const router = express.Router()

router.post('/signin', signin)
router.post('/signup',signup)
router.post('/forgot-password',forgotPassword)
router.put("/reset-password/:resetToken",resetPassword)

export default router