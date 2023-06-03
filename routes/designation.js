import express from 'express'

import auth from '../middleware/auth.js'

import { fetchAll,createDesignation, deleteDesignation, updateDesignation, fetchDesignationDD } from '../controllers/designation.js';

const router = express.Router()

router.get("/",auth,fetchAll);
router.get("/all",auth,fetchDesignationDD);
router.post("/create",auth,createDesignation);
router.patch("/update/:id",auth,updateDesignation);
router.delete("/delete/:id",auth,deleteDesignation);


export default router;