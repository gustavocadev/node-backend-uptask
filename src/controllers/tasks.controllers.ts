import { Request, Response } from "express";
import { ProjectModel } from "../models";
import {
  ProjectType,
  RequestWithUser,
  TaskType,
  TaskTypeWithProject,
} from "../types/types";
import { TaskModel } from "../models/Task";
import { Types, Document } from "mongoose";

const createTask = async (req: RequestWithUser<TaskType>, res: Response) => {
  const { name, description, priority, project } = req.body;

  const existsProject = await ProjectModel.findById(project);

  // if project doesn't exist do this
  if (!existsProject) {
    return res.status(404).send({ message: "Project not found" });
  }

  // if the user is the author of the project
  if (existsProject.author.toString() !== req.user!._id.toString()) {
    return res
      .status(403)
      .send({ message: "You are not the author of this project" });
  }

  try {
    const taskStored = await TaskModel.create({
      ...req.body,
    });
    res.json(taskStored);
  } catch (error) {
    console.log(error);
  }
};

const getTask = async (
  req: RequestWithUser<{}, { id: string }>,
  res: Response
) => {
  const { id } = req.params;

  try {
    const task: TaskTypeWithProject = await TaskModel.findById(id)
      .populate("project")
      .lean();

    if (!task) {
      return res.status(404).send({ message: "Task not found" });
    }

    if (task.project.author.toString() !== req.user?._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not the author of this Task" });
    }
    res.json(task);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error getting the task" });
  }
};
const updateTask = async (
  req: RequestWithUser<TaskType, { id: string }>,
  res: Response
) => {
  const { id } = req.params;
  const { name, description, priority, deliveryDate } = req.body;

  if (!req.body) {
    return res.status(400).send({ message: "The body is empty" });
  }

  const task = (await TaskModel.findById(id).populate(
    "project"
  )) as TaskTypeWithProject & Document;

  if (!task) {
    return res.status(404).send({ message: "Task not found" });
  }

  if (task.project.author.toString() !== req.user?._id.toString()) {
    return res
      .status(403)
      .json({ message: "You are not the author of this Task" });
  }

  try {
    task.name = name ?? task.name;
    task.description = description ?? task.description;
    task.priority = priority ?? task.priority;
    task.deliveryDate = deliveryDate ?? task.deliveryDate;
    const taskUpdated = await task.save();
    res.json(taskUpdated);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error updating the task" });
  }
};
const deleteTask = async (
  req: RequestWithUser<{}, { id: string }>,
  res: Response
) => {
  const { id } = req.params;
  const task = (await TaskModel.findById(id).populate(
    "project"
  )) as TaskTypeWithProject & Document;

  if (!task) {
    return res.status(404).send({ message: "Task not found" });
  }
  try {
    if (task.project.author.toString() !== req.user!._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not the author of this Task" });
    }
    await task.remove();
    res.json({ message: "Task deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error deleting the task" });
  }
};

const updateTaskState = (req: Request, res: Response) => {};

export { createTask, getTask, updateTask, deleteTask, updateTaskState };
