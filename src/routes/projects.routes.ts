import { Router } from "express";
import {
  getProjectsByAuthor,
  createNewProject,
  getProject,
  updateProject,
  deleteProject,
  createContributor,
  deleteContributor,
  // getTasks,
} from "../controllers";
import { isAuth } from "../middlewares";

const router = Router();
// GET /projects
router.get("/", isAuth, getProjectsByAuthor);
// POST /projects
router.post("/", isAuth, createNewProject);

router.get("/:id", isAuth, getProject);
router.put("/:id", isAuth, updateProject);
router.delete("/:id", isAuth, deleteProject);

// router.get("/tasks/:id", isAuth, getTasks);
router.post("/add-contributor/:id", isAuth, createContributor);
router.delete("/delete-contributor/:id", isAuth, deleteContributor);

export default router;
