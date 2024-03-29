import { Types } from "mongoose";
// models //
import Admin from "../../models/Admin";
import User from "../../models/User";
// type imports //
import type { BlogPostFormData } from "@/redux/_types/blog_posts/dataTypes";
import type { ValidationResponse } from "../../../../components/_helpers/validators";
import { PasswordChangeData } from "../../_types/admins/adminTypes";

export type ValidationRes = {
  valid: boolean;
  errorMessages: string[];
};

export const validatePasswordChangeData = ({ newPassword, confirmNewPassword, oldPassword }: PasswordChangeData, opts?: { oldPassRequired?: boolean; }): ValidationRes => {
  const res: ValidationRes = { valid: true, errorMessages: [] };
  // newPassword field must be truthy and be a valid string // 
  if (newPassword) {
    if (typeof newPassword !== "string") {
      res.errorMessages.push("Invalid data type for New Password field");
    }
  } else {
    res.errorMessages.push("New Password field is required.")
  }
  // confirmNewPassword field must be truthy and be a valid string //
  if (confirmNewPassword) {
    if (typeof confirmNewPassword !== "string") {
      res.errorMessages.push("Invalid data type for Confirm New Password field");
    }
  } else {
    res.errorMessages.push("Confirm New Password field is required.")
  }
  // confirm matching new passwords //
  if (newPassword && confirmNewPassword) {
    if (newPassword !== confirmNewPassword) {
      res.errorMessages.push("Passwords do not match");
    }
  }
  // if an authorized admin user is resetting another users password old password is not needed //
  // otherswise if <opts.oldPassRequired>, Old Password filed is required //
  if (opts && opts.oldPassRequired) {
    // oldPasswrod field must be truthy and be a valid string //
    if (oldPassword) {
      if (typeof oldPassword !== "string") {
        res.errorMessages.push("Invalid data type for Current Password field");
      }
    } else {
      res.errorMessages.push("Your current password is required");
    }
  }
  return res.errorMessages.length > 0 ? { valid: false, errorMessages: [ ...res.errorMessages] } : { valid: true, errorMessages: [] };
};

export const validateRegistrationData = (data: { email?: string; password?: string; confirmPassword?: string; }): ValidationResponse => {
  const errorMessages = [];
  if (!data.email) {
    errorMessages.push("Email is required");
  }
  if (!data.password) {
    errorMessages.push("Password is required");
  }
  if (!data.confirmPassword) {
    errorMessages.push("Password confirmation is required");
  }

  if (data.email) {
    if (typeof data.email !== "string") {
      errorMessages.push("Wrong input for email");
    }
  }
  if (data.password && typeof data.password !== "string") {
    errorMessages.push("Wrong input for password");
  }
  if (data.confirmPassword && typeof data.confirmPassword !== "string") {
    errorMessages.push("Wrong input for password confirm");
  }
  if (data.password && data.confirmPassword) {
    if (data.password !== data.confirmPassword) {
      errorMessages.push("Passwords do not match");
    }
  }
  return errorMessages.length === 0 ? { valid: true, errorMessages } : { valid: false, errorMessages };
};

// User model validator //
export const validateUserData = (data: { email?: string; password?: string; confirmPassword?: string; firstName?: string; lastName?: string; }, opts?: { existing?: boolean; }): ValidationResponse => {
  const errorMessages = [];
  if (!data.email) {
    errorMessages.push("Email is required");
  }
  if (!opts && !data.password) {
    errorMessages.push("Password is required");
  }
  if (!opts && !data.confirmPassword) {
    errorMessages.push("Password confirmation is required");
  }

  // validate correct types //
  if (data.email) {
    if (typeof data.email !== "string") {
      errorMessages.push("Wrong input for email");
    }
  }
  if (data.password && typeof data.password !== "string") {
    errorMessages.push("Wrong input for password");
  }
  if (data.confirmPassword && typeof data.confirmPassword !== "string") {
    errorMessages.push("Wrong input for password confirm");
  }
  if (data.password && data.confirmPassword) {
    if (data.password !== data.confirmPassword) {
      errorMessages.push("Passwords do not match");
    }
  }
  if (data.firstName && typeof data.firstName !== "string") {
    errorMessages.push("Wrong input type for first name field");
  }
  if (data.lastName && typeof data.lastName !== "string") {
    errorMessages.push("Wrong input type for last name field");
  }
  return errorMessages.length === 0 ? { valid: true, errorMessages } : { valid: false, errorMessages };
};

export const validateProfileDeleteData = (data: { userId?: string; currentPassword?: string}): ValidationRes => {
  const res: ValidationRes = { valid: false, errorMessages: [] };

  if (data.userId) {
    if (typeof data.userId !== "string") {
      res.errorMessages.push("Wrong input type for <userId> field");
    }
  } else {
    res.errorMessages.push("Missing required <userId> field");
  }

  if (data.currentPassword) {
    if (typeof data.currentPassword !== "string") {
      res.errorMessages.push("Wrong input type for <currentPassword> field");
    }
  } else {
    res.errorMessages.push("Missing required <currentPassword> field");
  }

  return res.errorMessages.length === 0 ? { ...res, valid: true } : res;
}

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
  if (!data.keywords) {
    errorMessages.push("No keywords selected");
  }

  // ensure correct types //
  if (data.title && typeof data.title !== "string") {
    errorMessages.push("Invalid data type for the Post title");
  }
  if (data.author) {
    if (data.author.authorId) {
      if (!Types.ObjectId.isValid(data.author.authorId)) {
        errorMessages.push("Invalid author id for the Post")
      }
    }
    if (data.author.name) {
      if (typeof data.author.name !== "string") {
        errorMessages.push("Invalid data type for the Post author name");
      }
    }
    if (data.content) {
      if (typeof data.content !== "string") {
        errorMessages.push("Invalid data type for the Post content");
      }
    }
    if (data.category) {
      if (typeof data.category !== "string") {
        errorMessages.push("Invalid data type for the Post category");
      }
      if (!allowedCategories.some((val) => val === data.category)) {
        errorMessages.push("Blog Post incompatible category selected");
      }
    }
    if (data.keywords) {
      if (Array.isArray(data.keywords)) {
        if (data.keywords.length === 0) {
          errorMessages.push("At least one keyword for Blog Post is required");
        }
      } else {
        errorMessages.push("Invalid data type for the Post keywords");
      }

    }
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
  // validate correct data type //
  if (data.title && typeof data.title !== "string") {
    res.errorMessages.push("Wrong data type for Project title");
  }
  if (data.description && typeof data.description !== "string") {
    res.errorMessages.push("Wrong data type for Project description");
  }
  if (data.challenges && typeof data.challenges !== "string") {
    res.errorMessages.push("Wrong data type for Project challenges");
  }
  if (data.solution && typeof data.solution !== "string") {
    res.errorMessages.push("Wrong data type for Project solution");
  }
  res.errorMessages.length > 0 ? res.valid = false : res.valid = true;
  return res;
};

export const validateUniqueEmail = async (email: string): Promise<{ exists: boolean; message: string }> => {
  try {
    const admin = await Admin.findOne({ email: email }).exec();
    if (admin) return { exists: true, message: "Email already exists" };
    else {
      const user = await User.findOne({ email: email }).exec();
      if (user) return { exists: true, message: "Email already exists" };
      else return { exists: false, message: "" };
    }
  } catch (error) {
    throw error;
  }
};

export const validateEditEmail = async (email: string, userId: string): Promise<{ exists: boolean; message: string}> => {
  try {
    const admin  = await Admin.findOne({ email: email, _id: { $ne: userId } });
    if (admin) {
      // exists //
      return { exists: true, message: "Email already exists for another user" };
    } else {
      const user = await User.findOne({ email: email, _id: { $ne: userId } });
      if (user) return { exists: true, message: "Email already exists for another user" };
      else return { exists: false, message: "" };
    }
  } catch (error) {
    throw error;
  }
};
  