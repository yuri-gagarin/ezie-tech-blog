import axios, { AxiosResponse } from "axios";
import { IGeneralCRUDActions } from "../_types/_general/abstracts";
// types //
import type { AxiosRequestConfig } from "axios";
import type { 
  CreateProject, EditProject, DeleteProject, GetAllProjects, GetOneProject, 
  UploadProjectImage, DeleteProjectImage, SetProjectError, ClearProject, SetProject 
} from "../_types/projects/actionTypes";
import type { 
  GetAllProjParams, GetOneProjParams, CreateProjParams, EditProjParams, DeleteProjParams, ProjErrorParams, SetProjParams, ClearProjParams,
  IndexProjectRes, OneProjectRes, CreateProjectRes, EditProjectRes, DeleteProjectRes, UploadProjImgRes, ProjectData, UploadImageParams, RemoveImageParams
} from "../_types/projects/dataTypes";
// helpers //
import { processAxiosError } from "../_helpers/dataHelpers";

class ProjectReduxActions extends IGeneralCRUDActions {
  async handleGetAll({ dispatch, opts }: GetAllProjParams): Promise<GetAllProjects | SetProjectError>  {
    const reqConfig: AxiosRequestConfig = {
      method: "GET",
      url: "/api/projects",
      params: opts
    };

    dispatch({ type: "ProjectsAPIRequest", payload: { loading: true } });
    try {
      const { status, data }: AxiosResponse<IndexProjectRes> = await axios(reqConfig);
      const { responseMsg, projects } = data;
      return dispatch({ type: "GetAllProjects", payload: { status, responseMsg, projects, loading: false } });
    } catch (error) {
      throw error;
    }
  }
  async handleGetOne({ dispatch, modelId }: GetOneProjParams): Promise<GetOneProject | SetProjectError> {
    const reqConfig: AxiosRequestConfig = {
      method: "GET",
      url: `/api/projects/${modelId ? modelId : ""}`
    };

    dispatch({ type: "ProjectsAPIRequest", payload: { loading: true }});
    try {
      const { status, data }: AxiosResponse<OneProjectRes> = await axios(reqConfig);
      const { responseMsg, project } = data;
      return dispatch({ type: "GetOneProject", payload: { status, responseMsg, project, loading: false } });
    } catch (err) {
      throw err;
    }
  }
  async handleCreate({ dispatch, JWTToken, formData, state }: CreateProjParams): Promise<CreateProject> {
    const reqConfig: AxiosRequestConfig = {
      method: "POST",
      url: "/api/projects",
      headers: {
        "Authorization": JWTToken
      },
      data: { projectData: { ...formData } }
    };

    dispatch({ type: "ProjectsAPIRequest", payload: { loading: true } });
    try {
      const { status, data }: AxiosResponse<CreateProjectRes> = await axios(reqConfig);
      const { responseMsg, createdProject } = data;
      const updatedProjects: ProjectData[] = [ { ...createdProject }, ...state.projectsArr ];
      return dispatch({ type: "CreateProject", payload: { status, responseMsg, createdProject, updatedProjects, loading: false } });
    } catch (err) {
      throw err;
    }
  } 
  async handleEdit({ dispatch, modelId, JWTToken, formData, state }: EditProjParams): Promise<EditProject | SetProjectError> {
    const reqConfig: AxiosRequestConfig = {
      method: "PATCH",
      url: `/api/projects/${modelId ? modelId : ""}`,
      headers: {
        "Authorization": JWTToken
      },
      data: { projectData: { ...formData } }
    };

    dispatch({ type: "ProjectsAPIRequest", payload: { loading: true } });
    try {
      const { status, data }: AxiosResponse<EditProjectRes> = await axios(reqConfig);
      const { responseMsg, editedProject } = data;
      const updatedProjects: ProjectData[] = state.projectsArr.map((projData) => {
        if (projData._id === editedProject._id) return { ...editedProject };
        else return projData;
      });
      return dispatch({ 
        type: "EditProject", 
        payload: { status, responseMsg, editedProject, updatedProjects, loading: false } 
      });
    } catch (err) {
      throw err;
    }
  }
  async handleDelete({ dispatch, modelId, JWTToken, state }: DeleteProjParams): Promise<DeleteProject | SetProjectError> {
    const { currentSelectedProject } = state;
    const reqConfig: AxiosRequestConfig = {
      method: "DELETE",
      url: `/api/projects/${modelId ? modelId : ""}`,
      headers: {
        "Authorization": JWTToken
      }    
    };

    dispatch({ type: "ProjectsAPIRequest", payload: { loading: true } });
    try {
      const { status, data }: AxiosResponse<DeleteProjectRes> = await axios(reqConfig);
      const { responseMsg, deletedProject } = data;
      const updatedProjects: ProjectData[] = state.projectsArr.filter((projData) => projData._id !== deletedProject._id);
      const updatedCurrentProject: ProjectData | null = currentSelectedProject._id === deletedProject._id ? null : currentSelectedProject;
      return dispatch({ 
        type: "DeleteProject", 
        payload: { status, responseMsg, updatedCurrentProject, updatedProjects, loading: false } 
      });
    } catch (err) {
      throw err;
    }
  }
  async handleAddImage({ dispatch, modelId, JWTToken, imageURL, state }: UploadImageParams): Promise<UploadProjectImage> {
    const { projectsArr } = state;
    const reqConfig: AxiosRequestConfig = {
      method: "PATCH",
      url: `/api/projects/add_image/${modelId ? modelId : ""}`,
      headers: { 
        "Authorization": JWTToken 
      },
      data: { imageURL }
    };

    dispatch({ type: "ProjectsAPIRequest", payload: { loading: true }});
    try {
      const { status, data }: AxiosResponse<UploadProjImgRes> = await axios(reqConfig);
      const { responseMsg, updatedProject } = data;

      const updatedProjectsArr: ProjectData[] = projectsArr.map((projectData) => {
        if (projectData._id === updatedProject._id) return { ...updatedProject, images: [ ...updatedProject.images ]};
        else return projectData;
      });
      const updatedProductImages: string[] = [ ...updatedProject.images ];
      
      return dispatch({ 
        type: "UploadProjectImage", 
        payload: { 
          status, responseMsg, updatedProject, updatedProjectsArr, updatedProductImages, loading: false 
        }
      });
    } catch (error) {
      throw error;
    }
  }
  async handleRemoveImage({ dispatch, modelId, JWTToken, imageURL, state }: RemoveImageParams): Promise<DeleteProjectImage> {
    const { projectsArr } = state; 
    const reqConfig: AxiosRequestConfig = {
      method: "PATCH",
      url: `/api/projects/remove_image/${modelId ? modelId : ""}`,
      headers: { 
        "Authorization": JWTToken 
      },
      data: { imageURL }
    };

    dispatch({ type: "ProjectsAPIRequest", payload: { loading: true }});
    try {
      const { status, data }: AxiosResponse<UploadProjImgRes> = await axios(reqConfig);
      const { responseMsg, updatedProject } = data;

      const updatedProjectsArr: ProjectData[] = projectsArr.map((projectData) => {
        if (projectData._id === updatedProject._id) return { ...updatedProject, images: [ ...updatedProject.images ]};
        else return projectData;
      });
      const updatedProductImages: string[] = [ ...updatedProject.images ];
      
      return dispatch({ 
        type: "DeleteProjectImage", 
        payload: { 
          status, responseMsg, updatedProject, updatedProjectsArr, updatedProductImages, loading: false 
        }
      });
    } catch (error) {
      throw error;
    }
  }

  // non API actions //
  handleSetCurrentProjData({ dispatch, projectId, state }: SetProjParams): boolean {
    const project: ProjectData | undefined = state.projectsArr.filter((projData) => projData._id === projectId)[0];
    if (project) {
      dispatch({ type: "SetProject", payload: { project }});
      return true;
    } else {
      const { status, responseMsg } = state;
      const error = new Error("User Error");
      const errorMessages = [ "Couldn't resolve a project to open" ];
      dispatch({ type: "SetProjectError", payload: { status, responseMsg, error, errorMessages, loading: false }});
      return false;
    }
  }
  handleClearCurrentProjData({ dispatch }: ClearProjParams): ClearProject {
    return dispatch({ type: "ClearProject", payload: { project: null }});
  }
  handleError({ dispatch, error: err }: ProjErrorParams): SetProjectError {
    const { status, responseMsg, error, errorMessages } = processAxiosError(err);
    return dispatch({ type: "SetProjectError", payload: { status, responseMsg, error, errorMessages, loading: false }});
  }
};

export const ProjectActions = new ProjectReduxActions();
