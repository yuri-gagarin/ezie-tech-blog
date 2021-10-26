import mongoose from "mongoose";
// 
import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
// models //
import User from "../../../../src/models/User";
import BlogPost from "../../../../src/models/BlogPost";
// server //
import { ServerInstance } from "../../../../src/server";
// types //
import type { Server } from "../../../../src/server";
import type { IBlogPost } from "../../../../src/models/BlogPost";
import type { IndexBlogPostRes, OneBlogPostRes } from "server/src/_types/blog_posts/blogPostTypes";
// helpers //
import { generateMockBlogPosts, generateMockUsers } from "../../../../src/_helpers/mockDataGeneration";
 
chai.use(chaiHTTP);

describe("BlogPost Guest API tests", function() {
  this.timeout(10000);
  let server: any;
  let numberOfPosts: number;

  before(async () => {
    try {
      server = ServerInstance.getExpressServer();
      await generateMockUsers({ number: 1, confirmed: true });
      //await generateMockBlogPosts(10);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  });

  // CONTEXT Guest Client / No Login //
  context("Guest Client / No Login", () => {
    before(async() => {
      try {
        await generateMockBlogPosts({ number: 30, publishedStatus: "published" });
        await generateMockBlogPosts({ number: 30, publishedStatus: "unpublished" });
        numberOfPosts = await BlogPost.countDocuments();
      } catch (error) {
        console.log(error);
        process.exit(1);
      }
    });
    // GET /api/posts //
    describe("GET /api/posts", () => {
      it("Should get posts", (done) => {
        chai.request(server)
          .get("/api/posts")
          .end((err, res) => {
            if (err) done(err);
            const { responseMsg, blogPosts } = res.body as IndexBlogPostRes;
            expect(res.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(blogPosts).to.be.an("array");
            expect(blogPosts.length).to.equal(10);
            done();
          });
      });
      it("Should only get Blog Posts which are published", (done) => {
        chai.request(server)
          .get("/api/posts")
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).to.equal(200);
            const { blogPosts } = res.body as IndexBlogPostRes;
            for (const post of blogPosts) {
              expect(post.published).to.equal(true);
            }
            done();
          });
      });
      it("Should NOT get any UNPUBLISHED Blog Posts", (done) => {
        chai.request(server)
          .get("/api/posts")
          .query({ publishedStatus: "unpublished" })
          .end((err, res) => {
            if (err) done(err);
            const { responseMsg, error, errorMessages } = res.body as IndexBlogPostRes;
            expect(res.status).to.equal(401);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      });
      it("Should get Blog Posts by CATEGORY=INFORMATIONAL option", (done) => {
        chai.request(server)
          .get("/api/posts")
          .query({ category: "informational" })
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).to.equal(200);
            const { blogPosts } = res.body as IndexBlogPostRes;
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
            expect(res.status).to.equal(200);
            const { blogPosts } = res.body as IndexBlogPostRes;
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
            expect(res.status).to.equal(200);
            const { blogPosts } = res.body as IndexBlogPostRes;
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
            expect(res.status).to.equal(200);
            const { blogPosts } = res.body as IndexBlogPostRes;
            for (const post of blogPosts) {
              expect(post.published).to.equal(true);
              expect(post.category).to.equal("advanced");
            }
            done();
          });
      });
    });
    // END GET /api/posts //
    // GET /api/posts/:post_id //
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
            const { responseMsg, error, errorMessages } = res.body as OneBlogPostRes;
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

  });
  // END CONTEXT Guest Client / No Login //
  after(async () => {
    try {
      await User.deleteMany({});
      await BlogPost.deleteMany({});
    } catch (error) {
      console.log(error);
    }
  });
});

export {};