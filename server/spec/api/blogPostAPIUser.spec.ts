import mongoose from "mongoose";
// 
import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
import BlogPost, { IBlogPost } from "../../src/models/BlogPost";
// server //
import ServerPromise from "../../src/server";
// models //
import User from "../../src/models/User";
// helpers //
import { generateMockBlogPosts, generateMockUsers } from "../../src/_helpers/mockDataGeneration";
// types //
import type { Express } from "express";
import type { Server } from "../../src/server";
import type { LoginRes } from "@/redux/_types/auth/dataTypes";
import type { IUser } from "../../src/models/User";
import type { IndexBlogPostRes, OneBlogPostRes, BlogPostErrRes } from "server/src/_types/blog_posts/blogPostTypes";
 
chai.use(chaiHTTP);

describe("BlogPost User API tests", function() {
  this.timeout(10000);
  let serverInstance: Server;
  let server: Express;
  let numberOfPosts: number; let numOfFirstUserPosts: number; let numOfSecondUserPosts: number;
  let numOfFirstUserPublishedPosts: number; let numOfFirstUserUnpublishedPosts: number;
  let numOfSecondUserPublishedPosts: number; let numOfSecondUserUnpublishedPosts: number;
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
      console.log(error);
      process.exit(1);
    }
  });
  // create blog post pmodels //
  before(async() => {
    try {
      await generateMockBlogPosts({ number: 20, publishedStatus: "published", user: firstUser });
      await generateMockBlogPosts({ number: 20, publishedStatus: "published", user: secondUser });
      // unpublished posts //
      await generateMockBlogPosts({ number: 20, publishedStatus: "unpublished", user: firstUser });
      await generateMockBlogPosts({ number: 20, publishedStatus: "unpublished", user: secondUser });
      numberOfPosts = await BlogPost.countDocuments();
      //
      numOfFirstUserPosts = await BlogPost.countDocuments({ "author.authorId": firstUser._id });
      numOfSecondUserPosts = await BlogPost.countDocuments({ "author.authorId": secondUser._id });
      // 
      numOfFirstUserPublishedPosts = await BlogPost.countDocuments({ "author.authorId": firstUser._id }).where({ published: true });
      numOfFirstUserUnpublishedPosts = await BlogPost.countDocuments({ "author.authorId": firstUser._id }).where({ published: false });
      //
      numOfSecondUserPublishedPosts = await BlogPost.countDocuments({ "author.authorId": secondUser._id }).where({ published: true });
      numOfSecondUserUnpublishedPosts = await BlogPost.countDocuments({ "author.authorId": secondUser._id }).where({ published: false });
      // login user //
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  });
  // login first user //
  before((done) => {
    const { email } = firstUser;
    chai.request(server)
      .post("/api/login")
      .send({ email, password: "password" })
      .end((err, res) => {
        if (err) done(err);
        if (res.status === 200) {
          const { jwtToken } = res.body as LoginRes;
          firstUserToken = jwtToken.token;
          done();
        } else {
          done(new Error("Could not login user"));
        };
      });
  });

  // CONTEXT User logged in accessing own blog posts //
  /*
  context("User logged in - Accessing own posts", () => {
    
    // GET /api/posts //
    describe("GET /api/posts", () => {
      it("Should get the default blog post response with only PUBLISHED posts", (done) => {
        chai.request(server)
          .get("/api/posts")
          .set({ "Authorization": firstUserToken })
          .end((err, res) => {
            if (err) done(err);
            const { responseMsg, blogPosts } = res.body as IndexBlogPostRes;
            expect(res.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(blogPosts).to.be.an("array");
            expect(blogPosts.length).to.equal(10);
            for (const post of blogPosts) {
              expect(post.published).to.equal(true);
            }
            done();
          });
      });
      it("Should be able to access ALL of OWN UNPUBLISHED blog posts", (done) => {
        const userId = firstUser._id.toHexString();
        chai.request(server)
          .get("/api/posts")
          .set({ "Authorization": firstUserToken })
          .query({ byUser: true, publishedStatus: "unpublished", limit: numberOfPosts, userId })
          .end((err, res) => {
            if (err) done(err);
            const { responseMsg, blogPosts } = res.body as IndexBlogPostRes;  
            expect(res.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(blogPosts).to.be.an("array");
            expect(blogPosts.length).to.equal(numOfFirstUserUnpublishedPosts)
            for (const post of blogPosts) {
              expect(userId).to.equal(post.author.authorId);
              expect(post.published).to.equal(false);
            }
            done();
          });
      });
      it("Should be able to access ALL of OWN PUBLISHED and UNPUBLISHED blog posts", (done) => {
        const userId = firstUser._id.toHexString();
        chai.request(server)
          .get("/api/posts")
          .set({ "Authorization": firstUserToken })
          .query({ byUser: true, publishedStatus: "all", limit: numberOfPosts, userId })
          .end((err, res) => {
            if (err) done(err);
            const { responseMsg, blogPosts } = res.body as IndexBlogPostRes;  
            expect(res.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(blogPosts).to.be.an("array");
            expect(blogPosts.length).to.equal(numOfFirstUserPosts);
            done();
          });
      });
      it("Should get Blog Posts by CATEGORY=INFORMATIONAL option", (done) => {
        chai.request(server)
          .get("/api/posts")
          .query({ category: "informational" })
          .end((err, res) => {
            if (err) done(err);
            const { responseMsg, blogPosts } = res.body as IndexBlogPostRes;
            expect(res.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(blogPosts).to.be.an("array");
            expect(blogPosts.length).to.be.at.most(10);       
            for (const post of blogPosts) {
              expect(post.published).to.equal(true);
              expect(post.category).to.equal("informational");
            }
            done();
          });
      });
      it("Should get Blog Posts by CATEGORY=BEGINNER option", (done) => {
        chai.request(server)
          .get("/api/posts")
          .query({ category: "beginner" })
          .end((err, res) => {
            if (err) done(err);
            const { responseMsg, blogPosts } = res.body as IndexBlogPostRes
            expect(res.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(blogPosts).to.be.an("array");    
            expect(blogPosts.length).to.be.at.most(10);       
            for (const post of blogPosts) {
              expect(post.published).to.equal(true);
              expect(post.category).to.equal("beginner");
            }
            done();
          });
      });
      it("Should get Blog Posts by CATEGORY=INTERMEDIATE option", (done) => {
        chai.request(server)
          .get("/api/posts")
          .query({ category: "intermediate" })
          .end((err, res) => {
            if (err) done(err);
            const { responseMsg, blogPosts } = res.body as IndexBlogPostRes;
            expect(res.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(blogPosts).to.be.an("array");    
            expect(blogPosts.length).to.be.at.most(10);       
            for (const post of blogPosts) {
              expect(post.published).to.equal(true);
              expect(post.category).to.equal("intermediate");
            }
            done();
          });
      });
      it("Should get Blog Posts by CATEGORY=ADVANCED option", (done) => {
        chai.request(server)
          .get("/api/posts")
          .query({ category: "advanced" })
          .end((err, res) => {
            if (err) done(err);
            const { responseMsg, blogPosts } = res.body as IndexBlogPostRes;
            expect(res.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(blogPosts).to.be.an("array");    
            expect(blogPosts.length).to.be.at.most(10);       
            for (const post of blogPosts) {
              expect(post.published).to.equal(true);
              expect(post.category).to.equal("advanced");
            }
            done();
          });
      });
    });
  });
  */
  // END CONTEXT User logged in accessing own blog posts //

  // CONTEXT User logged in accessing other users blog posts //
  context("User logged in accessing other users blog posts", () => {
    
    // GET /api/posts //
    describe("GET /api/posts", () => {

      it("Should be able to access other users PUBLISHED posts", (done) => {
        const userId = secondUser._id.toHexString();
        chai.request(server)
          .get("/api/posts")
          .set({ "Authorization": firstUserToken })
          .query({ byUser: true, limit: numberOfPosts, userId })
          .end((err, res) => {
            if (err) done(err);
            const { responseMsg, blogPosts } = res.body as IndexBlogPostRes;
            expect(res.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(blogPosts).to.be.an("array");
            expect(blogPosts.length).to.equal(numOfSecondUserPublishedPosts);
            for (const post of blogPosts) {
              expect(post.published).to.equal(true);
            }
            done();
          });
      });
      it("Should NOT be able to get other users UNPUBLISHED blog posts", (done) => {
        const otherUserId = secondUser._id.toHexString();
        chai.request(server)
          .get("/api/posts")
          .set({ "Authorization": firstUserToken })
          .query({ byUser: true, publishedStatus: "unpublished", limit: numberOfPosts,  userId: otherUserId })
          .end((err, res) => {
            if (err) done(err);
            const { responseMsg, error, errorMessages } = res.body as IndexBlogPostRes; 
            expect(res.status).to.equal(401);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      })
      it("Should be able get other users PUBLISHED Blog Posts by CATEGORY=ALL option", (done) => {
        const otherUserId = secondUser._id.toHexString();
        chai.request(server)
          .get("/api/posts")
          .query({ byUser: true, category: "all",  userId: otherUserId })
          .end((err, res) => {
            if (err) done(err);
            const { responseMsg, blogPosts } = res.body as IndexBlogPostRes;
            expect(res.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(blogPosts).to.be.an("array");
            expect(blogPosts.length).to.be.at.most(10);       
            for (const post of blogPosts) {
              expect(post.published).to.equal(true);
              expect(post.author.authorId).to.equal(otherUserId)
            }
            done();
          });
      });
      it("Should be able get other users PUBLISHED Blog Posts by CATEGORY=INFORMATIONAL option", (done) => {
        const otherUserId = secondUser._id.toHexString();
        chai.request(server)
          .get("/api/posts")
          .query({ byUser: true, category: "informational",  userId: otherUserId })
          .end((err, res) => {
            if (err) done(err);
            const { responseMsg, blogPosts } = res.body as IndexBlogPostRes;
            expect(res.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(blogPosts).to.be.an("array");
            expect(blogPosts.length).to.be.at.most(10);       
            for (const post of blogPosts) {
              expect(post.published).to.equal(true);
              expect(post.category).to.equal("informational");
              expect(post.author.authorId).to.equal(otherUserId)
            }
            done();
          });
      });
      it("Should be able get other users PUBLISHED Blog Posts by CATEGORY=BEGINNER option", (done) => {
        const otherUserId = secondUser._id.toHexString();
        chai.request(server)
          .get("/api/posts")
          .query({ byUser: true, category: "beginner",  userId: otherUserId })
          .end((err, res) => {
            if (err) done(err);
            const { responseMsg, blogPosts } = res.body as IndexBlogPostRes;
            expect(res.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(blogPosts).to.be.an("array");
            expect(blogPosts.length).to.be.at.most(10);       
            for (const post of blogPosts) {
              expect(post.published).to.equal(true);
              expect(post.category).to.equal("beginner");
              expect(post.author.authorId).to.equal(otherUserId)
            }
            done();
          });
      });
      it("Should be able get other users PUBLISHED Blog Posts by CATEGORY=INTERMEDIATE option", (done) => {
        const otherUserId = secondUser._id.toHexString();
        chai.request(server)
          .get("/api/posts")
          .query({ byUser: true, category: "intermediate",  userId: otherUserId })
          .end((err, res) => {
            if (err) done(err);
            const { responseMsg, blogPosts } = res.body as IndexBlogPostRes;
            expect(res.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(blogPosts).to.be.an("array");
            expect(blogPosts.length).to.be.at.most(10);       
            for (const post of blogPosts) {
              expect(post.published).to.equal(true);
              expect(post.category).to.equal("intermediate");
              expect(post.author.authorId).to.equal(otherUserId)
            }
            done();
          });
      });
      it("Should be able get other users PUBLISHED Blog Posts by CATEGORY=ADVANCED option", (done) => {
        const otherUserId = secondUser._id.toHexString();
        chai.request(server)
          .get("/api/posts")
          .query({ byUser: true, category: "advanced",  userId: otherUserId })
          .end((err, res) => {
            if (err) done(err);
            const { responseMsg, blogPosts } = res.body as IndexBlogPostRes;
            expect(res.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(blogPosts).to.be.an("array");
            expect(blogPosts.length).to.be.at.most(10);       
            for (const post of blogPosts) {
              expect(post.published).to.equal(true);
              expect(post.category).to.equal("advanced");
              expect(post.author.authorId).to.equal(otherUserId)
            }
            done();
          });
      });
      it("Should NOT be able get other users UNPPUBLISHED Blog Posts by CATEGORY=ALL option", (done) => {
        const otherUserId = secondUser._id.toHexString();
        chai.request(server)
          .get("/api/posts")
          .query({ byUser: true, category: "all", publishedStatus: "unpublished",  userId: otherUserId })
          .end((err, res) => {
            if (err) done(err);
            const { responseMsg, error, errorMessages } = res.body as IndexBlogPostRes;
            expect(res.status).to.equal(401);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.a("array");
            done();
          });
      });
      it("Should NOT be able get other users UNPPUBLISHED Blog Posts by CATEGORY=INFORMATIONAL option", (done) => {
        const otherUserId = secondUser._id.toHexString();
        chai.request(server)
          .get("/api/posts")
          .query({ byUser: true, category: "informational", publishedStatus: "unpublished",  userId: otherUserId })
          .end((err, res) => {
            if (err) done(err);
            const { responseMsg, error, errorMessages } = res.body as IndexBlogPostRes;
            expect(res.status).to.equal(401);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.a("array");
            done();
          });
      });
      it("Should NOT be able get other users UNPPUBLISHED Blog Posts by CATEGORY=BEGINNER option", (done) => {
        const otherUserId = secondUser._id.toHexString();
        chai.request(server)
          .get("/api/posts")
          .query({ byUser: true, category: "beginner", publishedStatus: "unpublished",  userId: otherUserId })
          .end((err, res) => {
            if (err) done(err);
            const { responseMsg, error, errorMessages } = res.body as IndexBlogPostRes;
            expect(res.status).to.equal(401);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.a("array");
            done();
          });
      });
      it("Should NOT be able get other users UNPPUBLISHED Blog Posts by CATEGORY=INTERMEDIATE option", (done) => {
        const otherUserId = secondUser._id.toHexString();
        chai.request(server)
          .get("/api/posts")
          .query({ byUser: true, category: "intermediate", publishedStatus: "unpublished",  userId: otherUserId })
          .end((err, res) => {
            if (err) done(err);
            const { responseMsg, error, errorMessages } = res.body as IndexBlogPostRes;
            expect(res.status).to.equal(401);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.a("array");
            done();
          });
      });
      it("Should NOT be able get other users UNPPUBLISHED Blog Posts by CATEGORY=ADVANCED option", (done) => {
        const otherUserId = secondUser._id.toHexString();
        chai.request(server)
          .get("/api/posts")
          .query({ byUser: true, category: "advanced", publishedStatus: "unpublished",  userId: otherUserId })
          .end((err, res) => {
            if (err) done(err);
            const { responseMsg, error, errorMessages } = res.body as IndexBlogPostRes;
            expect(res.status).to.equal(401);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.a("array");
            done();
          });
      });
    });
  });


    // END GET /api/posts //
    // GET /api/posts/:post_id //
    /*
    describe("GET /api/posts/:post_id", () => {
      let publishedPost: IBlogPost; let unpublishedPost: IBlogPost;
      before(async () => {
        try {
          publishedPost = await BlogPost.findOne({ published: true });
          unpublishedPost = await BlogPost.findOne({ published: false });
        } catch (error) {
          console.log(error);
          process.exit(1);
        }
      });
      it("Should allow a guest client to fetch a PUBLISHED post", (done) => {
        const { _id } = publishedPost;
        chai.request(server)
          .get("/api/posts/" + _id)
          .end((err, res) => {
            if (err) done(err);
            const { responseMsg, blogPost } = res.body as OneBlogPostRes;
            expect(res.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(blogPost).to.be.an("object");
            expect(blogPost.published).to.equal(true)
            done();
          });
      });
      it("Should NOT allow a guest client to fetch an UNPUBLISHED post", (done) => {
        const { _id } = unpublishedPost;
        chai.request(server)
          .get("/api/posts/" + _id)
          .end((err, res) => {
            if (err) done(err);
            const { responseMsg, error, errorMessages } = res.body as ErrorBlogPostRes;
            expect(res.status).to.equal(401);
            expect(responseMsg).to.be.a("string")
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            expect(res.body.blogPost).to.eq(undefined);
            done();
          });
      });
    });
    // END GET /api/posts/:post_id //
    // POST /api/posts //
    describe("POST /api/posts", () => {
      it("Should not allow a guest client to create Blog Posts", (done) => {
        chai.request(server)
          .post("/api/posts")
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).to.equal(401);
            done();
          });
      });
      it("Should NOT alter the number of <BlogPost> models in the database", async () => {
        try {
          const updatedNum = await BlogPost.countDocuments();
          expect(updatedNum).to.equal(numberOfPosts); 
        } catch (error) {
          console.log(error);
          process.exit(1);
        }
      });
    });
    // END POST /api/posts //
    // PATCH /api/posts/:post_id //
    describe("PATCH /api/posts/:post_id", () => {
      let post: IBlogPost;
      before( async () => {
        try {
          post = await BlogPost.findOne({});
        } catch (error) {
          console.log(error);
          process.exit(1);
        }
      });

      it("Should NOT allow a guest client to edit Blog Posts", (done) => {
        const { _id } = post;
        chai.request(server)
          .patch("/api/posts/" + _id)
          .send({
            blogPost: { ...post, title: "A changed title" }
          })
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).to.equal(401);
            done();
          });
      });
      it("Should NOT alter the <BlogPost> model", async () => {
        try {
          const { _id } = post;
          const updatedPost = await BlogPost.findById(_id);
          expect(updatedPost.title).to.equal(post.title);
        } catch (error) {
          console.log(error);
          process.exit(1);
        }
      });
      it("Should NOT alter the number of <BlogPost> models in the database", async () => {
        try {
          const updatedNum = await BlogPost.countDocuments();
          expect(updatedNum).to.equal(numberOfPosts); 
        } catch (error) {
          console.log(error);
          process.exit(1);
        }
      });
    });
    // END PATCH /api/posts/:post_id //

    // PATCH /api/posts/:post_id //
    describe("DELETE /api/posts/:post_id", () => {
      let post: IBlogPost;
      before( async () => {
        try {
          post = await BlogPost.findOne({});
        } catch (error) {
          console.log(error);
          process.exit(1);
        }
      });

      it("Should NOT allow a guest client to edit Blog Posts", (done) => {
        const { _id } = post;
        chai.request(server)
          .delete("/api/posts/" + _id)
          .send({
            blogPost: { ...post, title: "A changed title" }
          })
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).to.equal(401);
            done();
          });
      });
      it("Should NOT alter the <BlogPost> model", async () => {
        try {
          const { _id } = post;
          const updatedPost = await BlogPost.findById(_id);
          expect(updatedPost).to.be.an("object");
        } catch (error) {
          console.log(error);
          process.exit(1);
        }
      });
      it("Should NOT alter the number of <BlogPost> models in the database", async () => {
        try {
          const updatedNum = await BlogPost.countDocuments();
          expect(updatedNum).to.equal(numberOfPosts); 
        } catch (error) {
          console.log(error);
          process.exit(1);
        }
      });
    });
    // END DELETE /api/posts/:post_id //
    */

  // END CONTEXT Guest Client / No Login //
  after(async () => {
    try {
      await BlogPost.deleteMany({});
      await User.deleteMany({});
      await mongoose.disconnect();
      await serverInstance.nextAppServer.close();
      //process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  });
});

export {};