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
    case "GetProjects": {
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
        projectsArr: action.payload.updatedProjects,
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
