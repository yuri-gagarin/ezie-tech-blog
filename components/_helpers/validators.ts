import { BlogPostFormData } from "../../redux/_types/blog_posts/dataTypes";

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



