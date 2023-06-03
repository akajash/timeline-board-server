import express from 'express'

import auth from '../middleware/auth.js'

import {fetchProjectExpenses, createExpense, updateExpense, deleteExpense, fetchGeneralExpenses} from '../controllers/expense.js'

const router = express.Router()





router.get("/general",auth,fetchGeneralExpenses);
router.post("/create",auth,createExpense);
router.patch("/:id",auth,updateExpense);
router.delete("/:id",auth,deleteExpense);
router.get("/project/:order_id",auth,fetchProjectExpenses);

export default router;