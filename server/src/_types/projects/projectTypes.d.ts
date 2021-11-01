import type { IProject } from "../../models/Project";

export type ProjectData = {
  title?: string;
  creator?: mongoose.Types.ObjectId;
  description?: string;
  challenges?: string;
  solution?: string;
  languages?: {
    js?: boolean; ts?: boolean; python?: boolean; ruby?: boolean?; cSharp?: boolean; goLang?: boolean;
  };
  libraries?: {
    bootstrap?: boolean; semanticUI?: boolean; materialUI?: boolean; jquery?: boolean; react?: boolean; reactNative?: boolean; redux?: boolean; socketIO?: boolean;
  };
  frameworks?: {
    rails?: boolean; nextJS?: boolean; gatsbyJS?: boolean; django?: boolean; flask?: boolean; ASP?: boolean;
  };
  images: string[];
  published: boolean;
  createdAt: string;
  editedAd: string;
};

export type ProjectQueryParams = {
  limit?: string;
  published?: string;
};

export type ProjectIndexRes = {
  responseMsg: string;
  projects: IProject[];
};
export type ProjectGetOneRes = {
  responseMsg: string;
  project: IProject;
};
export type ProjectCreateRes = {
  responseMsg: string;
  createdProject: IProject;
};
export type ProjectEditRes = {
  responseMsg: string;
  editedProject: IProject;
};
export type ProjectDeleteRes = {
  responseMsg: string;
  deletedProject: IProject;
};
export type ProjectImgRes = {
  responseMsg: string;
  updatedProject: IProject;
};
