import BlogPost, { IBlogPost } from "../models/BlogPost";
import type { Request, Response } from "express";
import type { ICRUDController } from "../_types/abstracts/DefaultController";
import type { BlogPostClientData, IndexBlogPostRes, OneBlogPostRes, CreateBlogPostRes, EditBlogPostRes, DeleteBlogPostRes, FetchBlogPostsOpts } from "../_types/blog_posts/blogPostTypes";

export default class BlogPostsController implements ICRUDController {
  index = async (req: Request, res: Response<IndexBlogPostRes>): Promise<Response<IndexBlogPostRes>> => {
    const { limit = 10, category, createdAt = "asc" } = req.query as FetchBlogPostsOpts;
    let blogPosts: IBlogPost[];
    if (category) {
      try {
        blogPosts = await BlogPost.find(( category === "all" ? {} : { category })).limit(limit).sort({ createdAt }).exec();
        return res.status(200).json({
          responseMsg: `Fetched all posts with category ${category.toUpperCase()}.`, blogPosts
        });
      } catch (error) {
        return await this.generalErrorResponse(res, { error });
      }
    } else {
      try {
        blogPosts = await BlogPost.find({}).limit(limit).sort({ createdAt }).exec();
        return res.status(200).json({
          responseMsg: `Fetched all posts`, blogPosts
        });
      } catch (error) {
        return await this.generalErrorResponse(res, { error });
      }
    }
  }
  getOne = async (req: Request, res: Response<OneBlogPostRes>): Promise<Response<OneBlogPostRes>> => {
    const { blog_post_id } = req.params;
    let blogPost: IBlogPost;
  
    if (!blog_post_id) {
      return await this.generalErrorResponse(res, { status: 400, error: new Error("Could not resolve post") });
    }
    blogPost = await BlogPost.findOne({ _id: blog_post_id }).exec()
    if (blogPost) {
      return res.status(200).json({ responseMsg: "Fetched blog post", blogPost });
    } else {
      return await this.generalErrorResponse(res, { status: 404, error: new Error("Could not find post") });
    }
  }
  create(req: Request, res: Response<CreateBlogPostRes>): Promise<Response<CreateBlogPostRes>> {
    const blogPostData = req.body.blogPostData as BlogPostClientData;
    const { title, author, content, keywords = [], live } = blogPostData;
    // tihs will need to be validated later //
    return (
      BlogPost.create({
        title, author, content, keywords, live, editedAt: new Date(Date.now()), createdAt: new Date(Date.now())
      })
    )
    .then((createdBlogPost) => {
      return res.status(200).json({
        responseMsg: "Created post", createdBlogPost
      });
    }) 
    .catch((error) => {
      return this.generalErrorResponse(res, { status: 500, error });
    })
  }
  edit(req: Request, res: Response<EditBlogPostRes>): Promise<Response<EditBlogPostRes>> {
    const blogPostData = req.body.blogPostData as BlogPostClientData;
    const { title, author, content, keywords = [], live } = blogPostData;
    // tihs will need to be validated later //
    return (
      BlogPost.findOneAndUpdate({
        title, author, content, keywords, live, editedAt: new Date(Date.now())
      })
    )
    .then((editedBlogPost) => {
      return res.status(200).json({
        responseMsg: "Created post", editedBlogPost
      });
    }) 
    .catch((error) => {
      return this.generalErrorResponse(res, { status: 500, error });
    })
  }
  delete(req: Request, res: Response): Promise<Response<DeleteBlogPostRes>> {
    const { blog_post_id } = req.params;
    if (!blog_post_id) return this.generalErrorResponse(res, { status: 400, error: new Error("Could not resolve blog post to delete") });

    return BlogPost.findOneAndDelete({ _id: blog_post_id }).exec()
      .then((deletedBlogPost) => {
        return res.status(200).json({
          responseMsg: "Blog post deleted", deletedBlogPost
        });
      })
      .catch((error) => this.generalErrorResponse(res, { error }) );
  }


  private generalErrorResponse(res: Response, { status, responseMsg, error }: { status?: number, responseMsg?: string, error?: any }): Promise<Response> {
    const _status = status ? status : 500;
    const _responseMsg = responseMsg ? responseMsg : "An error occured";
    const _error = error ? error : new Error("General error occured");
    return Promise.resolve().then(() => {
      return res.status(_status).json({
        responseMsg: _responseMsg,
        error: _error
      });
    });
  }
}