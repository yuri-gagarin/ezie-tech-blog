import type { IProjectState } from "../_types/projects/dataTypes";
import type { ProjectAction } from "../_types/projects/actionTypes";
// helpers //
import{ generateEmptyProjectsState } from "../_helpers/mockData";

const initialState: IProjectState = generateEmptyProjectsState();

export default function blogPostsReducer(state: IProjectState = initialState, action: ProjectAction): IProjectState {
  switch(action.type) {
    case "SetProject": {
      return {
        ...state,
        currentSelectedProject: action.payload.project,
        error: null,
        errorMessages: null
      };
    }
    case "ClearProject": {
      return {
        ...state,
        currentSelectedProject: action.payload.project,
        error: null,
        errorMessages: null
      };
    }
    // api req cases //
    case "ProjectsAPIRequest": {
      return {
        ...state,
        loading: action.payload.loading,
        error: null,
        errorMessages: null
      };
    }
    case "GetAllProjects": {
      return {
        ...state,
        status: action.payload.status,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        projectsArr: action.payload.projects,
        error: null,
        errorMessages: null
      };
    }
    case "GetOneProject": {
      return {
        ...state,
        status: action.payload.status,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        currentSelectedProject: action.payload.project,
        currentProjectImages: [ ...action.payload.project.images ],
        error: null,
        errorMessages: null
      };
    }
    case "CreateProject": {
      return {
        status: action.payload.status,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        currentSelectedProject: action.payload.createdProject,
        currentProjectImages: [ ...action.payload.createdProject.images ],
        projectsArr: action.payload.updatedProjects,
        error: null,
        errorMessages: null
      };
    }
    case "EditProject": {
      return {
        status: action.payload.status,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        currentSelectedProject: action.payload.editedProject,
        currentProjectImages: [ ...action.payload.editedProject.images ],
        projectsArr: action.payload.updatedProjects,
        error: null,
        errorMessages: null
      };
    }
    case "DeleteProject": {
      return {
        status: action.payload.status,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        currentSelectedProject: action.payload.updatedCurrentProject,
        currentProjectImages: null,
        projectsArr: action.payload.updatedProjects,
        error: null,
        errorMessages: null
      };
    }
    case "UploadProjectImage": {
      return {
        status: action.payload.status,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        currentSelectedProject: action.payload.updatedProject,
        projectsArr: action.payload.updatedProjectsArr,
        currentProjectImages: action.payload.updatedProductImages,
        error: null,
        errorMessages: null
      };
    }
    case "DeleteProjectImage": {
      return {
        status: action.payload.status,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        currentSelectedProject: action.payload.updatedProject,
        projectsArr: action.payload.updatedProjectsArr,
        currentProjectImages: action.payload.updatedProductImages,
        error: null,
        errorMessages: null
      };
    }
    case "SetProjectError": {
      return {
        ...state,
        status: action.payload.status,
        responseMsg: action.payload.responseMsg,
        error: action.payload.error,
        errorMessages: action.payload.errorMessages
      };
    }
    case "ClearProjectError": {
      return {
        ...state,
        error: action.payload.error,
        errorMessages: action.payload.errorMessages
      };
    }
    default: return state;
  }
};
