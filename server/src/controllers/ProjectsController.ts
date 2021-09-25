import Project from "../models/Project";
import { BasicController } from "../_types/abstracts/DefaultController";
// types //
import type { Request, Response } from "express";
import type { ICRUDController } from "../_types/abstracts/DefaultController";
import type { ProjectData, ProjectIndexRes, ProjectGetOneRes, ProjectCreateRes, ProjectEditRes, ProjectDeleteRes } from "../_types/projects/projectTypes";
import type { IProject } from "../models/Project";
import { IAdmin } from "../models/Admin";

export default class ProjectsController extends BasicController implements ICRUDController {
  index = async (req: Request, res: Response<ProjectIndexRes>): Promise<Response<ProjectIndexRes>> => {
    try {
      const projects: IProject[] = await Project.find({}).exec();
      return res.status(200).json({
        responseMsg: "Loaded Projects", projects
      });
    } catch (error) {
      return await this.generalErrorResponse(res, { error });
    }
  }
  getOne = async (req: Request, res: Response<ProjectGetOneRes>): Promise<Response<ProjectGetOneRes>> => {
    const { project_id } = req.params;
    if (!project_id) return this.userInputErrorResponse(res, [ "Could not resolve project id" ]);

    try {
      const project: IProject = await Project.findOne({ _id: project_id }).exec();
      if (project) {
        return res.status(200).json({
          responseMsg: "Retrieved project", project
        });
      } else {
        return await this.notFoundErrorResponse(res, [ "Project was not found" ]);
      }
    } catch (error) {
      return await this.generalErrorResponse(res, { error });
    }
  }
  create = async (req: Request, res: Response<ProjectCreateRes>): Promise<Response<ProjectCreateRes>> => {
    const { title, description, challenges, solution, languages = {},  libraries = {}, frameworks = {} } = req.body.projectData as ProjectData;
    const user: IAdmin = req.user as IAdmin;

    // have to validate valid project data //
    try {
      const createdProject: IProject = await Project.create({
        creator: user._id,
        title, description, challenges, solution, 
        languages: { ...languages }, 
        libraries: { ...libraries },
        frameworks: { ...frameworks },
        createdAt: Date.now(),
        editedAd: Date.now()
      });
      return res.status(200).json({
        responseMsg: "Project created", createdProject
      });
    } catch (error) {
      return await this.generalErrorResponse(res, { error });
    }
  }
  edit = async (req: Request, res: Response<ProjectEditRes>): Promise<Response<ProjectEditRes>> => {
    const { project_id } = req.params;
    const { title, description, challenges, solution, languages = {},  libraries = {}, frameworks = {} } = req.body.projectData as ProjectData;
    const user: IAdmin = req.user as IAdmin;

    if (project_id) return await this.userInputErrorResponse(res, [ "Could not resolve user id" ]);
  }
  delete = async(request: Request, response: Response): Promise<Response> => {

  }
}