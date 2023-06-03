import express from 'express'

import auth from '../middleware/auth.js'

import { fetchAll,createTax, deleteTax, updateTax } from '../controllers/tax.js';

const router = express.Router()

router.get("/",auth,fetchAll);
router.post("/create",auth,createTax);
router.patch("/update/:id",auth,updateTax);
router.delete("/delete/:id",auth,deleteTax);


export default router;