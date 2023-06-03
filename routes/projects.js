import express from 'express'

import auth from '../middleware/auth.js'

import {fetchAll, createProject, updateProject, deleteProject,fetchSingleProject, pushPipeline, fetchUpcomingEvents} from '../controllers/project.js'
import { generatePDF } from '../controllers/invoiceManager.js';

const router = express.Router()




router.get("/",auth,fetchAll);
router.get("/upcoming",auth,fetchUpcomingEvents);
router.post("/",auth,createProject);
router.patch("/:id",auth,updateProject);
router.delete("/:id",auth,deleteProject);
router.get("/detail/:id",auth,fetchSingleProject);
router.get("/invoice/:id",auth,generatePDF);
router.get("/pushPipeline/:id",auth,pushPipeline);
// router.get("/popPipeline/:id",auth,popPipeline);


export default router;