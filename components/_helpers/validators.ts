import axios, { AxiosResponse } from "axios";
//
import { BlogPostFormData } from "../../redux/_types/blog_posts/dataTypes";
// type imports //
import { AxiosRequestConfig } from "axios";

export type ValidationResponse = {
  valid: boolean;
  errorMessages: string[];
};

export const blogPostValidator = (blogPostFormData: BlogPostFormData): ValidationResponse => {
  const { title, author, keywords, category, content } = blogPostFormData; 
  const res: ValidationResponse = { valid: true, errorMessages: [] };
  if (!title) {
    res.valid = false;
    res.errorMessages.push("Blog Post must have a title");
  }
  if (!author) {
    res.valid = false;
    res.errorMessages.push("Blog Post must have an author");
  }
  if (keywords.length === 0) {
    res.valid = false;
    res.errorMessages.push("Blog Post must have at least one keyword");
  }
  if (!category) {
    res.valid = false;
    res.errorMessages.push("Blog Post must have a category");
  }
  if (!content) {
    res.valid = false;
    res.errorMessages.push("Blog Post must have some content");
  }
  return res;
};

export const registerFormValidator = (data: { email?: string; password?: string; confirmPassword?: string }): ValidationResponse => {
  const {  email, password, confirmPassword } = data;
  const res: ValidationResponse =  { valid: true, errorMessages: [] };

  if (!email) {
    res.valid = false;
    res.errorMessages.push("Email is required to register");
  }
  if (!password) {
    res.valid = false;
    res.errorMessages.push("Password is required to register");
  }
  if (!confirmPassword) {
    res.valid = false;
    res.errorMessages.push("Please confirm your password");
  }
  if (password && confirmPassword) {
    if (password !== confirmPassword) {
      res.valid = false;
      res.errorMessages.push("Passwords do not match");
    }
  }
  return res;
};

export const loginFormValidator = (data: { email?: string; password?; emailError?: string; passwordError?: string; }): ValidationResponse => {
  const {  email, password, emailError, passwordError } = data;
  const res: ValidationResponse =  { valid: true, errorMessages: [] };

  if (emailError || passwordError) {
    if (emailError) res.errorMessages.push(emailError);
    if (passwordError) res.errorMessages.push(passwordError);
    return res;
  }  
  if (!email) {
    res.errorMessages.push("Email is required to register");
  }
  if (!password) {
    res.errorMessages.push("Password is required to register");
  }
  return res.errorMessages.length > 0 ? { ...res, valid: false } : res;
};

export const validateUserPasswordChange = (data: { oldPassword?: string; newPassword?: string; confirmNewPassword?: string; }, opts?: { oldPassRequired?: boolean }): ValidationResponse => {
  const { oldPassword, newPassword, confirmNewPassword } = data;
  const res: ValidationResponse = { valid: true, errorMessages: [] };
  if (!newPassword) {
    res.errorMessages.push("Please enter the new password");
  }
  if (!confirmNewPassword) {
    res.errorMessages.push("Please confrim the new password");
  }
  if (newPassword && confirmNewPassword) {
    if (newPassword !== confirmNewPassword) {
      res.errorMessages.push("New passwords do not match");

    }
  }
  // check old password if required //
  if (opts && opts.oldPassRequired) {
    if (!oldPassword) {
      res.errorMessages.push("Please enter your current pasword");
    }
  }

  return res.errorMessages.length > 0 ? { ...res, valid: false } : res;
};

// PROJECT Model validators //
export const validateProjectForm = (data: { title?: string; description?: string; challenges?: string; solution?: string; }): ValidationResponse => {
  const { title, description, challenges, solution } = data;
  const res: ValidationResponse = { valid: true, errorMessages: [] };
  if (!title) {
    res.errorMessages.push("Project title is required");
  }
  if (!description) {
    res.errorMessages.push("Project description is required");
  }
  if (!challenges) {
    res.errorMessages.push("Project challenges content is required");
  }
  if (!solution) {
    res.errorMessages.push("Project solution content is required");
  }
  res.valid = res.errorMessages.length > 0 ? false : true;
  return res;
}

// USER Model validators //
export const validateUserForm = (data: { firstName?: string; lastName?: string; email?: string; }): ValidationResponse => {
  const { firstName, lastName, email } = data;
  const res: ValidationResponse = { valid: false, errorMessages: [] };
  if (!firstName) {
    res.errorMessages.push("First name is required");
  }
  if (!lastName) {
    res.errorMessages.push("Last name is equired");
  }
  if (!email) {
    res.errorMessages.push("Email is required");
  }

  return res.errorMessages.length > 0 ? { ...res, valid: false } : { ...res, valid: true };
};

export const valdateAdminForm = async (data: { firstName?: string; lastName?: string; email?: string; handle?: string; }) => {
  const { firstName, lastName, email } = data;
  const res: ValidationResponse = { valid: false, errorMessages: [] };

  if (!firstName) {
    res.errorMessages.push("First name is required");
  }
  if (!lastName) {
    res.errorMessages.push("Last name is equired");
  }
  if (!email) {
    res.errorMessages.push("Email is required");
  }

  return res.errorMessages.length > 0 ? { ...res, valid: false } : { ...res, valid: true };
}


export const validateUniqueEmail =  async (email: string): Promise<{ status: number; responseMsg: string; exists: boolean; }> => {
  const axiosReq: AxiosRequestConfig = {
    url: "/api/unique_email",
    method: "get",
    params: {
      email
    }
  };

  try {
    const { status, data }: AxiosResponse<{ responseMsg: string; exists: boolean }> = await axios(axiosReq);
    return  { ...data, status };
  } catch (error) {
    throw error;
  }
}