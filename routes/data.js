import express from 'express'

import auth from '../middleware/auth.js'

import { downloadExpenses, downloadProjects, downloadTasks, expensesByProject, tasksByProject } from '../controllers/dataManager.js';

const router = express.Router()



router.post("/projects",auth,downloadProjects);
router.post("/tasks",auth,downloadTasks);
router.post("/expenses",auth,downloadExpenses);
router.get("/task/:id",auth,tasksByProject);
router.get("/expense/:id",auth,expensesByProject);





export default router;