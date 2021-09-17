import { BlogPostFormData } from "../../redux/_types/blog_posts/dataTypes";

export const blogPostValidator = (blogPostFormData: BlogPostFormData): { valid: boolean; errorMessages: string[] } => {
  const { title, author, keywords, category, content } = blogPostFormData; 
  const res = { valid: true, errorMessages: [] };
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
