import { Router } from "express";
import { isAuth } from "../middlewares";
import {
  createTask,
  getTask,
  updateTask,
  deleteTask,
  updateTaskState,
} from "./../controllers";

const router = Router();

router.post("/", isAuth, createTask);

router.get("/:id", isAuth, getTask);
router.put("/:id", isAuth, updateTask);
router.delete("/:id", isAuth, deleteTask);

router.post("/state/:id", isAuth, updateTaskState);

export default router;
