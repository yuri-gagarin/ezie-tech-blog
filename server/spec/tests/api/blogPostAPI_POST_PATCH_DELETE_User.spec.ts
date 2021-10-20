import mongoose from "mongoose";
// test tooling //
import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
// models //
import BlogPost from "../../../src/models/BlogPost";
// server //
import ServerPromise from "../../../src/server";
// models //
import User from "../../../src/models/User";
// helpers //
import { generateMockBlogPosts, generateMockUsers } from "../../../src/_helpers/mockDataGeneration";
import { loginUser, countBlogPosts, generateMockPostData } from "../../hepers/testHelpers";
// types //
import type { Express } from "express";
import type { Server } from "@/server/src/server";
import type { IBlogPost } from "@/server/src/models/BlogPost"
import type { IUser } from "@/server/src/models/User";
import type { BlogPostClientData } from "@/server/src/_types/blog_posts/blogPostTypes";
import type { CreateBlogPostRes, BlogPostData, EditBlogPostRes, DeleteBlogPostRes } from "@/redux/_types/blog_posts/dataTypes";

chai.use(chaiHTTP);

describe("BlogPost User logged in API tests POST, PATCH, DELETE tests", function() {
  this.timeout(10000);
  let serverInstance: Server;
  let server: Express;
  let numberOfPosts: number; let numOfFirstUserPosts: number; let numOfSecondUserPosts: number;
  let firstUser: IUser; let secondUser: IUser;
  let firstUserToken: string;

  // set up server, DB and create users //
  before(async () => {
    try {
      serverInstance = await ServerPromise;
      server = serverInstance.getExpressServer();
      await generateMockUsers(2);
      const users = await User.find({}).limit(2);
      ([ firstUser, secondUser ] = users);
      //await generateMockBlogPosts(10);
    } catch (error) {
      throw(error);
    }
  });
  // create blog post models //
  before(async() => {
    try {
      const { _id: firstUserId } = firstUser;
      const { _id: secondUserId } = secondUser;
      // generate mock data //
      await generateMockBlogPosts({ number: 10, user: firstUser });
      await generateMockBlogPosts({ number: 10, user: secondUser });
      // get model counts //
      numberOfPosts = await countBlogPosts({});
      //
      numOfFirstUserPosts = await countBlogPosts({ specificUserId: firstUserId.toHexString() });
      numOfSecondUserPosts = await countBlogPosts({ specificUserId: secondUserId.toHexString() });
    } catch (error) {
      throw error;
    }
  });
  // login user //
  before(async () => {
    try {
      const { email } = firstUser;
      const { userJWTToken } = await loginUser({ chai, server, email });
      firstUserToken = userJWTToken;
    } catch (error) {
      throw error;
    }
  });

  // CONTEXT  POST, PATCH, DELETE OWN Model //
  context("POST, PATCH, DELETE <BlogPost> model belongs to user", () => {
    // CONTEXT  Tests with valid data  //
    context("Tests with valid data", () => {
      // POST TESTS //
      describe("POST /api/posts", () => {
        let mockPostData: BlogPostClientData;
        let _createdBlogPost: BlogPostData;
        before(() => {
          try {
            const { _id, firstName } = firstUser;
            mockPostData = generateMockPostData({ authorId: _id.toHexString(), name: firstName });
          } catch (err) {
            throw err;
          }
        })

        it("Should correctly CREATE a new <BlogPost> model and send back correct response", (done) => {
          chai.request(server)
            .post("/api/posts")
            .set({ Authorization: firstUserToken })
            .send({ blogPostData: mockPostData })
            .end((error, response) => {
              if (error) done(error);
              const { responseMsg, createdBlogPost } = response.body as CreateBlogPostRes;
              expect(response.status).to.equal(200);
              expect(responseMsg).to.be.a("string");
              expect(createdBlogPost).to.be.an("object");
              // 
              _createdBlogPost = createdBlogPost;
              done();
            });
        });
        it("Should correctly set the fields on a new <BlogPost> model", () => {
          expect(_createdBlogPost.title).to.equal(mockPostData.title);
          expect(_createdBlogPost.author.authorId).to.equal(firstUser._id.toHexString());
          expect(_createdBlogPost.author.name).to.equal(firstUser.firstName);
          expect(_createdBlogPost.content).to.equal(mockPostData.content)
          expect(_createdBlogPost.published).to.equal(false);
          expect(_createdBlogPost.keywords).to.eql(mockPostData.keywords);
          expect(_createdBlogPost.category).to.equal(mockPostData.category);
          expect(_createdBlogPost.createdAt).to.be.a("string");
          expect(_createdBlogPost.editedAt).to.be.a("string");
        });
        it("Should correctly increment the number of <BlogPost> model by 1", async () => {
          try {
            const updatedNumOfBlogPosts: number = await countBlogPosts({});
            expect(updatedNumOfBlogPosts).to.equal(numberOfPosts + 1);
            //
            numberOfPosts = updatedNumOfBlogPosts;
          } catch (error) {
            throw error;
          }
        });
      });
      // END POST tests //
      // PATCH Tests //
      describe("PATCH /api/posts/:post_id", () => {
        let blogPostId: string;
        let mockPostData: BlogPostClientData;
        let _editedBlogPost: BlogPostData;
        before(async () => {
          try {
            const { _id: userId, firstName } = firstUser;
            const blogPost = await BlogPost.findOne({ "author:authorId": userId });
            //
            mockPostData = generateMockPostData({ authorId: userId.toHexString(), name: firstName });
            blogPostId = blogPost._id.toHexString();
          } catch (err) {
            throw err;
          }
        });

        it("Should correctly UPDATE an existing <BlogPost> model and send back correct response", (done) => {
          chai.request(server)
            .patch("/api/posts/" + blogPostId)
            .set({ Authorization: firstUserToken })
            .send({ blogPostData: mockPostData })
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
          expect(_editedBlogPost.title).to.equal(mockPostData.title);
          expect(_editedBlogPost.author.authorId).to.equal(firstUser._id.toHexString());
          expect(_editedBlogPost.author.name).to.equal(firstUser.firstName);
          expect(_editedBlogPost.content).to.equal(mockPostData.content)
          expect(_editedBlogPost.published).to.equal(false);
          expect(_editedBlogPost.keywords).to.eql(mockPostData.keywords);
          expect(_editedBlogPost.category).to.equal(mockPostData.category);
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
      // END PATCH Tests //
      // DELETE TESTS //
      describe("DELETE /api/posts/:post_id", () => {
        let blogPostId: string;
        before(async () => {
          try {
            const { _id: userId, firstName } = firstUser;
            const blogPost = await BlogPost.findOne({ "author:authorId": userId });
            //
            blogPostId = blogPost._id.toHexString();
          } catch (err) {
            throw err;
          }
        });

        it("Should correctly DELETE an existing <BlogPost> model and send back correct response", (done) => {
          chai.request(server)
            .delete("/api/posts/" + blogPostId)
            .set({ Authorization: firstUserToken })
            .end((error, response) => {
              if (error) done(error);
              const { responseMsg, deletedBlogPost } = response.body as DeleteBlogPostRes;
              expect(response.status).to.equal(200);
              expect(responseMsg).to.be.a("string");
              expect(deletedBlogPost).to.be.an("object");
              //
              done();
            });
        });
        it("Should remove the <BlogPost> model with queried _id from the database", async () => {
          try {
            const deletedBlogPost = await BlogPost.findById(blogPostId);
            expect(deletedBlogPost).to.be.null;
          } catch (error) {
            throw error;
          }
        });
        it("Should decrease the number of <BlogPost> models by 1", async () => {
          try {
            const updatedNumOfBlogPosts: number = await countBlogPosts({});
            expect(updatedNumOfBlogPosts).to.equal(numberOfPosts - 1);
          } catch (error) {
            throw error;
          }
        });
      });
      // END DELETE TESTS //

    })
    // END CONTEXT Tests with valid data //
  });
  // END CONTEXT POST PATCH DELETE OWN Model //

  after(async () => {
    try {
      await BlogPost.deleteMany({});
      await User.deleteMany({});
      await mongoose.disconnect();
      await serverInstance.nextAppServer.close();
      //process.exit(0);
    } catch (error) {
      throw error;
    }
  });
});


export {};
