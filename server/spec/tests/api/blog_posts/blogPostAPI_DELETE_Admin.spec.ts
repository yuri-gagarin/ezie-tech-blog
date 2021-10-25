// test tooling //
import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
// models //
// server //
import ServerPromise from "../../../../src/server";
// models //
import Admin from "../../../../src/models/Admin";
import User from "../../../../src/models/User";
import BlogPost from "../../../../src/models/BlogPost";
// helpers //
import { generateMockBlogPosts, generateMockAdmins, generateMockUsers } from "../../../../src/_helpers/mockDataGeneration";
import { loginUser, countBlogPosts, generateMockPostData } from "../../../hepers/testHelpers";
// types //
import type { Express } from "express";
import type { Server } from "@/server/src/server";
import type { IAdmin } from "@/server/src/models/Admin";
import type { IUser } from "@/server/src/models/User";
import type { BlogPostClientData } from "@/server/src/_types/blog_posts/blogPostTypes";
import type { CreateBlogPostRes, BlogPostData, DeleteBlogPostRes, ErrorBlogPostRes } from "@/redux/_types/blog_posts/dataTypes";
import { IBlogPost } from "@/server/src/models/BlogPost";

chai.use(chaiHTTP);

describe("BlogPost Admin logged in API tests DELETE tests", function() {
  this.timeout(10000);
  let serverInstance: Server;
  let server: Express;
  let numberOfPosts: number; 
  let numberOfAdminPosts: number;
  let numberOfOtherUserPosts: number;
  let adminUser: IAdmin; 
  let adminUserPost: IBlogPost;
  let adminUserToken: string;
  //
  let otherUser: IUser;
  let otherUserPost: IBlogPost;
  let _deletedBlogPost: BlogPostData;

  // set up server, DB and create admins //
  before(async () => {
    try {
      serverInstance = await ServerPromise;
      server = serverInstance.getExpressServer();
      await generateMockAdmins(1);
      await generateMockUsers(1);
      adminUser = await Admin.findOne({});
      otherUser = await User.findOne({});
    } catch (error) {
      throw(error);
    }
  });
  // create blog post models //
  before(async() => {
    try {
      const adminId: string = adminUser._id.toHexString();
      const otherUserId: string = otherUser._id.toHexString();
      // generate mock data //
      await generateMockBlogPosts({ number: 10, user: adminUser });
      await generateMockBlogPosts({ number: 10, user: otherUser });
      // get model counts //
      numberOfPosts = await countBlogPosts({});
      numberOfAdminPosts = await countBlogPosts({ specificUserId: adminId });
      numberOfOtherUserPosts = await countBlogPosts({ specificUserId: otherUserId });
      // get models //
      adminUserPost = await BlogPost.findOne({ "author.authorId": adminId });
      otherUserPost = await BlogPost.findOne({ "author.authorId": otherUserId });
      //
    } catch (error) {
      throw error;
    }
  });
  // login admin //
  before(async () => {
    try {
      const { email } = adminUser;
      const { userJWTToken } = await loginUser({ chai, server, email });
      adminUserToken = userJWTToken;
    } catch (error) {
      throw error;
    }
  });
  
  // CONTEXT POST API Tests with valid data //
  context("DELETE API Tests with valid data", () => {
    // DELETE TESTS on own model //
    describe("DELETE /api/posts/:post_id --- own model" , () => {
      it("Should correctly DELETE an existing <BlogPost> model and send back correct response", (done) => {
        chai.request(server)
          .delete("/api/posts/" + ( adminUserPost._id.toHexString() ))
          .set({ Authorization: adminUserToken })
          .end((error, response) => {
            if (error) done(error);
            const { responseMsg, deletedBlogPost } = response.body as DeleteBlogPostRes;
            expect(response.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(deletedBlogPost).to.be.an("object");
            // 
            _deletedBlogPost = deletedBlogPost;
            done();
          });
      });
      it("Should correctly remove the queried <BlogPost> model from the database", async () => {
        try {
          const deletedModel: IBlogPost | null = await BlogPost.findById(_deletedBlogPost._id);
          expect(deletedModel).to.be.null;
        } catch (error) {
          throw error;
        }
      });
      it("Should correctly decrement the number of Admins <BlogPost> model by 1", async () => {
        try {
          const updatedNumOfAdminPosts: number = await countBlogPosts({ specificUserId: adminUser._id.toHexString() });
          expect(updatedNumOfAdminPosts).to.equal(numberOfAdminPosts -  1);
          //
          numberOfAdminPosts = updatedNumOfAdminPosts;
        } catch (error) {
          throw error;
        }
      });
      it("Should correctly decrement the total number of <BlogPost> model by 1", async () => {
        try {
          const updatedNumOfTotalPosts: number = await countBlogPosts({});
          expect(updatedNumOfTotalPosts).to.equal(numberOfPosts - 1);
          //
          numberOfPosts = updatedNumOfTotalPosts;
        } catch (error) {
          throw error;
        }
      });
    });
    // END DELETE tests own model //
    // DELETE Tests other Users model //
    describe("DELETE /api/posts/:post_id --- other users model" , () => {
      it("Should correctly DELETE an existing <BlogPost> model and send back correct response", (done) => {
        chai.request(server)
          .delete("/api/posts/" + ( otherUserPost._id.toHexString() ))
          .set({ Authorization: adminUserToken })
          .end((error, response) => {
            if (error) done(error);
            const { responseMsg, deletedBlogPost } = response.body as DeleteBlogPostRes;
            expect(response.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(deletedBlogPost).to.be.an("object");
            // 
            _deletedBlogPost = deletedBlogPost;
            done();
          });
      });
      it("Should correctly remove the queried <BlogPost> model from the database", async () => {
        try {
          const deletedModel: IBlogPost | null = await BlogPost.findById(_deletedBlogPost._id);
          expect(deletedModel).to.be.null;
        } catch (error) {
          throw error;
        }
      });
      it("Should correctly decrement the number of Admins <BlogPost> model by 1", async () => {
        try {
          const updatedNumOfOtherUserPosts: number = await countBlogPosts({ specificUserId: otherUser._id.toHexString() });
          expect(updatedNumOfOtherUserPosts).to.equal(numberOfOtherUserPosts -  1);
          //
          numberOfOtherUserPosts = updatedNumOfOtherUserPosts;
        } catch (error) {
          throw error;
        }
      });
      it("Should correctly decrement the total number of <BlogPost> model by 1", async () => {
        try {
          const updatedNumOfTotalPosts: number = await countBlogPosts({});
          expect(updatedNumOfTotalPosts).to.equal(numberOfPosts - 1);
          //
          numberOfPosts = updatedNumOfTotalPosts;
        } catch (error) {
          throw error;
        }
      });
    });
    // END DELETE tests other users model //
  });
  // END CONTEXT DELETE API Tests with valid data //

  // CONTEXT POST API Tests with invalid data //
  context("DELETE /api/posts/:post_id - invalid data", () =>  {
    // DELETE no post_id param //
    describe("DELETE /api/posts/:post_id --- no 'post_id' param present", () => {
      it("Should NOT DELETE an existing <BlogPost> model and send back correct response", (done) => {
        chai.request(server)
          .delete("/api/posts/" + "" )
          .set({ Authorization: adminUserToken })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, error, errorMessages } = response.body as DeleteBlogPostRes;
            expect(response.status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            // 
            expect(response.body.deletedBlogPost).to.be.undefined;
            done();
          });
      });
      it("Should NOT alter the number of <BlogPost> model in the database", async () => {
        try {
          const updatedNumOfTotalPosts: number = await countBlogPosts({});
          const updatedNumOfAdminPosts: number = await countBlogPosts({ specificUserId: adminUser._id.toHexString() });
          //
          expect(updatedNumOfTotalPosts).to.equal(numberOfPosts);
          expect(updatedNumOfAdminPosts).to.equal(numberOfAdminPosts);
        } catch (error) {
          throw error;
        }
      });
    });
    // END DELETE no post_id param //
    // DELETE INVALID 'post_id' param //
    describe("DELETE /api/posts/:post_id --- INVALID 'post_id' param type present", () => {
      it("Should NOT DELETE an existing <BlogPost> model and send back correct response", (done) => {
        chai.request(server)
          .delete("/api/posts/" + "" )
          .set({ Authorization: adminUserToken })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, error, errorMessages } = response.body as DeleteBlogPostRes;
            expect(response.status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            // 
            expect(response.body.deletedBlogPost).to.be.undefined;
            done();
          });
      });
      it("Should NOT alter the number of <BlogPost> model in the database", async () => {
        try {
          const updatedNumOfTotalPosts: number = await countBlogPosts({});
          const updatedNumOfAdminPosts: number = await countBlogPosts({ specificUserId: adminUser._id.toHexString() });
          //
          expect(updatedNumOfTotalPosts).to.equal(numberOfPosts);
          expect(updatedNumOfAdminPosts).to.equal(numberOfAdminPosts);
        } catch (error) {
          throw error;
        }
      });
    });
    // DELETE INVALID 'post_id' param //
  });
  // END CONTEXT POST API Tets with invalid data //
});