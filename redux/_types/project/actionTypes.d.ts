import { ProjectData, IProjectState } from "./dataTypes";

// api related actions //
export type ProjectAPIRequest = {
  readonly type: "ProjectsAPIRequest";
  readonly payload: {
    responseMsg: string;
    loading: boolean;
  };
};
export type GetAllProjects = {
  readonly type: "GetProjects";
  readonly payload: {
    status: number;
    responseMsg: string;
    loading: boolean;
    projects: ProjectData[];
  };
};
export type GetOneProject = {
  readonly type: "GetOneProject";
  readonly payload: {
    status: number;
    responseMsg: string;
    loading: boolean;
    projectPost: ProjectData;
  };
};
export type CreateProject = {
  readonly type: "CreateProject";
  readonly payload: {
    status: number;
    responseMsg: string;
    loading: boolean;
    createdProject: ProjectData;
    updatedProjects: ProjectData[];
  };
};
export type EditProject = {
  readonly type: "EditProject";
  readonly payload: {
    status: number;
    responseMsg: string;
    loading: boolean;
    editedProject: ProjectData;
    updatedProjects: ProjectData[];
  };
};
export type DeleteProject = {
  readonly type: "DeleteProject";
  readonly payload: {
    status: number;
    responseMsg: string;
    loading: boolean;
    updatedCurrentProject: ProjectData;
    updatedProjects: ProjectData[];
  };
};
export type SetProjectError = {
  readonly type: "SetProjectError";
  readonly payload: {
    status: number;
    responseMsg: string;
    loading: boolean;
    error: any;
    errorMessages: string[];
  };
};
export type ClearProjectError = {
  readonly type: "ClearProjectError";
  readonly payload: {
    error: null, errorMessages: null;
  };
};
// non api actions //
export type SetProject = {
  readonly type: "SetProject";
  readonly payload: {
    projectPost: ProjectData;
    currentProjectState: IProjectState;
  };
};
export type ClearProject = {
  readonly type: "ClearProject";
  readonly payload: {
    projectPost: ProjectData;
  };
};

export type ProjectAction = (ProjectAPIRequest | GetAllProjects | GetOneProject | CreateProject | EditBprojectPost | DeleteProject | ToggleProjectLike | SetProject | ClearProject | SetProjectError);