import express from 'express'

import auth from '../middleware/auth.js'

import { fetchPackages, fetchAllPackages, createPackage, updatePackage, deletePackage } from '../controllers/package.js';

const router = express.Router()

router.get("/",auth,fetchPackages);
router.get("/all",auth,fetchAllPackages);
router.post("/create",auth,createPackage);
router.patch("/update/:id",auth,updatePackage);
router.delete("/delete/:id",auth,deletePackage);


export default router;