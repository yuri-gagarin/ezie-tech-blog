import { BasicController } from "../_types/abstracts/DefaultController";
// models //
import Project from "../models/Project";
import Admin from "../models/Admin";
// types //
import type { Request, Response } from "express";
import type { ICRUDController } from "../_types/abstracts/DefaultController";
import type { ProjectQueryParams, ProjectData, ProjectIndexRes, ProjectGetOneRes, ProjectCreateRes, ProjectEditRes, ProjectDeleteRes, ProjectImgRes } from "../_types/projects/projectTypes";
import type { IAdmin } from "../models/Admin";
import type { IProject } from "../models/Project";
import type { IUser } from "../models/User";
// helpers //
import { normalizeProjectOpsData, validateProjectModelData } from "./_helpers/validationHelpers";
import { getBooleanFromString } from "./_helpers/generalHelpers";

export default class ProjectsController extends BasicController implements ICRUDController {
  index = async (req: Request, res: Response<ProjectIndexRes>): Promise<Response<ProjectIndexRes>> => {
    const { published, limit = "5" } = req.query as ProjectQueryParams;
    const user = req.user as IAdmin | IUser | null;
    //
    let projects: IProject[];
    try {
      if (published && this.verifyOwnerAdmin(user)) {
        // only owner level admins can see both published and unpublished projects //
        let publishedStatus: boolean = getBooleanFromString(published);
        projects = await Project.find({ published: publishedStatus }).limit(parseInt(limit)).exec();
      } else if (published && !this.verifyOwnerAdmin(user)) {
        return await this.notAllowedErrorResponse(res, [ "Insuficcient access level for this query" ]);
      } else {
        projects = await Project.find({ published: true }).limit(parseInt(limit)).exec();
      }
      return res.status(200).json({
        responseMsg: "Loaded Projects", projects
      });
    } catch (error) {
      return await this.generalErrorResponse(res, { error });
    }
  }
  getOne = async (req: Request, res: Response<ProjectGetOneRes>): Promise<Response<ProjectGetOneRes>> => {
    const { project_id } = req.params;
    const user = req.user as IAdmin | IUser | null;

    try {
      const project: IProject = await Project.findOne({ _id: project_id }).exec();
      if (project) {
       if (this.verifyProjectModelPermission(project, user)) {
         return res.status(200).json({ responseMsg: "Fetched project", project });
       } else {
         return await this.notAllowedErrorResponse(res, [ "Action not allowed for your access level" ]);
       }
      } else {
        return await this.notFoundErrorResponse(res, [ "Project was not found" ]);
      }
    } catch (error) {
      return await this.generalErrorResponse(res, { error });
    }
  }
  create = async (req: Request, res: Response<ProjectCreateRes>): Promise<Response<ProjectCreateRes>> => {
    const projectData = req.body.projectData as ProjectData;
    const user: IAdmin = req.user as IAdmin;
    // 
    if (!projectData) return await this.userInputErrorResponse(res, [ "Invalid user input to create a Project" ]);
    // have to validate valid project data //
    const { valid, errorMessages } = validateProjectModelData(projectData);
    if (!valid) return await this.userInputErrorResponse(res, errorMessages);
    //

    try {
      const { title, description, challenges, solution, languages = {}, libraries = {}, frameworks = {} } = projectData;
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
        editedAt: new Date()
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
    const user: IAdmin = req.user as IAdmin;
    const projectData = req.body.projectData as ProjectData;
    // validate correct input data //
    const { valid, errorMessages } = validateProjectModelData(projectData);
    if (!valid) return await this.userInputErrorResponse(res, errorMessages);
    //
    try {
      const { title, description, challenges, solution, languages = {}, libraries = {}, frameworks = {} } = projectData;
      const normalizedData = normalizeProjectOpsData({ languages, libraries, frameworks });
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

  private verifyOwnerAdmin = (user: IAdmin | IUser | null): boolean => {
    if (user) {
      return (user instanceof Admin && user.role === "owner");
    } else {
      return false;
    }
  }

  private verifyProjectModelPermission = (project: IProject, user: IAdmin | IUser | null): boolean => {
    return project.published ? true : this.verifyOwnerAdmin(user);
  }
};
