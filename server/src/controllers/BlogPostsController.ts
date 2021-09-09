import BlogPost from "../models/BlogPost";
import type { Request, Response } from "express";
import type { ICRUDController } from "../_types/abstracts/DefaultController";
import type { BlogPostClientData, IndexBlogPostRes, OneBlogPostRes, CreateBlogPostRes, EditBlogPostRes, DeleteBlogPostRes } from "../_types/blog_posts/blogPostTypes";

export default class BlogPostsController implements ICRUDController {
  index(req: Request, res: Response<IndexBlogPostRes>): Promise<Response<IndexBlogPostRes>> {
    return BlogPost.find({}).exec()
      .then((blogPosts) => {
        return res.status(200).json({
          responseMsg: "Fetched",
          blogPosts: blogPosts
        });
      })
      .catch((error) => {
        return res.status(500).json({
          responseMsg: "Error",
          error: error
        });
      });
  }
  getOne(req: Request, res: Response<OneBlogPostRes>): Promise<Response<OneBlogPostRes>> {
    const { blog_post_id } = req.params;

    if (!blog_post_id) {
      return this.generalErrorResponse(res, { status: 400, error: new Error("Could not resolve post") });
    }
    return BlogPost.findOne({ _id: blog_post_id }).exec()
      .then((blogPost) => {
        return res.status(200).json({
          responseMsg: "Fetched post", blogPost
        });
      })
      .catch((error) => {
        return this.generalErrorResponse(res, { status: 500, error });
      });
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