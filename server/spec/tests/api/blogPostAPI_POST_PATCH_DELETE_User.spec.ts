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
import type { IndexBlogPostRes, OneBlogPostRes, CreateBlogPostRes, BlogPostData } from "@/redux/_types/blog_posts/dataTypes";

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
            })
        })
        it("Should correctly set the fields on a new <BlogPost> models", () => {
          expect(_createdBlogPost.title).to.equal(mockPostData.title);
          expect(_createdBlogPost.author.authorId).to.equal(firstUser._id.toHexString());
          expect(_createdBlogPost.author.name).to.equal(firstUser.firstName);
          expect(_createdBlogPost.content).to.equal(mockPostData.content)
          expect(_createdBlogPost.published).to.equal(false)
          expect(_createdBlogPost.createdAt).to.be.a("string");
          expect(_createdBlogPost.editedAt).to.be.a("string");
        })
      });
      /*
      describe("PATCH /api/posts/post_id", () => {

      })
      */
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
