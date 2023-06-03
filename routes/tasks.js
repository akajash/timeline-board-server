import express from "express"
import auth from "../middleware/auth.js"

import {fetchAllTasks, fetchTasksByWorkforce, createTask, updateTask, deleteTask, taskProgress} from "../controllers/tasks.js"


const router = express.Router()

router.get("/:id",auth,fetchAllTasks)
router.get("/user/:wfid",auth,fetchTasksByWorkforce)
router.post("/create",auth, createTask);
router.patch("/update/:id",auth,updateTask);
router.delete("/delete/:id",auth,deleteTask);
router.get("/progress/:id",auth,taskProgress);



export default router;