import express from 'express'

import auth from '../middleware/auth.js'

import {fetchAll, createWorkflow, updateWorkflow, deleteWorkflow,fetchSingleWorkflow} from '../controllers/automation.js'

const router = express.Router()




router.get("/",auth,fetchAll);
router.post("/",auth,createWorkflow);
router.patch("/:id",auth,updateWorkflow);
router.delete("/:id",auth,deleteWorkflow);
router.get("/detail/:id",auth,fetchSingleWorkflow);



export default router;