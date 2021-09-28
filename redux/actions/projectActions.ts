import axios, { AxiosResponse } from "axios";
import { IGeneralCRUDActions } from "../_types/_general/abstracts";
// types //
import type { AxiosRequestConfig } from "axios";
import type { CreateProject, EditProject, DeleteProject, GetAllProjects, GetOneProject, ProjectAction, SetProjectError } from "../_types/projects/actionTypes";
import type { 
  GetAllProjParams, GetOneProjParams, CreateProjParams, EditProjParams, DeleteProjParams,
  IndexProjectRes, OneProjectRes, CreateProjectRes, EditProjectRes, DeleteProjectRes, ProjectData
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
    } catch (err) {
      const { status, responseMsg, error, errorMessages } = processAxiosError(err);
      return dispatch({ type: "SetProjectError", payload: { status, responseMsg, error, errorMessages, loading: false } });
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
      const { status, responseMsg, error, errorMessages } = processAxiosError(err);
      return dispatch({ type: "SetProjectError", payload: { status, responseMsg, error, errorMessages, loading: false } });
    }
  }
  async handleCreate({ dispatch, JWTToken, formData, state }: CreateProjParams): Promise<CreateProject | SetProjectError> {
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
      const { status, responseMsg, error, errorMessages } = processAxiosError(err);
      return dispatch({ 
        type: "SetProjectError", 
        payload: { status, responseMsg, error, errorMessages, loading: false } 
      });
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
      const { status, responseMsg, error, errorMessages } = processAxiosError(err);
      return dispatch({ type: "SetProjectError", payload: { status, responseMsg, error, errorMessages, loading: false } });
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
      const updatedCurrentProject: ProjectData = currentSelectedProject._id === deletedProject._id ? null : currentSelectedProject;
      return dispatch({ 
        type: "DeleteProject", 
        payload: { status, responseMsg, updatedCurrentProject, updatedProjects, loading: false } 
      });
    } catch (err) {
      const { status, responseMsg, error, errorMessages } = processAxiosError(err);
      return dispatch({ type: "SetProjectError", payload: { status, responseMsg, error, errorMessages, loading: false } });
    }
  }
};

export const ProjectActions = new ProjectReduxActions();
