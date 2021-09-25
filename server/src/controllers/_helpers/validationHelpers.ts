import { ValidationResponse } from "../../../../components/_helpers/validators";

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

export type NormalizedProjectOptsRes = {
  languages: { js: boolean; ts: boolean; python: boolean; ruby: boolean; cSharp: boolean; goLang: boolean; };
  libraries: { bootstrap: boolean; semanticUI: boolean; materialUI: boolean; jquery: boolean; react: boolean; reactNative: boolean; redux: boolean; };
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
    libraries:  [ "bootstrap", "semanticUI", "materialUI", "jquery", "react", "reactNative", "redux" ],
    frameworks: [ "rails", "nextJS", "gatsbyJS", "django", "flask", "ASP" ]
  };
  const returnObj = {} as NormalizedProjectOptsRes;

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