import express from 'express'

import auth from '../middleware/auth.js'

import { fetchReferences, createReference, deleteReference, updateReference, fetchAllReferences } from '../controllers/reference.js';

const router = express.Router()

router.get("/",auth,fetchReferences);
router.get("/all",auth,fetchAllReferences)
router.post("/create",auth,createReference);
router.patch("/update/:id",auth,updateReference);
router.delete("/delete/:id",auth,deleteReference);


export default router;