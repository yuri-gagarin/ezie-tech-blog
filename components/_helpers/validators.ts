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
    res.valid = false;
    if (emailError) res.errorMessages.push(emailError);
    if (passwordError) res.errorMessages.push(passwordError);
    return res;
  }  
  if (!email) {
    res.valid = false;
    res.errorMessages.push("Email is required to register");
  }
  if (!password) {
    res.valid = false;
    res.errorMessages.push("Password is required to register");
  }
  return res;
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


export const validateUniqueEmail =  async (email: string): Promise<{ status: number; responseMsg: string; exists: boolean }> => {
  const axiosReq: AxiosRequestConfig = {
    url: "/api/validate_email",
    method: "get",
    data: {
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