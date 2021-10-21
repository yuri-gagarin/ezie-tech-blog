import type { BlogPostFormData } from "@/redux/_types/blog_posts/dataTypes";
import type { ValidationResponse } from "../../../../components/_helpers/validators";

export type ValidationRes = {
  valid: boolean;
  errorMessages: string[];
};

export const validateRegistrationData = (data: { email?: string; password?: string; confirmPassword?: string; }): ValidationResponse => {
  const res: ValidationRes = { valid: true, errorMessages: [] };
  if (!data.email) {
    res.errorMessages.push("Email is required");
    res.valid = false;
  }
  if (!data.password) {
    res.errorMessages.push("Password is required");
    res.valid = false;
  }
  if (!data.confirmPassword) {
    res.errorMessages.push("Password confirmation is required");
    res.valid = false;
  }
  if (data.password && data.confirmPassword) {
    if (data.password !== data.confirmPassword) {
      res.errorMessages.push("Passwords do not match");
      res.valid = false;
    }
  }
  return res;
};

// blog post model validators //
export const validateBlogPostModelData = (data: BlogPostFormData): ValidationRes => {
  const errorMessages: string[] = [];
  const allowedCategories: string[] = ["informational", "beginner", "intermediate", "advanced" ];

  if (!data.title) {
    errorMessages.push("Blog Post title is required");
  }
  if (!data.author || !data.author.authorId || !data.author.name) {
    errorMessages.push("Could not resolve Blog Post author data");
  }
  if (!data.content) {
    errorMessages.push("Blog Post content is required");
  }
  if (!data.category) {
    errorMessages.push("Blog Post category is required");
  }
  if (data.category) {
    if (!allowedCategories.some((val) => val === data.category)) {
      errorMessages.push("Blog Post incompatible category selected");
    }
  }
  if (!data.keywords) {
    errorMessages.push("No keywords selected");
  }
  if (data.keywords && data.keywords.length === 0) {
    errorMessages.push("Select at least one keyword");
  }

  return errorMessages.length === 0 ? { valid: true, errorMessages } : { valid: false, errorMessages };
};

// Project model validators //
export type NormalizedProjectOptsRes = {
  languages: { js: boolean; ts: boolean; python: boolean; ruby: boolean; cSharp: boolean; goLang: boolean; };
  libraries: { bootstrap: boolean; semanticUI: boolean; materialUI: boolean; jquery: boolean; react: boolean; reactNative: boolean; redux: boolean; socketIO: boolean };
  frameworks: { rails: boolean; nextJS: boolean; gatsbyJS: boolean; django: boolean; flask: boolean; ASP: boolean; };
}
type Args = {
  languages: any;
  libraries: any;
  frameworks: any;
}
export const normalizeProjectOpsData = (data: Args): NormalizedProjectOptsRes => {
  type KeysObj = { languages: string[]; libraries: string[]; frameworks: string[] };
  const keysObj: KeysObj = {
    languages: [ "js", "ts", "python", "ruby", "cSharp", "goLang" ],
    libraries:  [ "bootstrap", "semanticUI", "materialUI", "jquery", "react", "reactNative", "redux", "socketIO" ],
    frameworks: [ "rails", "nextJS", "gatsbyJS", "django", "flask", "ASP" ]
  };
  const returnObj = {
    languages: {},
    libraries: {},
    frameworks: {}
  } as NormalizedProjectOptsRes;

  const keys: string[] = Object.keys(data);
  for (const key of keys) {
    for (const objProperty of keysObj[(key as keyof KeysObj)]) {
      if (data[key as keyof Args].hasOwnProperty([objProperty])) {
        returnObj[key][objProperty] = data[key as keyof Args][objProperty];
      } else {
        returnObj[key][objProperty] = false;
      }
    }
  }
  return returnObj;
};

export const validateProjectModelData = (data: { title?: string; description?: string; challenges?: string; solution?: string }): ValidationRes => {
  const res: ValidationRes = { valid: true, errorMessages: [] };

  if (!data.title) {
    res.errorMessages.push("Project title field is required");
  }
  if (!data.description) {
    res.errorMessages.push("Project description field is required");
  }
  if (!data.challenges) {
    res.errorMessages.push("Project challengers field is required");
  }
  if (!data.solution) {
    res.errorMessages.push("Project solution field is required");
  }
  res.errorMessages.length > 0 ? res.valid = false : res.valid = true;
  return res;
}
  