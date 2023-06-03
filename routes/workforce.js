import express from 'express'

import auth from '../middleware/auth.js'

import {getEmployees, createEmployee,updateEmployee,deleteEmployee,fetchAllEmployees} from "../controllers/workforce.js"

const router = express.Router()

router.get("/",auth,getEmployees)

router.get("/all",auth,fetchAllEmployees)

router.post("/",auth,createEmployee)

router.patch("/:id",auth,updateEmployee)

router.delete("/:id",auth,deleteEmployee)


export default router
