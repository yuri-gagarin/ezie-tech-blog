import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
// server //
// import ServerPromise from "../../../../src/server";
import { ServerInstance } from "../../../../src/server";
// models //
import User from "@/server/src/models/User";
import Admin from "@/server/src/models/Admin";
import BlogPost from "@/server/src/models/BlogPost";
// helpers //
import { generateMockAdmins, generateMockBlogPosts, generateMockUsers } from "@/server/src/_helpers/mockDataGeneration";
// types //
import type { Express } from "express";
import type { LoginRes } from "@/redux/_types/auth/dataTypes";
import type { IAdmin } from "@/server/src/models/Admin";
import type { IUser } from "@/server/src/models/User";
import type { IBlogPost } from "@/server/src/models/BlogPost";
import type { IndexBlogPostRes, OneBlogPostRes } from "server/src/_types/blog_posts/blogPostTypes";
 
chai.use(chaiHTTP);

describe("BlogPost ADMIN API tests GET requests", function() {
  this.timeout(10000);
  let server: Express;
  let numberOfPosts: number; let numOfAdminUserPosts: number; let numOfOtherUserPosts: number;
  let numOfAdminUserPublishedPosts: number; let numOfAdminUserUnpublishedPosts: number;
  let numOfOtherUserPublishedPosts: number; let numOfOtherUserUnpublishedPosts: number;
  let adminUser: IAdmin; let otherUser: IUser;
  let adminUserToken: string;

  // set up server, DB and create users //
  before(async () => {
    try {
      server = ServerInstance.getExpressServer();
      await generateMockUsers({ number: 1, confirmed: true });
      await generateMockAdmins(1);
      //
      adminUser = await Admin.findOne({});
      otherUser = await User.findOne({});
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  });
  // create blog post pmodels //
  before(async() => {
    try {
      await generateMockBlogPosts({ number: 20, publishedStatus: "published", user: adminUser });
      await generateMockBlogPosts({ number: 20, publishedStatus: "published", user: otherUser });
      // unpublished posts //
      await generateMockBlogPosts({ number: 20, publishedStatus: "unpublished", user: adminUser });
      await generateMockBlogPosts({ number: 20, publishedStatus: "unpublished", user: otherUser });
      numberOfPosts = await BlogPost.countDocuments();
      //
      numOfAdminUserPosts = await BlogPost.countDocuments({ "author.authorId": adminUser._id });
      numOfOtherUserPosts = await BlogPost.countDocuments({ "author.authorId": otherUser._id });
      // 
      numOfAdminUserPublishedPosts = await BlogPost.countDocuments({ "author.authorId": adminUser._id }).where({ published: true });
      numOfAdminUserUnpublishedPosts = await BlogPost.countDocuments({ "author.authorId": adminUser._id }).where({ published: false });
      //
      numOfOtherUserPublishedPosts = await BlogPost.countDocuments({ "author.authorId": otherUser._id }).where({ published: true });
      numOfOtherUserUnpublishedPosts = await BlogPost.countDocuments({ "author.authorId": otherUser._id }).where({ published: false });
      // login adminUser //
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  });
  // login admin adminUser //
  before((done) => {
    const { email } = adminUser;
    chai.request(server)
      .post("/api/login")
      .send({ email, password: "password" })
      .end((err, res) => {
        if (err) done(err);
        if (res.status === 200) {
          const { jwtToken } = res.body as LoginRes;
          adminUserToken = jwtToken.token;
          done();
        } else {
          done(new Error("Could not login adminUser"));
        };
      });
  });

  // CONTEXT Admin logged in accessing own blog posts //
  context("Admin logged in - Accessing own posts", () => {
    
    // GET /api/posts //
    describe("GET /api/posts", () => {
      it("Should get the default blog post response with only PUBLISHED posts", (done) => {
        chai.request(server)
          .get("/api/posts")
          .set({ "Authorization": adminUserToken })
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
        const userId = adminUser._id.toHexString();
        chai.request(server)
          .get("/api/posts")
          .set({ "Authorization": adminUserToken })
          .query({ byUser: true, publishedStatus: "unpublished", limit: numberOfPosts, userId })
          .end((err, res) => {
            if (err) done(err);
            const { responseMsg, blogPosts, error, errorMessages } = res.body as IndexBlogPostRes; 
            console.log(errorMessages) 
            expect(res.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(blogPosts).to.be.an("array");
            expect(blogPosts.length).to.equal(numOfAdminUserUnpublishedPosts)
            for (const post of blogPosts) {
              expect(userId).to.equal(post.author.authorId);
              expect(post.published).to.equal(false);
            }
            done();
          });
      });
      it("Should be able to access ALL of OWN PUBLISHED and UNPUBLISHED blog posts", (done) => {
        const userId = adminUser._id.toHexString();
        chai.request(server)
          .get("/api/posts")
          .set({ "Authorization": adminUserToken })
          .query({ byUser: true, publishedStatus: "all", limit: numberOfPosts, userId })
          .end((err, res) => {
            if (err) done(err);
            const { responseMsg, blogPosts } = res.body as IndexBlogPostRes;  
            expect(res.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(blogPosts).to.be.an("array");
            expect(blogPosts.length).to.equal(numOfAdminUserPosts);
            for (const post of blogPosts) {
              expect(userId).to.equal(post.author.authorId);
            }
            done();
          });
      });
      it("Should get own Blog Posts by CATEGORY=INFORMATIONAL and PUBLISHED option", (done) => {
        const userId = adminUser._id.toHexString();
        chai.request(server)
          .get("/api/posts")
          .set({ "Authorization": adminUserToken })
          .query({ category: "informational", publishedStatus: "published", byUser: true, userId })
          .end((err, res) => {
            if (err) done(err);
            const { responseMsg, blogPosts } = res.body as IndexBlogPostRes;
            expect(res.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(blogPosts).to.be.an("array");
            expect(blogPosts.length).to.be.at.most(10);       
            for (const post of blogPosts) {
              expect(userId).to.equal(post.author.authorId);
              expect(post.published).to.equal(true);
              expect(post.category).to.equal("informational");
            }
            done();
          });
      });
      it("Should get Blog Posts by CATEGORY=BEGINNER and PUBLISHED option", (done) => {
        const userId = adminUser._id.toHexString();
        chai.request(server)
          .get("/api/posts")
          .set({ "Authorization": adminUserToken })
          .query({ category: "beginner", publishedStatus: "published", byUser: true, userId })
          .end((err, res) => {
            if (err) done(err);
            const { responseMsg, blogPosts } = res.body as IndexBlogPostRes
            expect(res.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(blogPosts).to.be.an("array");    
            expect(blogPosts.length).to.be.at.most(10);       
            for (const post of blogPosts) {
              expect(userId).to.equal(post.author.authorId);
              expect(post.published).to.equal(true);
              expect(post.category).to.equal("beginner");
            }
            done();
          });
      });
      it("Should get Blog Posts by CATEGORY=INTERMEDIATE and PUBLISHED option", (done) => {
        const userId = adminUser._id.toHexString();
        chai.request(server)
          .get("/api/posts")
          .set({ "Authorization": adminUserToken })
          .query({ category: "intermediate", publishedStatus: "published", byUser: true, userId })
          .end((err, res) => {
            if (err) done(err);
            const { responseMsg, blogPosts } = res.body as IndexBlogPostRes;
            expect(res.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(blogPosts).to.be.an("array");    
            expect(blogPosts.length).to.be.at.most(10);       
            for (const post of blogPosts) {
              expect(userId).to.equal(post.author.authorId);
              expect(post.published).to.equal(true);
              expect(post.category).to.equal("intermediate");
            }
            done();
          });
      });
      it("Should get Blog Posts by CATEGORY=ADVANCED and PUBLISHED option", (done) => {
        const userId = adminUser._id.toHexString();
        chai.request(server)
          .get("/api/posts")
          .set({ "Authorization": adminUserToken })
          .query({ category: "advanced", publishedStatus: "published", byUser: true, userId })
          .end((err, res) => {
            if (err) done(err);
            const { responseMsg, blogPosts } = res.body as IndexBlogPostRes;
            expect(res.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(blogPosts).to.be.an("array");    
            expect(blogPosts.length).to.be.at.most(10);       
            for (const post of blogPosts) {
              expect(userId).to.equal(post.author.authorId);
              expect(post.published).to.equal(true);
              expect(post.category).to.equal("advanced");
            }
            done();
          });
      });
      it("Should get Blog Posts by CATEGORY=INFORMATIONAL and UNPUBLISHED option", (done) => {
        const userId = adminUser._id.toHexString();
        chai.request(server)
          .get("/api/posts")
          .set({ "Authorization": adminUserToken })
          .query({ category: "informational", publishedStatus: "unpublished", byUser: true, userId })
          .end((err, res) => {
            if (err) done(err);
            const { responseMsg, blogPosts } = res.body as IndexBlogPostRes;
            expect(res.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(blogPosts).to.be.an("array");    
            expect(blogPosts.length).to.be.at.most(10);       
            for (const post of blogPosts) {
              expect(userId).to.equal(post.author.authorId);
              expect(post.published).to.equal(false);
              expect(post.category).to.equal("informational");
            }
            done();
          });
      });
      it("Should get Blog Posts by CATEGORY=BEGINNER and UNPUBLISHED option", (done) => {
        const userId = adminUser._id.toHexString();
        chai.request(server)
          .get("/api/posts")
          .set({ "Authorization": adminUserToken })
          .query({ category: "beginner", publishedStatus: "unpublished", byUser: true, userId })
          .end((err, res) => {
            if (err) done(err);
            const { responseMsg, blogPosts } = res.body as IndexBlogPostRes;
            expect(res.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(blogPosts).to.be.an("array");    
            expect(blogPosts.length).to.be.at.most(10);       
            for (const post of blogPosts) {
              expect(userId).to.equal(post.author.authorId);
              expect(post.published).to.equal(false);
              expect(post.category).to.equal("beginner");
            }
            done();
          });
      });
      it("Should get Blog Posts by CATEGORY=INTERMEDIATE and UNPUBLISHED option", (done) => {
        const userId = adminUser._id.toHexString();
        chai.request(server)
          .get("/api/posts")
          .set({ "Authorization": adminUserToken })
          .query({ category: "intermediate", publishedStatus: "unpublished" , byUser: true, userId })
          .end((err, res) => {
            if (err) done(err);
            const { responseMsg, blogPosts } = res.body as IndexBlogPostRes;
            expect(res.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(blogPosts).to.be.an("array");    
            expect(blogPosts.length).to.be.at.most(10);       
            for (const post of blogPosts) {
              expect(userId).to.equal(post.author.authorId);
              expect(post.published).to.equal(false);
              expect(post.category).to.equal("intermediate");
            }
            done();
          });
      });
      it("Should get Blog Posts by CATEGORY=ADVANCED and UNPUBLISHED option", (done) => {
        const userId = adminUser._id.toHexString();
        chai.request(server)
          .get("/api/posts")
          .set({ "Authorization": adminUserToken })
          .query({ category: "advanced", publishedStatus: "unpublished", byUser: true, userId })
          .end((err, res) => {
            if (err) done(err);
            const { responseMsg, blogPosts } = res.body as IndexBlogPostRes;
            expect(res.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(blogPosts).to.be.an("array");    
            expect(blogPosts.length).to.be.at.most(10);       
            for (const post of blogPosts) {
              expect(userId).to.equal(post.author.authorId);
              expect(post.published).to.equal(false);
              expect(post.category).to.equal("advanced");
            }
            done();
          });
      });
    });
    // END GET /api/posts //

    // GET /api/posts/:postId //
    describe("GET /api/posts/:post_id", () => {
      let adminUsersPublishedPost: IBlogPost;
      let adminUsersUnpublishedPost: IBlogPost;

      before( async () => {
        try {
          adminUsersPublishedPost = await BlogPost.findOne({ "author.authorId": adminUser._id }).where({ published: true });
          adminUsersUnpublishedPost = await BlogPost.findOne({ "author.authorId": adminUser._id }).where({ published: false });
        } catch (error) {
          console.log(error);
        }
      });

      it("Should be able to access OWN PUBLISHED post", (done) => {
        const postId = adminUsersPublishedPost._id.toHexString();
        chai.request(server)
          .get("/api/posts/" + postId)
          .set({ "Authorization": adminUserToken })
          .end((err, res) => {
            if (err) done(err);
            const { responseMsg, blogPost } = res.body as OneBlogPostRes;
            expect(res.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(blogPost).to.be.an("object");
            expect(blogPost.published).to.equal(true);
            done();
          });
      });
      it("Should able to access OWN UNPUBLISHED post", (done) => {
        const postId = adminUsersUnpublishedPost._id.toHexString();
        chai.request(server)
          .get("/api/posts/" + postId)
          .set({ "Authorization": adminUserToken })
          .end((err, res) => {
            if (err) done(err);
            const { responseMsg, blogPost } = res.body as OneBlogPostRes;
            expect(res.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(blogPost).to.be.an("object");
            expect(blogPost.published).to.equal(false);
            done();
          });
      });
    });
    // END GET /api/posts/:postId //
  });
  // END CONTEXT Admin logged in accessing own blog posts //

  // CONTEXT Admin logged in accessing other users blog posts //
  context("User logged in accessing other users blog posts", () => {
    
    // GET /api/posts //
    describe("GET /api/posts", () => {

      it("Should be able to access other users PUBLISHED posts", (done) => {
        const userId = otherUser._id.toHexString();
        chai.request(server)
          .get("/api/posts")
          .set({ "Authorization": adminUserToken })
          .query({ byUser: true, limit: numberOfPosts, userId })
          .end((err, res) => {
            if (err) done(err);
            const { responseMsg, blogPosts } = res.body as IndexBlogPostRes;
            expect(res.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(blogPosts).to.be.an("array");
            expect(blogPosts.length).to.equal(numOfOtherUserPublishedPosts);
            for (const post of blogPosts) {
              expect(post.published).to.equal(true);
            }
            done();
          });
      });
      it("Should be able to get other users UNPUBLISHED blog posts", (done) => {
        const otherUserId = otherUser._id.toHexString();
        chai.request(server)
          .get("/api/posts")
          .set({ "Authorization": adminUserToken })
          .query({ byUser: true, publishedStatus: "unpublished", limit: numberOfPosts,  userId: otherUserId })
          .end((err, res) => {
            if (err) done(err);
            const { responseMsg, blogPosts } = res.body as IndexBlogPostRes;
            expect(res.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(blogPosts).to.be.an("array");
            expect(blogPosts.length).to.equal(numOfOtherUserPublishedPosts);
            for (const post of blogPosts) {
              expect(post.published).to.equal(false);
            }
            done();
          });
      })
      it("Should be able get other users PUBLISHED Blog Posts by CATEGORY=ALL option", (done) => {
        const otherUserId = otherUser._id.toHexString();
        chai.request(server)
          .get("/api/posts")
          .set({ "Authorization": adminUserToken })
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
        const otherUserId = otherUser._id.toHexString();
        chai.request(server)
          .get("/api/posts")
          .set({ "Authorization": adminUserToken })
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
        const otherUserId = otherUser._id.toHexString();
        chai.request(server)
          .get("/api/posts")
          .set({ "Authorization": adminUserToken })
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
        const otherUserId = otherUser._id.toHexString();
        chai.request(server)
          .get("/api/posts")
          .set({ "Authorization": adminUserToken })
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
        const otherUserId = otherUser._id.toHexString();
        chai.request(server)
          .get("/api/posts")
          .set({ "Authorization": adminUserToken })
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
      it("Should be able get other users UNPUBLISHED Blog Posts by CATEGORY=ALL option", (done) => {
        const otherUserId = otherUser._id.toHexString();
        chai.request(server)
          .get("/api/posts")
          .set({ "Authorization": adminUserToken })
          .query({ byUser: true, category: "all", publishedStatus: "unpublished",  userId: otherUserId })
          .end((err, res) => {
            if (err) done(err);
            const { responseMsg, blogPosts } = res.body as IndexBlogPostRes;
            expect(res.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(blogPosts).to.be.an("array");
            expect(blogPosts.length).to.be.at.most(10);       
            for (const post of blogPosts) {
              expect(post.published).to.equal(false);
              expect(post.author.authorId).to.equal(otherUserId)
            }
            done();
          });
      });
      it("Should be able get other users UNPPUBLISHED Blog Posts by CATEGORY=INFORMATIONAL option", (done) => {
        const otherUserId = otherUser._id.toHexString();
        chai.request(server)
          .get("/api/posts")
          .set({ "Authorization": adminUserToken })
          .query({ byUser: true, category: "informational", publishedStatus: "unpublished",  userId: otherUserId })
          .end((err, res) => {
            if (err) done(err);
            const { responseMsg, blogPosts } = res.body as IndexBlogPostRes;
            expect(res.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(blogPosts).to.be.an("array");
            expect(blogPosts.length).to.be.at.most(10);       
            for (const post of blogPosts) {
              expect(post.published).to.equal(false);
              expect(post.category).to.equal("informational");
              expect(post.author.authorId).to.equal(otherUserId)
            }
            done();
          });
      });
      it("Should be able get other users UNPPUBLISHED Blog Posts by CATEGORY=BEGINNER option", (done) => {
        const otherUserId = otherUser._id.toHexString();
        chai.request(server)
          .get("/api/posts")
          .set({ "Authorization": adminUserToken })
          .query({ byUser: true, category: "beginner", publishedStatus: "unpublished",  userId: otherUserId })
          .end((err, res) => {
            if (err) done(err);
            const { responseMsg, blogPosts } = res.body as IndexBlogPostRes;
            expect(res.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(blogPosts).to.be.an("array");
            expect(blogPosts.length).to.be.at.most(10);       
            for (const post of blogPosts) {
              expect(post.published).to.equal(false);
              expect(post.category).to.equal("beginner");
              expect(post.author.authorId).to.equal(otherUserId)
            }
            done();
          });
      });
      it("Should be able get other users UNPPUBLISHED Blog Posts by CATEGORY=INTERMEDIATE option", (done) => {
        const otherUserId = otherUser._id.toHexString();
        chai.request(server)
          .get("/api/posts")
          .set({ "Authorization": adminUserToken })
          .query({ byUser: true, category: "intermediate", publishedStatus: "unpublished",  userId: otherUserId })
          .end((err, res) => {
            if (err) done(err);
            const { responseMsg, blogPosts } = res.body as IndexBlogPostRes;
            expect(res.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(blogPosts).to.be.an("array");
            expect(blogPosts.length).to.be.at.most(10);       
            for (const post of blogPosts) {
              expect(post.published).to.equal(false);
              expect(post.category).to.equal("intermediate");
              expect(post.author.authorId).to.equal(otherUserId)
            }
            done();
          });
      });
      it("Should be able get other users UNPPUBLISHED Blog Posts by CATEGORY=ADVANCED option", (done) => {
        const otherUserId = otherUser._id.toHexString();
        chai.request(server)
          .get("/api/posts")
          .set({ "Authorization": adminUserToken })
          .query({ byUser: true, category: "advanced", publishedStatus: "unpublished",  userId: otherUserId })
          .end((err, res) => {
            if (err) done(err);
            const { responseMsg, blogPosts } = res.body as IndexBlogPostRes;
            expect(res.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(blogPosts).to.be.an("array");
            expect(blogPosts.length).to.be.at.most(10);       
            for (const post of blogPosts) {
              expect(post.published).to.equal(false);
              expect(post.category).to.equal("advanced");
              expect(post.author.authorId).to.equal(otherUserId)
            }
            done();
          });
      });
    });
    // END GET /api/posts //

    // GET /api/posts/:postId //
    describe("GET /api/posts/:post_id", () => {
      let otherUsersPublishedPost: IBlogPost;
      let otherUsersUnpublishedPost: IBlogPost;

      before( async () => {
        try {
          otherUsersPublishedPost = await BlogPost.findOne({ "author.authorId": otherUser._id }).where({ published: true });
          otherUsersUnpublishedPost = await BlogPost.findOne({ "author.authorId": otherUser._id }).where({ published: false });
        } catch (error) {
          console.log(error);
        }
      });

      it("Should be able to access other users PUBLISHED post", (done) => {
        const postId = otherUsersPublishedPost._id.toHexString();
        chai.request(server)
          .get("/api/posts/" + postId)
          .set({ "Authorization": adminUserToken })
          .end((err, res) => {
            if (err) done(err);
            const { responseMsg, blogPost } = res.body as OneBlogPostRes;
            expect(res.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(blogPost).to.be.an("object");
            expect(blogPost.published).to.equal(true);
            done();
          });
      });
      it("Should able to access other users UNPUBLISHED post", (done) => {
        const postId = otherUsersUnpublishedPost._id.toHexString();
        chai.request(server)
          .get("/api/posts/" + postId)
          .set({ "Authorization": adminUserToken })
          .end((err, res) => {
            if (err) done(err);
            const { responseMsg, blogPost } = res.body as OneBlogPostRes;
            expect(res.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(blogPost).to.be.an("object");
            expect(blogPost.published).to.equal(false);
            done();
          });
      });
    });
    // END GET /api/posts/:postId //
  });
  // END CONTEXT //s
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

export {};