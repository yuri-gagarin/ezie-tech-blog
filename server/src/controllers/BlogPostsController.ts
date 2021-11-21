// models //
import BlogPost from "../models/BlogPost";
import Admin from "../models/Admin";
import User from "../models/User";
import { BasicController } from "../_types/abstracts/DefaultController";
// types //
import type { Request, Response } from "express";
import type { IBlogPost } from "../models/BlogPost";
import type { ICRUDController } from "../_types/abstracts/DefaultController";
import type { BlogPostClientData, IndexBlogPostRes, OneBlogPostRes, CreateBlogPostRes, EditBlogPostRes, DeleteBlogPostRes, FetchBlogPostsOpts, LikeBlogPostRes, BlogPostErrRes } from "../_types/blog_posts/blogPostTypes";
import type { IUser } from "../models/User";
import type { IAdmin } from "../models/Admin";
// helpers //
import { BlogPostNotAllowedError } from "./_helpers/blogPostControllerHelpers";
import {  objectIsEmtpy } from "./_helpers/generalHelpers";
import { validateBlogPostModelData } from "./_helpers/validationHelpers";
//

export default class BlogPostsController extends BasicController implements ICRUDController {
  index = async (req: Request, res: Response<IndexBlogPostRes>): Promise<Response<IndexBlogPostRes>> => {
    const { limit = "10", category = "all", createdAt = "desc", publishedStatus = "published", byUser = false, userId = "" } = req.query as FetchBlogPostsOpts;
    const user = req.user as IUser | IAdmin | null;
    // check for a user and admin //
    let blogPosts: IBlogPost[];
    try {
      if (objectIsEmtpy(req.query)) {
        return this.processGetAllDefault(res);
      }
      else if (byUser && userId) {
        return this.processGetAllByUser(req, res);
      }
      else {
        return this.processGetAllWithOptions(req, res);
      }
    } catch (error) {
      return this.generalErrorResponse(res, { error });
    }
 
  }

  getOne = async (req: Request, res: Response<OneBlogPostRes>): Promise<Response<OneBlogPostRes>> => {
    const { post_id } = req.params;
    const { searchBySlug } = req.query;
    const user = req.user as IAdmin | IUser | null;
    // check login //
    let blogPost: IBlogPost;
  
    if (!post_id) {
      return await this.generalErrorResponse(res, { status: 400, error: new Error("Could not resolve post") });
    }

    if (searchBySlug) {
      // the post_id is actually a slug //
      try {
        blogPost = await BlogPost.findOne({ slug: post_id }).exec();
      } catch (error) {
        return await this.generalErrorResponse(res, { errorMessages: [ "Something went wrong retrieving the post" ] });
      }
    } else {
    // general response to get it by id //
      try {
        blogPost = await BlogPost.findOne({ _id: post_id }).exec()
      } catch (error) {
        return await this.generalErrorResponse(res, { error });
      }
    }

    if (blogPost) {
      // make sure client is authorized to see the post //
      try { 
        if (this.authorizeBlogPostGet({ blogPost, user })) {
          return res.status(200).json({
            responseMsg: "Fetched blog post", blogPost
          });
        } else {
          return this.notAllowedErrorResponse(res, [ "Not authorized to view post" ]);
        }
      }
      catch (error) {
        return this.generalErrorResponse(res, { error });
      }
    } else {
      return this.notFoundErrorResponse(res, [ "Blog Post not found"]);
    }
  }

  // AT the moment only Admin level users and Users with CONTRIBUTOR status can create new Blog Posts //
  // Relavant middleware to check permissions should be ran before method //
  create = async (req: Request, res: Response<CreateBlogPostRes>): Promise<Response<CreateBlogPostRes>> => {
    const user = req.user as (IAdmin | IUser);
    const { _id: authorId } = user;
    const blogPostData = req.body.blogPostData as BlogPostClientData;
  
    if (!blogPostData) return this.userInputErrorResponse(res, ["Could not resolve new Blog Post data" ]);
    // validate  incoming data //
    const { valid, errorMessages } = validateBlogPostModelData(blogPostData);
    if (!valid) return this.userInputErrorResponse(res, errorMessages);

    // assuming everything got validated //
    try {
      const { title, author, content, category, keywords = []  } = blogPostData;
      const createdBlogPost = await BlogPost.create({
        title, author: { authorId, name: author.name }, content, category, keywords, published: false, editedAt: new Date(), createdAt: new Date()
      });
      return res.status(200).json({
        responseMsg: "Created a blog post", createdBlogPost
      });
    } catch (error) {
      return this.generalErrorResponse(res, { status: 500, error });
    }
  }

  // middleware to check post_id and user permissions should be run before controller method //
  edit = async (req: Request, res: Response<EditBlogPostRes>): Promise<Response<EditBlogPostRes>> => {
    const { post_id } = req.params;
    const blogPostData = req.body.blogPostData as BlogPostClientData;
    if (!blogPostData) return this.userInputErrorResponse(res, ["Could not resolve new Blog Post data" ]);

    // tihs will need to be validated later //
    // validate  incoming data //
    const { valid, errorMessages } = validateBlogPostModelData(blogPostData);
    if (!valid) return this.userInputErrorResponse(res, errorMessages);
    //
    try {
      const { title, content, keywords = [], category = "informational", published } = blogPostData;
      const editedBlogPost: IBlogPost | null = await BlogPost.findOneAndUpdate(
        { _id: post_id },
        { title, content, keywords, category, published, editedAt: new Date() },
        { new: true }
      ).exec();
      if (editedBlogPost) {
        return res.status(200).json({
          responseMsg: "Created post", editedBlogPost
        });
      } else {
        return await this.notFoundErrorResponse(res, [ "Blog Post to update could not be found" ]);
      }
    } catch (error) {
      return this.generalErrorResponse(res, { status: 500, error });
    }
  }
  // middleware to check post_id and user permissions runs before controller method //
  delete = async(req: Request, res: Response<DeleteBlogPostRes>): Promise<Response<DeleteBlogPostRes>> => {
    const { post_id } = req.params;

    try {
      const deletedBlogPost: IBlogPost | null = await BlogPost.findOneAndDelete({ _id: post_id }).exec();
      if (deletedBlogPost) {
        return res.status(200).json({
          responseMsg: "Blog post deleted", deletedBlogPost
        });
      } else {
        return await this.notFoundErrorResponse(res, [ "Blog Post to delete could not be found" ]);
      }
    } catch (error) {
      return await this.generalErrorResponse(res, { error });
    }
  }

  toggleLikeBlogPost = async (req: Request, res: Response<LikeBlogPostRes | BlogPostErrRes>): Promise<Response<LikeBlogPostRes | BlogPostErrRes>> => {
    const { post_id } = req.params;
    const user = req.user as IUser | IAdmin;
    let editedBlogPost: IBlogPost;
    // validate correct data first //

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
  private authorizeBlogPostGet = ({ blogPost, user }: { blogPost: IBlogPost, user: IAdmin | IUser | null }): boolean => {
    if (blogPost.published) {
      // anyone can see a published post //
      return true;
    } else {
      if (user) {
        const { isAdmin } = this.checkLogin(user);
        if (isAdmin) {
          // can see all with current settings //
          return true;
        } else {
          const { _id: currentUserId } = user;
          const { authorId } = blogPost.author;
          if (currentUserId.equals(authorId)) {
            return true;
          } else {
            return false;
          }
        }
      } else {
        // can only see published posts //
        return false;
      }
    }
  }

  private processGetAllDefault = async (res: Response<IndexBlogPostRes>): Promise<Response<IndexBlogPostRes>> => {
    try {
      const blogPosts = await BlogPost.find({}).byPublishedStatus("published").sort({ createdAt: - 1 }).limit(10)
      return res.status(200).json({
        responseMsg: "Fetched posts", blogPosts
      })
    } catch (error) {
      throw error;
    }
  }
  private processGetAllWithOptions = async (req: Request, res: Response<IndexBlogPostRes>): Promise<Response<IndexBlogPostRes>> => {
    const { limit = "10", category = "all", createdAt = "asc", publishedStatus = "published" } = req.query as FetchBlogPostsOpts;
    const user = req.user as IAdmin | IUser | null;
    let blogPosts: IBlogPost[];
    const { loggedIn, isAdmin } = this.checkLogin(user);
    
    if (loggedIn && isAdmin) {
      blogPosts = await BlogPost.find({}).byPublishedStatus(publishedStatus).byCategory(category).sort({ createdAt }).limit(parseInt(limit));
      console.log(233)
      console.log(req.query);
      console.log(blogPosts.length)
    } else {
      // can only see published posts //
      if (publishedStatus === "published") {
        blogPosts = await BlogPost.find({}).byPublishedStatus(publishedStatus).byCategory(category).sort({ createdAt }).limit(parseInt(limit));
        console.log(blogPosts.length)
      } else {
        return this.notAllowedErrorResponse(res, [ "Not allowed to fetch this Blog Post query" ]);
      }
    }    
    return res.status(200).json({
      responseMsg: "Fetched blog posts", blogPosts
    });
  } 
  private processGetAllByUser = async (req: Request, res: Response<IndexBlogPostRes>):  Promise<Response<IndexBlogPostRes>> => {
    const { limit = "10", category = "all", createdAt = "asc", publishedStatus = "published", userId } = req.query as FetchBlogPostsOpts;
    const user = req.user as IAdmin | IUser | null;
    let blogPosts: IBlogPost[];

    const { loggedIn, isAdmin } = this.checkLogin(user);
  
    if (loggedIn && isAdmin) {
      // access to all blog posts //
      blogPosts = await (
        BlogPost
          .find({"author.authorId": userId })
          .byPublishedStatus(publishedStatus).byCategory(category)
          .sort({ createdAt }).limit(parseInt(limit))
      );
    } else if (loggedIn && !isAdmin) {
      const { _id: loggedInUserId } = user._id
      if (loggedInUserId.equals(userId)) {
        // fetching own posts, can see all //
        blogPosts = await (
          BlogPost
            .find({"author.authorId": userId })
            .byPublishedStatus(publishedStatus).byCategory(category)
            .sort({ createdAt }).limit(parseInt(limit))
        );
      } else {
        // not fetching own posts, can only see published //
        if (publishedStatus === "published" || publishedStatus === "all") {
          blogPosts = await (
            BlogPost
              .find({"author.authorId": userId })
              .byPublishedStatus(publishedStatus).byCategory(category)
              .sort({ createdAt }).limit(parseInt(limit))
          );
        } else {
          return this.notAllowedErrorResponse(res, [ "Not authorized to fetch this query" ]);
        }
      }
    } else {
      // not logged in can only see published //
      if (publishedStatus === "published" || publishedStatus === "all") {
        blogPosts = await (
          BlogPost
            .find({"author.authorId": userId })
            .byPublishedStatus(publishedStatus).byCategory(category)
            .sort({ createdAt }).limit(parseInt(limit))
        );
      } else {
        return this.notAllowedErrorResponse(res, [ "Not authorized to fetch this query" ]);
      }
    }

    return res.status(200).json({
      responseMsg: "Fetched posts", blogPosts
    });
  }

  private checkLogin = (user: any): { loggedIn: boolean; isAdmin: boolean; } => {
    if (!user) return { loggedIn: false, isAdmin: false };
    if (user && user instanceof Admin) {
      // admin user present //
      return { loggedIn: true, isAdmin: true }; 
    } else if ( user && user instanceof User) {
      return { loggedIn: true, isAdmin: false };
    } else {
      return { loggedIn: false, isAdmin: false };
    }
  };

}