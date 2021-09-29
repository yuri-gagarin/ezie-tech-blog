import type { Dispatch } from "redux";
import type { ProjectAction } from "./actionTypes";

export type ProjectData = {
  _id: string;
  title: string;
  creator: string;
  description: string;
  challenges: string;
  solution: string;
  languages: {
    js: boolean; ts: boolean; python: boolean; ruby: boolean; cSharp: boolean; goLang: boolean;
  };
  libraries: {
    bootstrap: boolean; semanticUI: boolean; materialUI: boolean; jquery: boolean; react: boolean; reactNative: boolean; redux: boolean; socketIO: boolean;
  };
  frameworks: {
    rails: boolean; nextJS: boolean; gatsbyJS: boolean; django: boolean; flask: boolean; ASP: boolean;
  };
  images: string[];
  published: boolean;
  createdAt: string;
  editedAd: string;
};
export type ProjectFormData = {
  _id?: string;
  title?: string;
  creator?: string;
  description?: string;
  challenges?: string;
  solution?: string;
  languages?: {
    js?: boolean; ts?: boolean; python?: boolean; ruby?: boolean; cSharp?: boolean; goLang?: boolean;
  };
  libraries?: {
    bootstrap?: boolean; semanticUI?: boolean; materialUI?: boolean; jquery?: boolean; react?: boolean; reactNative?: boolean; redux?: boolean; socketIO?: boolean;
  };
  frameworks?: {
    rails?: boolean; nextJS?: boolean; gatsbyJS?: boolean; django?: boolean; flask?: boolean; ASP?: boolean;
  };
  images?: string[];
  published?: boolean;
  createdAt?: string;
  editedAd?: string;
};

export interface IProjectState {
  status: number;
  responseMsg: string;
  loading: boolean;
  projectsArr: ProjectData[];
  currentSelectedProject: ProjectData | null;
  error: any;
  errorMessages: string[] | null;
};

export type ProjectFetchParams = {
  date?: "asc" | "desc";
  limit?: number;
  title?: string;
  owner?: string;
};

// redux actions method params //
export type GetAllProjParams = {
  dispatch: Dispatch<ProjectAction>;
  opts?: ProjectFetchParams;
};
export type GetOneProjParams = {
  dispatch: Dispatch<ProjectAction>;
  modelId: string;
  JWTToken?: string;
  state?: IProjectState;
};
export type CreateProjParams = {
  dispatch: Dispatch<ProjectAction>;
  JWTToken?: string;
  formData: ProjectFormData;
  state: IProjectState;
};
export type EditProjParams = {
  dispatch: Dispatch<ProjectAction>;
  modelId: string;
  JWTToken?: string;
  formData: ProjectFormData;
  state: IProjectState;
};
export type DeleteProjParams = {
  dispatch: Dispatch<ProjectAction>;
  modelId: string;
  JWTToken?: string;
  state: IProjectState;
};
export type SetProjParams = {
  dispatch: Dispatch<ProjectAction>;
  projectId: string;
  state: IProjectState;
};
export type ClearProjParams = {
  dispatch: Dispatch<ProjectAction>;
};
export type ProjErrorParams = {
  dispatch: Dispatch<ProjectAction>;
  error: any;
};

export type IndexProjectRes = {
  responseMsg: string;
  projects: ProjectData[];
  error?: any;
  errorMessages?: string[];
}
export type OneProjectRes = {
  responseMsg: string;
  project: ProjectData;
  error?: any;
  errorMessages?: string[];
};
export type CreateProjectRes = {
  responseMsg: string;
  createdProject: ProjectData;
  error?: any;
  errorMessages?: string[];
};
export type EditProjectRes = {
  responseMsg: string;
  editedProject: ProjectData;
  error?: any;
  errorMessages: string[];
};
export type DeleteProjectRes = {
  responseMsg: string;
  deletedProject: ProjectData;
  error?: any;
  errorMessages?: string[];
};
