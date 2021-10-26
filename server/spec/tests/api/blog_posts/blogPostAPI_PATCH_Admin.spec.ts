// test tooling //
import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
// models //
// server //
import { ServerInstance } from "../../../../src/server";
// models //
import Admin from "../../../../src/models/Admin";
import User from "../../../../src/models/User";
import BlogPost from "../../../../src/models/BlogPost";
// helpers //
import { generateMockBlogPosts, generateMockAdmins, generateMockUsers } from "../../../../src/_helpers/mockDataGeneration";
import { loginUser, countBlogPosts, generateMockPostData } from "../../../hepers/testHelpers";
// types //
import type { Express } from "express";
import type { IAdmin } from "@/server/src/models/Admin";
import type { IUser } from "@/server/src/models/User";
import type { BlogPostClientData } from "@/server/src/_types/blog_posts/blogPostTypes";
import type { IBlogPost } from "@/server/src/models/BlogPost";
import type {  BlogPostData, EditBlogPostRes, ErrorBlogPostRes } from "@/redux/_types/blog_posts/dataTypes";

chai.use(chaiHTTP);

describe("BlogPost Admin logged in API tests PATCH tests", function() {
  this.timeout(10000);
  let server: Express;
  let numberOfPosts: number; 
  let adminUser: IAdmin;
  let adminUserToken: string;
  let otherUser: IUser;
  //
  let mockBlogPostData: BlogPostClientData;
  let adminUsersPost: IBlogPost;
  let otherUsersPost: IBlogPost;

  // set up server, DB and create admins //
  before(async () => {
    try {
      server = ServerInstance.getExpressServer();
      await generateMockAdmins(1);
      await generateMockUsers({ number: 1, confirmed: true });
      adminUser = await Admin.findOne({});
      otherUser = await User.findOne({});
      //await generateMockBlogPosts(10);
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
      adminUsersPost = await BlogPost.findOne({ "author.authorId": adminId });
      otherUsersPost = await BlogPost.findOne({ "author.authorId": otherUserId });
      //
      mockBlogPostData = generateMockPostData({ authorId: adminId, name: adminUser.firstName });
      // get model counts //
      numberOfPosts = await countBlogPosts({});
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

  // CONTEXT PATCH valid data //
  context("PATCH /api/posts/:post_id - valid data", () => {
    // CONTEXT PATCH own Blog Post model //
    context("PATCH /api/posts/:post_id - own <BlogPost> model", () => {
      describe("PATCH /api/posts/:post_id", () => {
        let _editedBlogPost: BlogPostData;

        it("Should correctly UPDATE an existing <BlogPost> model and send back correct response", (done) => {
          const blogPostId = adminUsersPost._id.toHexString();
          chai.request(server)
            .patch("/api/posts/" + blogPostId)
            .set({ Authorization: adminUserToken })
            .send({ blogPostData: mockBlogPostData })
            .end((error, response) => {
              if (error) done(error);
              const { responseMsg, editedBlogPost } = response.body as EditBlogPostRes;
              expect(response.status).to.equal(200);
              expect(responseMsg).to.be.a("string");
              expect(editedBlogPost).to.be.an("object");
              //
              _editedBlogPost = editedBlogPost;
              done();
            });
        });
        it("Should correctly set the fields on an edited <BlogPost> model", () => {
          expect(_editedBlogPost.title).to.equal(mockBlogPostData.title);
          expect(_editedBlogPost.author.authorId).to.equal(adminUser._id.toHexString());
          expect(_editedBlogPost.author.name).to.equal(adminUser.firstName);
          expect(_editedBlogPost.content).to.equal(mockBlogPostData.content)
          expect(_editedBlogPost.published).to.equal(false);
          expect(_editedBlogPost.keywords).to.eql(mockBlogPostData.keywords);
          expect(_editedBlogPost.category).to.equal(mockBlogPostData.category);
          expect(_editedBlogPost.createdAt).to.be.a("string");
          expect(_editedBlogPost.editedAt).to.be.a("string");
        });
        it("Should NOT change the number of <BlogPost> models", async () => {
          try {
            const updatedNumOfBlogPosts: number = await countBlogPosts({});
            expect(updatedNumOfBlogPosts).to.equal(numberOfPosts);
          } catch (error) {
            throw error;
          }
        });
      });
    });
    // END CONTEXT PATCH own Blog Post model //

    // CONTEXT PATCH other Users Blog Post model //
    context("PATCH /api/posts/:post_id - other users <BlogPost> model", () => {
      describe("PATCH /api/posts/:post_id", () => {
        let _editedBlogPost: BlogPostData;

        it("Should correctly UPDATE an existing <BlogPost> model and send back correct response", (done) => {
          const blogPostId = otherUsersPost._id.toHexString();
          chai.request(server)
            .patch("/api/posts/" + blogPostId)
            .set({ Authorization: adminUserToken })
            .send({ blogPostData: mockBlogPostData })
            .end((error, response) => {
              if (error) done(error);
              const { responseMsg, editedBlogPost } = response.body as EditBlogPostRes;
              expect(response.status).to.equal(200);
              expect(responseMsg).to.be.a("string");
              expect(editedBlogPost).to.be.an("object");
              //
              _editedBlogPost = editedBlogPost;
              done();
            });
        });
        it("Should correctly set the fields on an edited <BlogPost> model", () => {
          expect(_editedBlogPost.title).to.equal(mockBlogPostData.title);
          expect(_editedBlogPost.author.authorId).to.equal(otherUser._id.toHexString());
          expect(_editedBlogPost.author.name).to.equal(otherUser.firstName);
          expect(_editedBlogPost.content).to.equal(mockBlogPostData.content)
          expect(_editedBlogPost.published).to.equal(false);
          expect(_editedBlogPost.keywords).to.eql(mockBlogPostData.keywords);
          expect(_editedBlogPost.category).to.equal(mockBlogPostData.category);
          expect(_editedBlogPost.createdAt).to.be.a("string");
          expect(_editedBlogPost.editedAt).to.be.a("string");
        });
        it("Should NOT change the number of <BlogPost> models", async () => {
          try {
            const updatedNumOfBlogPosts: number = await countBlogPosts({});
            expect(updatedNumOfBlogPosts).to.equal(numberOfPosts);
          } catch (error) {
            throw error;
          }
        });
      });
    });
  });
  // END CONTEXT PATCH valid data //
  // CONTEXT PATCH invalid data //
  context("PATCH /api/posts/:post_id - invalid data", () => {
    // PATCH /api/posts/:post_id ivalid title //
    let postId: string;
    before(() => {
      postId = adminUsersPost._id.toHexString();
    })
    describe("PATCH /api/posts/:post_id - invalid <BlogPost.title>", () => {
      it("Should NOT update an existing <BlogPost> model without a <title> field and return a correct response", (done) => {
        chai.request(server)
          .patch("/api/posts/" + postId)
          .set({ Authorization: adminUserToken })
          .send({ blogPostData: { ...adminUsersPost, title: "" } })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes;
            expect(response.status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            done();
        });
      });
      it("Should NOT create a new <BlogPost> model with an invalid <title> TYPE field and return a correct response", (done) => {
        chai.request(server)
          .patch("/api/posts/" + postId)
          .set({ Authorization: adminUserToken })
          .send({ blogPostData: { ...adminUsersPost, title: {} } })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes;
            expect(response.status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            done();
        });
      });
    });
    // END PATCH /api/posts/:post_id invalid title //
    // PATCH invalid author field //
    describe("PATCH /api/posts/:post_id - invalid <BlogPost.author>", () => {
      it("Should NOT update an existing <BlogPost> model without an <author> field and return a correct response", (done) => {
        chai.request(server)
          .patch("/api/posts/" + postId)
          .set({ Authorization: adminUserToken })
          .send({ blogPostData: { ...adminUsersPost, author: null } })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes;
            expect(response.status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            done();
        });
      });
      it("Should NOT update an exsiting <BlogPost> model without an <author.authorId> field and return a correct response", (done) => {
        chai.request(server)
          .patch("/api/posts/" + postId)
          .set({ Authorization: adminUserToken })
          .send({ blogPostData: { ...adminUsersPost, author: { authorId: null, name: "name" } } })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes;
            expect(response.status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            done();
        });
      });
      it("Should NOT update an existing <BlogPost> model without an <author.name> field and return a correct response", (done) => {
        chai.request(server)
          .patch("/api/posts/" + postId)
          .set({ Authorization: adminUserToken })
          .send({ blogPostData: { ...adminUsersPost, author: { authorId: "id", name: null } } })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes;
            expect(response.status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            done();
        });
      });
      it("Should NOT update an existing <BlogPost> model with an INCORRECT <author> field TYPE and return a correct response", (done) => {
        chai.request(server)
          .patch("/api/posts/" + postId)
          .set({ Authorization: adminUserToken })
          .send({ blogPostData: { ...adminUsersPost, author: "author" } })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes;
            expect(response.status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            done();
        });
      });
      it("Should NOT update an existing <BlogPost> model with an INCORRECT <author.authorId> field TYPE and return a correct response", (done) => {
        chai.request(server)
          .patch("/api/posts/" + postId)
          .set({ Authorization: adminUserToken })
          .send({ blogPostData: { ...adminUsersPost, author: { authorId: "bbllleaf", name: "name" } } })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes;
            expect(response.status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            done();
        });
      });
      it("Should NOT update an existing <BlogPost> model with an INCORRECT <author.name> field TYPE and return a correct response", (done) => {
        chai.request(server)
          .patch("/api/posts/" + postId)
          .set({ Authorization: adminUserToken })
          .send({ blogPostData: { ...adminUsersPost, author: { authorId: "id", name: {} } } })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes;
            expect(response.status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            done();
        });
      });
    });
    // END invalid author field //
    // invalid content field
    describe("PATCH /api/posts/:post_id - invalid <BlogPost.content>", () => {
      it("Should NOT update an existing <BlogPost> model without a <content> field and return a correct response", (done) => {
        chai.request(server)
          .patch("/api/posts/" + postId)
          .set({ Authorization: adminUserToken })
          .send({ blogPostData: { ...adminUsersPost, content: "" } })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes;
            expect(response.status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            done();
        });
      });
      it("Should NOT update an existing <BlogPost> model with an INCORRECT <content> field and return a correct response", (done) => {
        chai.request(server)
          .patch("/api/posts/" + postId)
          .set({ Authorization: adminUserToken })
          .send({ blogPostData: { ...adminUsersPost, content: {} } })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes;
            expect(response.status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            done();
        });
      });
    });
    // END invalid content field //
    // invalid category field
    describe("PATCH /api/posts/:post_id - invalid <BlogPost.category>", () => {
      it("Should NOT update an existing <BlogPost> model with an empty <category> field and return a correct response", (done) => {
        chai.request(server)
          .patch("/api/posts/" + postId)
          .set({ Authorization: adminUserToken })
          .send({ blogPostData: { ...adminUsersPost, category: "" } })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes;
            expect(response.status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            done();
        });
      });
      it("Should NOT update an existing <BlogPost> model with a non approved <category> field and return a correct response", (done) => {
        chai.request(server)
          .patch("/api/posts/" + postId)
          .set({ Authorization: adminUserToken })
          .send({ blogPostData: { ...adminUsersPost, category: "thisisnotvalid" } })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes;
            expect(response.status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            done();
        });
      });
      it("Should NOT update an existing <BlogPost> model with an INCORRECT <category> field TYPE and return a correct response", (done) => {
        chai.request(server)
          .patch("/api/posts/" + postId)
          .set({ Authorization: adminUserToken })
          .send({ blogPostData: { ...adminUsersPost, category: [] } })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes;
            expect(response.status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            done();
        });
      });
    });
    // END invalid category field //
    // invalid keywords field
    describe("PATCH /api/posts/:post_id - invalid <BlogPost.keywords>", () => {
      it("Should NOT update an existing <BlogPost> model with empty <keywords> field and return a correct response", (done) => {
        chai.request(server)
          .patch("/api/posts/" + postId)
          .set({ Authorization: adminUserToken })
          .send({ blogPostData: { ...adminUsersPost, keywords: "" } })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes;
            expect(response.status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            done();
        });
      });
      it("Should NOT update an existing <BlogPost> model with an INCORRECT <keywords> field TYPE and return a correct response", (done) => {
        chai.request(server)
          .patch("/api/posts/" + postId)
          .set({ Authorization: adminUserToken })
          .send({ blogPostData: { ...adminUsersPost, category: {} } })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes;
            expect(response.status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            done();
        });
      });
      it("Should NOT update an existing <BlogPost> model with an EMPTY <keywords> ARRAY and return a correct response", (done) => {
        chai.request(server)
          .patch("/api/posts/" + postId)
          .set({ Authorization: adminUserToken })
          .send({ blogPostData: { ...adminUsersPost, category: [] } })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes;
            expect(response.status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            done();
        });
      });
    });
    // END invalid keywords field //
    describe("Count <BlogPost> models after tests", () => {
      it("Should NOT alter the number of <BlogPost> models in the database", async () => {
        try {
          const updatedNumOfBlogPosts: number = await BlogPost.countDocuments({});
          expect(numberOfPosts).to.equal(updatedNumOfBlogPosts);
        } catch (error) {
          throw error;
        }
      });
    })
  });
  // END CONTEXT PATCH /api/posts/:blog_post with invalid data //
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
