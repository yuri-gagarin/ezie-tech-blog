import Project from "../models/Project";
import { BasicController } from "../_types/abstracts/DefaultController";
// types //
import type { Request, Response } from "express";
import type { ICRUDController } from "../_types/abstracts/DefaultController";
import type { ProjectData, ProjectIndexRes, ProjectGetOneRes, ProjectCreateRes, ProjectEditRes, ProjectDeleteRes, ProjectImgRes } from "../_types/projects/projectTypes";
import type { IProject } from "../models/Project";
import { IAdmin } from "../models/Admin";
import { normalizeProjectOpsData, validateProjectModelData } from "./_helpers/validationHelpers";

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

    if (!user) return await this.notFoundErrorResponse(res, [ "Could not resolve user account" ]);
    // have to validate valid project data //
    const { valid, errorMessages } = validateProjectModelData({ title, description, challenges, solution });
    if (!valid) return await this.userInputErrorResponse(res, errorMessages);
    try {
      const normalizedData = normalizeProjectOpsData({ languages, libraries, frameworks });
      const createdProject: IProject = await Project.create({
        creator: user._id,
        title, description, challenges, solution, 
        languages: normalizedData.languages, 
        libraries: normalizedData.libraries,
        frameworks: normalizedData.frameworks,
        images: [],
        published: false,
        createdAt: new Date(),
        editedAd: new Date()
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
    
    if (!user) return await this.notAllowedErrorResponse(res, [ "Could not resolve user account" ]);
    if (!project_id) return await this.userInputErrorResponse(res, [ "Could not resolve user id" ]);
    // validate correct input data //
    const { valid, errorMessages } = validateProjectModelData({ title, description, challenges, solution });
    if (!valid) return await this.userInputErrorResponse(res, errorMessages);

    try {
      console.log(req.body.projectData);
      const normalizedData = normalizeProjectOpsData({ languages, libraries, frameworks });
      console.log(normalizedData);
      const editedProject: IProject | null = await Project.findOneAndUpdate(
        { _id: project_id },
        { title, description, challenges, solution, 
          languages: normalizedData.languages, 
          libraries: normalizedData.libraries, 
          frameworks: normalizedData.frameworks, 
          editedAd: new Date() },
        { new: true }
      ).exec();
      if (editedProject) {
        return res.status(200).json({ responseMsg: "Project info updated", editedProject })
      } else {
        return await this.notFoundErrorResponse(res, [ "Queried project to update was not found" ]);
      }
    } catch (error) {
      console.log(error)
      return await this.generalErrorResponse(res, { error });
    }

  }
  delete = async (req: Request, res: Response<ProjectDeleteRes>): Promise<Response<ProjectDeleteRes>> => {
    const { project_id } = req.params;
    const user: IAdmin = req.user as IAdmin;
    
    if (!user) return await this.notAllowedErrorResponse(res, [ "Could not resolve user accont" ]);
    if (!project_id) return await this.userInputErrorResponse(res, [ "Could not resolve project to delete" ]);

    try {
      const deletedProject: IProject | null  = await Project.findOneAndDelete({ _id: project_id }).exec();
      if (deletedProject) {
        return res.status(200).json({
          responseMsg: "Project deleted", deletedProject
        });
      } else {
        return await this.notFoundErrorResponse(res, [ "Project to delete was not found" ]);
      }
    } catch (error) {
      return await this.generalErrorResponse(res, { error });
    } 
  }

  uploadImage = async (req: Request, res: Response<ProjectImgRes>): Promise<Response<ProjectImgRes>> => {
    const { project_id } = req.params;
    const { imageURL } = req.body;

    const user: IAdmin = req.user as IAdmin;
    if (!user) return await this.notAllowedErrorResponse(res, [ "Could not resolve user accont" ]);
    if (!imageURL || !project_id) return await this.userInputErrorResponse(res, [ "Could not resolve project to delete" ]);
    
    try {
      const updatedProject: IProject | null = await Project.findOneAndUpdate({ _id: project_id }, { $push: { images: imageURL as string } }, { new: true }).exec()
      if (updatedProject) {
        return res.status(200).json({
          responseMsg: "Project updated", updatedProject
        });
      } else {
        return await this.notFoundErrorResponse(res, [ "Project to update was not found" ]);
      }
    } catch (error) {
      console.log(error);
      return await this.generalErrorResponse(res, { error });
    } 
  }

  removeImage = async (req: Request, res: Response<ProjectImgRes>): Promise<Response<ProjectImgRes>> => {
    const { project_id } = req.params;
    const { imageURL } = req.body;
    const user: IAdmin = req.user as IAdmin;

    if (!user) return await this.notAllowedErrorResponse(res, [ "Could not resolve user accont" ]);
    if (!imageURL || !project_id) return await this.userInputErrorResponse(res, [ "Could not resolve project to delete" ]);

    try {
      const updatedProject: IProject | null = await Project.findOneAndUpdate({ _id: project_id }, { $pull: { images: imageURL as string } }, { new: true }).exec()
      if (updatedProject) {
        return res.status(200).json({
          responseMsg: "Project updated", updatedProject
        });
      } else {
        return await this.notFoundErrorResponse(res, [ "Project to update was not found" ]);
      }
    } catch (error) {
      return await this.generalErrorResponse(res, { error });
    } 
  }
};
