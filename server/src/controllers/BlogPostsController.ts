import BlogPost from "../models/BlogPost";
import { BasicController } from "../_types/abstracts/DefaultController";
// types //
import type { Request, Response } from "express";
import type { IBlogPost } from "../models/BlogPost";
import type { ICRUDController } from "../_types/abstracts/DefaultController";
import type { BlogPostClientData, IndexBlogPostRes, OneBlogPostRes, CreateBlogPostRes, EditBlogPostRes, DeleteBlogPostRes, FetchBlogPostsOpts, LikeBlogPostRes, BlogPostErrRes } from "../_types/blog_posts/blogPostTypes";
import type { IUser } from "../models/User";
import type { IAdmin } from "../models/Admin";

export default class BlogPostsController extends BasicController implements ICRUDController {
  index = async (req: Request, res: Response<IndexBlogPostRes>): Promise<Response<IndexBlogPostRes>> => {
    const { limit = 10, category = "all", createdAt = "asc", byUser } = req.query as FetchBlogPostsOpts;
    // check for a user and admin //
    const isAdmin = this.isAdminOrOwner(req.user as (IAdmin | IUser));
    let blogPosts: IBlogPost[];

    try {
      if (isAdmin) {
        // can see both published and unpublished posts //
        blogPosts = await BlogPost.find({}).byCategory(category).sort({ createdAt }).limit(limit).exec();
        return res.status(200).json({
          responseMsg: `Fetched all posts`, blogPosts
        });
      } else {
        // return only published blog posts //
        blogPosts = await BlogPost.find({}).byPublishedStatus("published").byCategory(category).sort({ createdAt }).limit(limit);
        return res.status(200).json({
          responseMsg: `Fetched all posts`, blogPosts
        });
      }
    } catch (error) {
      console.log(error);
      return await this.generalErrorResponse(res, { error, errorMessages: [ "Error fetching blog posts" ] });
    }
  }
  getOne = async (req: Request, res: Response<OneBlogPostRes>): Promise<Response<OneBlogPostRes>> => {
    const { post_id } = req.params;
    let blogPost: IBlogPost;
  
    if (!post_id) {
      return await this.generalErrorResponse(res, { status: 400, error: new Error("Could not resolve post") });
    }

    if (req.query) {
      // custom options to get a post //
      if (req.query.searchBySlug) {
        // the post_id is actually a slug //
        try {
          const blogPost = await BlogPost.findOne({ slug: post_id }).exec();
          if (blogPost) {
            return res.status(200).json({
              responseMsg: `Retrieved post: ${blogPost.title}`, blogPost
            });
          } else {
            return await this.notFoundErrorResponse(res, [ "Blog Post was not found" ]);
          }
        } catch (error) {
          return await this.generalErrorResponse(res, { errorMessages: [ "Something went wrong retrieving the post" ] });
        }
      }
    };

    // general response to get it by id //
    try {
      blogPost = await BlogPost.findOne({ _id: post_id }).exec()
      if (blogPost) {
        return res.status(200).json({ responseMsg: "Fetched blog post", blogPost });
      } else {
        return await this.generalErrorResponse(res, { status: 404, error: new Error("Could not find post") });
      }
    } catch (error) {
      return await this.generalErrorResponse(res, { error });
    }
    
  }
  create = async (req: Request, res: Response<CreateBlogPostRes>): Promise<Response<CreateBlogPostRes>> => {
    const user = req.user as (IAdmin | IUser);
    const { _id: authorId } = user;
    const blogPostData = req.body.blogPostData as BlogPostClientData;
    const { title, author, content, keywords = []  } = blogPostData;
    // tihs will need to be validated later //

    try {
      const createdBlogPost = await BlogPost.create({
        title, author: { authorId, name: author }, content, keywords, published: false, editedAt: new Date(), createdAt: new Date()
      });
      return res.status(200).json({
        responseMsg: "Created a blog post", createdBlogPost
      });
    } catch (error) {
      return this.generalErrorResponse(res, { status: 500, error });
    }
  }
  edit = async (req: Request, res: Response<EditBlogPostRes>): Promise<Response<EditBlogPostRes>> => {
    const user = req.user as (IAdmin | IUser);
    const blogPostData = req.body.blogPostData as BlogPostClientData;
    const { title, content, keywords = [], published } = blogPostData;
    // tihs will need to be validated later //
    try {
      const editedBlogPost: IBlogPost | null = await BlogPost.findOneAndUpdate({
        title, content, keywords, published, editedAt: new Date()
      })
      return res.status(200).json({
        responseMsg: "Created post", editedBlogPost
      });
    } catch (error) {
      return this.generalErrorResponse(res, { status: 500, error });
    }
  }
  delete(req: Request, res: Response): Promise<Response<DeleteBlogPostRes>> {
    const { post_id } = req.params;
    if (!post_id) return this.generalErrorResponse(res, { status: 400, error: new Error("Could not resolve blog post to delete") });

    return BlogPost.findOneAndDelete({ _id: post_id }).exec()
      .then((deletedBlogPost) => {
        return res.status(200).json({
          responseMsg: "Blog post deleted", deletedBlogPost
        });
      })
      .catch((error) => this.generalErrorResponse(res, { error }) );
  }

  toggleLikeBlogPost = async (req: Request, res: Response<LikeBlogPostRes | BlogPostErrRes>): Promise<Response<LikeBlogPostRes | BlogPostErrRes>> => {
    const { post_id } = req.params;
    const user = req.user as IUser | IAdmin;
    let editedBlogPost: IBlogPost;
    // validate correct data first //
    if (!post_id) return await this.userInputErrorResponse(res, [ "Could not resolve blog post id" ]);
    if (!user) return await this.generalErrorResponse(res, { status: 401, errorMessages: [ "Could not resolve user" ] });

    try {
      const { _id: userId } = user;
      const blogPost = await BlogPost.findById({ _id: post_id }).exec()
      if (!blogPost) return await this.notFoundErrorResponse(res, [ "Blog Post data was not found" ]);
      // resolve the line/unlike action //
      if (blogPost.likes.includes(userId)) {
        editedBlogPost = await BlogPost.findOneAndUpdate({ _id: post_id }, { $pull: { likes: userId }, $inc: { numOflikes: -1 } }, { new: true } ).exec();
        return res.status(200).json({
          responseMsg: "Unliked a blog post", editedBlogPost
        });
      } else {
        editedBlogPost =await BlogPost.findOneAndUpdate({ _id: post_id }, { $push: { likes: userId }, $inc: { numOflikes: 1 } }, { new: true } ).exec();
        return res.status(200).json({
          responseMsg: "Liked a blog post", editedBlogPost
        });
      }
    } catch (error) {
      this.generalErrorResponse(res, { error, errorMessages: ["Server error occured" ] });
    }
  }

  // helpers //
  private authorizeBlogPost = (res: Response) => {

  }

  private isAdminOrOwner = (user: IAdmin | IUser | undefined): boolean => {
    if (!user) return false;
    if (user.hasOwnProperty("role")) {
      const { role } = user as IAdmin;
      return role === "admin" || role === "owner";
    } else {
    return false;
    }
  };
}