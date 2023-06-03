import express from 'express'

import auth from '../middleware/auth.js'

import { fetchAssets, createAsset,updateAsset, deleteAsset } from '../controllers/assets.js';

const router = express.Router()

router.get("/",auth,fetchAssets);
router.post("/create",auth,createAsset);
router.patch("/update/:id",auth,updateAsset);
router.delete("/delete/:id",auth,deleteAsset);


export default router;