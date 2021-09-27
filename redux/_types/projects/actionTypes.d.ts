import { ProjectData, IProjectState } from "./dataTypes";

// api related actions //
export type ProjectAPIRequest = {
  readonly type: "ProjectsAPIRequest";
  readonly payload: {
    loading: boolean;
  };
};
export type GetAllProjects = {
  readonly type: "GetAllProjects";
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
    project: ProjectData;
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
    project: ProjectData;
  };
};
export type ClearProject = {
  readonly type: "ClearProject";
  readonly payload: {
    project: ProjectData;
  }; 
};

export type ProjectAction = ProjectAPIRequest | GetAllProjects | GetOneProject | CreateProject | EditProject | DeleteProject | SetProjectError | ClearProjectError | SetProject | ClearProject;