import BlogPost from "../models/BlogPost";
import Admin from "../models/Admin";
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
//

export default class BlogPostsController extends BasicController implements ICRUDController {
  index = async (req: Request, res: Response<IndexBlogPostRes>): Promise<Response<IndexBlogPostRes>> => {
    const { limit = 10, category = "all", createdAt = "asc", publishedStatus = "published", byUser, userId } = req.query as FetchBlogPostsOpts;
    // check for a user and admin //
    const { isAdmin, loggedIn  } = this.checkLogin(req.user as (IAdmin | IUser));
    let blogPosts: IBlogPost[];
    // TODO //
    // implement helper methods to cut down on repetiteveness //
    console.log(20)
    console.log(isAdmin, loggedIn)
    try {
      if (loggedIn) {
        if (isAdmin) {
          // admin or higher is logged in, additional privileges apply //
          if (byUser && userId) {
            // can see both published and unpublished posts belonging to any user //
            blogPosts = await BlogPost
              .find({ "author.authorId": userId })
              .byPublishedStatus(publishedStatus).byCategory(category)
              .sort({ createdAt }).limit(limit)
              .exec();
          } else {
            console.log(34)
            blogPosts = await BlogPost
              .find({})
              .byPublishedStatus(publishedStatus).byCategory(category)
              .sort({ createdAt }).limit(limit)
              .exec();
          }
        } else {
          // logged in but not admin //
          // can only see published posts //
          // unless the post belongs to the logged in user //
          const { _id: loggedInUserId } = req.user as IUser;
          if (byUser && userId) {
            if (loggedInUserId.equals(userId)) {
              // own posts - can see both published and unpublished //
              blogPosts = await BlogPost
                .find({ "author.authorId": userId })
                .byPublishedStatus(publishedStatus).byCategory(category)
                .sort({ createdAt }).limit(limit)
                .exec();
            } else {
              // not own posts can only see published //
              blogPosts = await BlogPost
                .find({ "author.authorId": userId })
                .byPublishedStatus('published').byCategory(category)
                .sort({ createdAt }).limit(limit)
                .exec();
            }
          } else {
            // can see all published //
            blogPosts = await BlogPost
              .find({})
              .byPublishedStatus("published").byCategory(category)
              .sort({ createdAt }).limit(limit)
              .exec()
          }
        }
      } else {
        // not logged in can only see unpublished posts //
        if (byUser && userId) {
          blogPosts = await BlogPost
            .find({ "author.authorId": userId })
            .byPublishedStatus("published").byCategory(category)
            .sort({ createdAt }).limit(limit)
            .exec();
        } else {
          blogPosts = await BlogPost
            .find({})
            .byPublishedStatus("published").byCategory(category)
            .sort({ createdAt }).limit(limit)
            .exec();
        }
      }
      return res.status(200).json({
        responseMsg: "Fetched blog posts", blogPosts
      });
    } catch (error) {
      console.log(error);
      return await this.generalErrorResponse(res, { error, errorMessages: [ "Error fetching blog posts" ] });
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

  // middleware to check post_id and user permissions should be run before controller method //
  edit = async (req: Request, res: Response<EditBlogPostRes>): Promise<Response<EditBlogPostRes>> => {
    const { post_id } = req.params;
    const blogPostData = req.body.blogPostData as BlogPostClientData;
    const { title, content, keywords = [], published } = blogPostData;
    // tihs will need to be validated later //
    try {
      const editedBlogPost: IBlogPost | null = await BlogPost.findOneAndUpdate(
        { _id: post_id },
        { title, content, keywords, published, editedAt: new Date() },
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

  private checkLogin = (user: IAdmin | IUser | null): { loggedIn: boolean; isAdmin: boolean; } => {
    if (!user) return { loggedIn: false, isAdmin: false };
    if (user && user instanceof Admin) {
      // admin user present //
      return { loggedIn: true, isAdmin: true }; 
    } else {
      return { loggedIn: true, isAdmin: false };
    }
  };

}