// test tooling //
import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
// models //
// server //
import { ServerInstance } from "@/server/src/server";
// models //
import Admin from "@/server/src/models/Admin";
import User from "@/server/src/models/User";
import BlogPost from "@/server/src/models/BlogPost";
// helpers //
import { generateMockBlogPosts, generateMockAdmins, generateMockUsers } from "@/server/src/_helpers/mockDataGeneration";
import { loginUser, countBlogPosts, generateMockPostData } from "../../../hepers/testHelpers";
// types //
import type { Express } from "express";
import type { IAdmin } from "@/server/src/models/Admin";
import type { IUser } from "@/server/src/models/User";
import type { IBlogPost } from "@/server/src/models/BlogPost";
import type { BlogPostData, DeleteBlogPostRes, ErrorBlogPostRes } from "@/redux/_types/blog_posts/dataTypes";

chai.use(chaiHTTP);

describe("BlogPostsController:Delete DELETE API Tests", function() {
  this.timeout(10000);
  let server: Express;
  // counts ./
  let numberOfPosts: number; 
  // users models //
  let adminUser: IAdmin; 
  let readerUser: IUser;
  let contributorUser: IUser;
  let otherContributorUser: IUser;
  //
  let adminUsersPost: IBlogPost;
  let contributorsPost: IBlogPost;
  let otherContributorsPost: IBlogPost;
  // tokens //
  let adminUserToken: string;
  let readerUserToken: string;
  let contributorUserToken: string;
  //

  // set up server, DB and create admins //
  before(async () => {
    try {
      server = ServerInstance.getExpressServer();
      //
      await generateMockAdmins(1);
      await generateMockUsers({ number: 1, confirmed: true, type: "READER" });
      await generateMockUsers({ number: 2, confirmed: true, type: "CONTRIBUTOR" });
      //
      adminUser = await Admin.findOne({});
      readerUser = await User.findOne({ userType: "READER" });
      // 
      const contributors: IUser[] = await User.find({ userType: "CONTRIBUTOR" });
      ([ contributorUser, otherContributorUser ] = contributors);
      //
    } catch (error) {
      throw(error);
    }
  });
  // create blog post models //
  before(async() => {
    try {
      const adminId: string = adminUser._id.toHexString();
      const contributorUserId: string = contributorUser._id.toHexString();
      const otherContributorUserId: string = otherContributorUser._id.toHexString();
      // generate mock data //
      await generateMockBlogPosts({ number: 10, user: adminUser });
      await generateMockBlogPosts({ number: 10, user: contributorUser });
      await generateMockBlogPosts({ number: 10, user: otherContributorUser });
      // get model counts //
      numberOfPosts = await countBlogPosts({});
      // get models //
      adminUsersPost = await BlogPost.findOne({ "author.authorId": adminId });
      contributorsPost = await BlogPost.findOne({ "author.authorId": contributorUserId });
      otherContributorsPost = await BlogPost.findOne({ "author.authorId": otherContributorUserId });
      //
    } catch (error) {
      throw error;
    }
  });
  // login admin //
  before(async () => {
    try {
      const { email: adminEmail } = adminUser;
      const { email: readerEmail } = readerUser;
      const { email: contributorEmail } = contributorUser;
      // login tokens //
      ({ userJWTToken: adminUserToken } = await loginUser({ chai, server, email: adminEmail }));
      ({ userJWTToken: readerUserToken } = await loginUser({ chai, server, email: readerEmail }));
      ({ userJWTToken: contributorUserToken } = await loginUser({ chai, server, email: contributorEmail }));
    } catch (error) {
      throw error;
    }
  });
  
  // CONTEXT DELETE API Tests NO Login //
  context("Guest Client - No Login", () => {
    let postId: string;

    before(() => {
      postId = contributorsPost._id.toHexString();
    });

    describe("DELETE /api/posts/:post_id - default response" , () => {
      it("Should NOT DELETE an existing <BlogPost> model and send back correct response", (done) => {
        chai.request(server)
          .delete(`/api/posts/${postId}` )
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes;
            expect(response.status).to.equal(401);
            // for now should be default passport js response //
            // expect(responseMsg).to.be.a("string");
            // 
            done();
          });
      });
      it("Should NOT remove the queried <BlogPost> model from the database", async () => {
        try {
          const deletedModel: IBlogPost | null = await BlogPost.findById(postId);
          //
          expect(deletedModel).to.not.be.null;
        } catch (error) {
          throw error;
        }
      });
      it("Should NOT alter the number of <BlogPost> models in the database", async () => {
        try {
          const updatedNumOfPosts: number = await BlogPost.countDocuments();
          expect(updatedNumOfPosts).to.equal(numberOfPosts);
        } catch (error) {
          throw error;
        }
      });
    });
  });
  // END CONTEXT DELETE API Tests NO Login //

  // CONTEXT DELETE API TESTS User Logged in READER account //
  context("User client - Logged In - READER account", () => {
    let postId: string;

    before(() => {
      postId = contributorsPost._id.toHexString();
    });

    describe("DELETE /api/posts/:post_id - default response" , () => {
      it("Should NOT DELETE an existing <BlogPost> model and send back correct response", (done) => {
        chai.request(server)
          .delete(`/api/posts/${postId}`)
          .set({ Authorization: readerUserToken })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes;
            expect(response.status).to.equal(401);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            // 
            done();
          });
      });
      it("Should NOT remove the queried <BlogPost> model from the database", async () => {
        try {
          const deletedModel: IBlogPost | null = await BlogPost.findById(postId);
          //
          expect(deletedModel).to.not.be.null;
        } catch (error) {
          throw error;
        }
      });
      it("Should NOT alter the number of <BlogPost> models in the database", async () => {
        try {
          const updatedNumOfPosts: number = await BlogPost.countDocuments();
          expect(updatedNumOfPosts).to.equal(numberOfPosts);
        } catch (error) {
          throw error;
        }
      });
    });
  });
  // END CONTEXT DELETE API TESTS User Logged in READER account //

  // CONTEXT DELETE API TESTS User Logged in CONTRIBUTOR account //
  context("User client - Logged In - CONTRIBUTOR account", () => {
    let postId: string;
    let otherUsersPostId: string;
    before(() => {
      postId = contributorsPost._id.toHexString();
      otherUsersPostId = otherContributorsPost._id.toHexString();
    });

    describe("DELETE /api/posts/:post_id - OTHER Users model -  default response" , () => {
      it("Should NOT DELETE an existing <BlogPost> model and send back correct response", (done) => {
        chai.request(server)
          .delete(`/api/posts/${otherUsersPostId}`)
          .set({ Authorization: contributorUserToken })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes;
            expect(response.status).to.equal(401);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            // 
            done();
          });
      });
      it("Should NOT remove the queried <BlogPost> model from the database", async () => {
        try {
          const deletedModel: IBlogPost | null = await BlogPost.findById(otherUsersPostId);
          //
          expect(deletedModel).to.not.be.null;
        } catch (error) {
          throw error;
        }
      });
      it("Should NOT alter the number of <BlogPost> models in the database", async () => {
        try {
          const updatedNumOfPosts: number = await BlogPost.countDocuments();
          expect(updatedNumOfPosts).to.equal(numberOfPosts);
        } catch (error) {
          throw error;
        }
      });
    });
    describe("DELETE /api/posts/:post_id - OWN model -  default response" , () => {
      let _deletedBlogPost: BlogPostData;
      it("Should correctly DELETE an existing <BlogPost> model and send back correct response", (done) => {
        chai.request(server)
          .delete(`/api/posts/${postId}`)
          .set({ Authorization: contributorUserToken })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, deletedBlogPost, error, errorMessages } = response.body as DeleteBlogPostRes;
            expect(response.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(deletedBlogPost).to.be.an("object");
            //
            expect(error).to.be.undefined;
            expect(errorMessages).to.be.undefined;
            // 
            _deletedBlogPost = deletedBlogPost;
            done();
          });
      });
      it("Should remove the queried <BlogPost> model from the database", async () => {
        try {
          const deletedPostId: string = _deletedBlogPost._id;
          const deletedModel: IBlogPost | null = await BlogPost.findById(deletedPostId);
          //
          expect(deletedModel).to.be.null;
        } catch (error) {
          throw error;
        }
      });
      it("Should DECREMENT the number of <BlogPost> models in the database by 1", async () => {
        try {
          const updatedNumOfPosts: number = await BlogPost.countDocuments();
          expect(updatedNumOfPosts).to.equal(numberOfPosts - 1);
          //
          numberOfPosts = updatedNumOfPosts;
        } catch (error) {
          throw error;
        }
      });
    });
  });
  // END CONTEXT DELETE API TESTS User Logged in READER account //

  // CONTEXT DELETE API TESTS Admin Logged in with ADMIN privileges //
  context("Admin client - Logged In - ADMIN account", () => {
    let adminsPostId: string;
    let otherUsersPostId: string;
    before(() => {
      adminsPostId = adminUsersPost._id.toHexString();
      otherUsersPostId = otherContributorsPost._id.toHexString();
    });

    describe("DELETE /api/posts/:post_id - OTHER Users model -  default response" , () => {
      let _deletedBlogPost: BlogPostData;
      it("Should correctly DELETE an existing <BlogPost> model and send back correct response", (done) => {
        chai.request(server)
          .delete(`/api/posts/${otherUsersPostId}`)
          .set({ Authorization: adminUserToken })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, deletedBlogPost, error, errorMessages } = response.body as DeleteBlogPostRes;
            expect(response.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(deletedBlogPost).to.be.an("object");
            //
            expect(error).to.be.undefined;
            expect(errorMessages).to.be.undefined;
            // 
            _deletedBlogPost = deletedBlogPost;
            done();
          });
      });
      it("Should remove the queried <BlogPost> model from the database", async () => {
        try {
          const deletedPostId: string = _deletedBlogPost._id;
          const deletedModel: IBlogPost | null = await BlogPost.findById(deletedPostId);
          //
          expect(deletedModel).to.be.null;
        } catch (error) {
          throw error;
        }
      });
      it("Should DECREMENT the number of <BlogPost> models in the database by 1", async () => {
        try {
          const updatedNumOfPosts: number = await BlogPost.countDocuments();
          expect(updatedNumOfPosts).to.equal(numberOfPosts - 1);
          //
          numberOfPosts = updatedNumOfPosts;
        } catch (error) {
          throw error;
        }
      });
    });
    describe("DELETE /api/posts/:post_id - OWN model -  default response" , () => {
      let _deletedBlogPost: BlogPostData;
      it("Should correctly DELETE an existing <BlogPost> model and send back correct response", (done) => {
        chai.request(server)
          .delete(`/api/posts/${adminsPostId}`)
          .set({ Authorization: adminUserToken })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, deletedBlogPost, error, errorMessages } = response.body as DeleteBlogPostRes;
            expect(response.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(deletedBlogPost).to.be.an("object");
            //
            expect(error).to.be.undefined;
            expect(errorMessages).to.be.undefined;
            // 
            _deletedBlogPost = deletedBlogPost;
            done();
          });
      });
      it("Should remove the queried <BlogPost> model from the database", async () => {
        try {
          const deletedPostId: string = _deletedBlogPost._id;
          const deletedModel: IBlogPost | null = await BlogPost.findById(deletedPostId);
          //
          expect(deletedModel).to.be.null;
        } catch (error) {
          throw error;
        }
      });
      it("Should DECREMENT the number of <BlogPost> models in the database by 1", async () => {
        try {
          const updatedNumOfPosts: number = await BlogPost.countDocuments();
          expect(updatedNumOfPosts).to.equal(numberOfPosts - 1);
          //
          numberOfPosts = updatedNumOfPosts;
        } catch (error) {
          throw error;
        }
      });
    });
  });
  // END CONTEXT DELETE API TESTS Admin Logged in with ADMIN privileges //
  after(async () => {
    try {
      await Admin.deleteMany({});
      await User.deleteMany({});
      await BlogPost.deleteMany({});
    } catch (error) {
      console.log(error);
    }
  });
});