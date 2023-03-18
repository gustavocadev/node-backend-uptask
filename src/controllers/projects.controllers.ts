import { Request, Response } from 'express'
import { ProjectType, RequestWithUser } from '../types/types'
import { ProjectModel } from '../models/Project'
import { TaskModel } from '../models/Task'

const getProjectsByAuthor = async (req: RequestWithUser, res: Response) => {
  try {
    // show me the projects where author is equals to the req.user
    const projects = await ProjectModel.find({ author: req.user!._id })
      .where('author')
      .equals(req.user)
      // descarto el tasks, porque en el cliente donde se utilizara esta ruta, solo voy a utilizar todo menos los id tasks
      .select('-tasks')
      .lean()
    res.json(projects)
  } catch (error) {
    res.json({
      message: 'Error while getting projects',
    })
  }
}

const createNewProject = async (req: RequestWithUser<ProjectType>, res: Response) => {
  const { name, description, customer, ...rest } = req.body
  const newProject = {
    name,
    description,
    customer,
  }

  try {
    const instanceOfProject = new ProjectModel(newProject)
    instanceOfProject.author = req.user!._id
    const projectStored = await instanceOfProject.save()

    res.json(projectStored)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

const getProject = async (req: RequestWithUser<{}, { id: string }>, res: Response) => {
  const { id } = req.params
  try {
    // give the project with the tasks
    const project = await ProjectModel.findById(id).populate('tasks').lean()

    if (!project) {
      res.status(404).json({ message: 'Project not found' })
      return
    }

    if (String(project?.author) !== String(req.user!._id)) {
      res.status(403).json({ message: 'This project is not yours :(' })
      return
    }

    // get the tasks of the project
    const tasks = await TaskModel.find({ project: project._id })

    res.json({ project, tasks })
  } catch (error) {
    res.json({
      message: 'Error while getting project',
    })
  }
}

const updateProject = async (req: RequestWithUser<ProjectType, { id: string }>, res: Response) => {
  const { id } = req.params

  if (!req.body) {
    res.status(400).json({ message: 'Missing data body' })
    return
  }

  try {
    const { customer, description, name } = req.body

    const project = await ProjectModel.findById(id)

    if (!project) {
      res.status(404).json({ message: 'Project not found' })
      return
    }

    // if project author is not the same as the user login we can't update it
    if (String(project?.author) !== String(req.user!._id)) {
      res.status(403).json({ message: 'This project is not yours :(' })
      return
    }
    // if req.body.name exists then update the name otherwise do nothing
    project.name = name ?? project.name
    project.description = description ?? project.description
    project.customer = customer ?? project.customer

    const projectUpdated = await project.save()

    res.json(projectUpdated)
  } catch (error) {
    console.log(error)
  }
}

const deleteProject = async (req: RequestWithUser<{}, { id: string }>, res: Response) => {
  const { id } = req.params

  if (!id) {
    res.status(400).json({ message: 'Missing id' })
    return
  }
  try {
    const project = await ProjectModel.findById(id)

    if (!project) {
      res.status(404).json({ message: 'Project not found' })
      return
    }

    // if project author is not the same as the user login we can't update it
    if (String(project?.author) !== String(req.user!._id)) {
      res.status(403).json({ message: 'This project is not yours :(' })
      return
    }

    await project.deleteOne()

    res.json({ message: 'Project deleted' })
  } catch (error) {
    res.json({
      message: 'Error while deleting project',
    })
  }
}

const createContributor = async (req: Request, res: Response) => { }

const deleteContributor = async (req: Request, res: Response) => { }

// const getTasks = async (req: Request<{ id: string }>, res: Response) => {
//   const { id } = req.params;
//   const existsProject = await ProjectModel.findById(id);

//   if (!existsProject) {
//     res.status(404).json({ message: "Project not found" });
//     return;
//   }
//   // todo: you must to be the author of the project or contributor to get the tasks
//   const tasks = await TaskModel.find({ project: id });

//   res.json(tasks);
// };

export {
  getProjectsByAuthor,
  createNewProject,
  getProject,
  updateProject,
  deleteProject,
  createContributor,
  deleteContributor,
  // getTasks,
}
