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
    bootstrap: boolean; semanticUI: boolean; materialUI: boolean; jquery: boolean; react: boolean; reactNative: boolean; redux: boolean;
  };
  frameworks: {
    rails: boolean; nextJS: boolean; gatsbyJS: boolean; django: boolean; flask: boolean; ASP: boolean;
  };
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
    bootstrap?: boolean; semanticUI?: boolean; materialUI?: boolean; jquery?: boolean; react?: boolean; reactNative?: boolean; redux?: boolean;
  };
  frameworks?: {
    rails?: boolean; nextJS?: boolean; gatsbyJS?: boolean; django?: boolean; flask?: boolean; ASP?: boolean;
  };
  createdAt?: string;
  editedAd?: string;
};

export interface IProjectState {
  status: number;
  responseMsg: string;
  loading: boolean;
  projectsArr: ProjectData[];
  currentSelectedProject: ProjectData;
  error: any;
  errorMessages: string[] | null;
}

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
