// test tooling //
import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
// models //
// server //
import { ServerInstance } from "@/server/src/server";
// models //
import Admin from "@/server/src/models/Admin";
import BlogPost from "@/server/src/models/BlogPost";
// helpers //
import { generateMockBlogPosts, generateMockAdmins } from "@/server/src/_helpers/mockDataGeneration";
import { loginUser, countBlogPosts, generateMockPostData } from "../../../hepers/testHelpers";
// types //
import type { Express } from "express";
import type { IAdmin } from "@/server/src/models/Admin";
import type { BlogPostClientData } from "@/server/src/_types/blog_posts/blogPostTypes";
import type { CreateBlogPostRes, BlogPostData, ErrorBlogPostRes } from "@/redux/_types/blog_posts/dataTypes";

chai.use(chaiHTTP);

describe("BlogPost Admin logged in API tests POST tests", function() {
  this.timeout(10000);
  let server: Express;
  let numberOfPosts: number; 
  let numberOfAdminPosts: number;
  let adminUser: IAdmin; 
  let adminUserToken: string;
  //
  let mockBlogPostData: BlogPostClientData;
  let _createdBlogPost: BlogPostData;

  // set up server, DB and create admins //
  before(async () => {
    try {
      server = ServerInstance.getExpressServer();
      await generateMockAdmins(1)
      adminUser = await Admin.findOne({});
    } catch (error) {
      throw(error);
    }
  });
  // create blog post models //
  before(async() => {
    try {
      const adminId: string = adminUser._id.toHexString();
      // generate mock data //
      await generateMockBlogPosts({ number: 10, user: adminUser });
      mockBlogPostData = generateMockPostData({ authorId: adminId, name: adminUser.firstName });
      // get model counts //
      numberOfPosts = await countBlogPosts({});
      numberOfAdminPosts = await countBlogPosts({ specificUserId: adminId });
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
  context("POST API Tests with valid data", () => {
    // POST TESTS //
    describe("POST /api/posts", () => {
      it("Should correctly CREATE a new <BlogPost> model and send back correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: adminUserToken })
          .send({ blogPostData: mockBlogPostData })
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
        expect(_createdBlogPost.title).to.equal(mockBlogPostData.title);
        expect(_createdBlogPost.author.authorId).to.equal(adminUser._id.toHexString());
        expect(_createdBlogPost.author.name).to.equal(adminUser.firstName);
        expect(_createdBlogPost.content).to.equal(mockBlogPostData.content)
        expect(_createdBlogPost.published).to.equal(false);
        expect(_createdBlogPost.keywords).to.eql(mockBlogPostData.keywords);
        expect(_createdBlogPost.category).to.equal(mockBlogPostData.category);
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
      it("Should correctly increment the number of USER'S <BlogPost> model by 1", async () => {
        try {
          const updatedNumOfAdminPosts: number = await countBlogPosts({ specificUserId: adminUser._id.toHexString() });
          expect(updatedNumOfAdminPosts).to.equal(numberOfAdminPosts + 1);
          //
          numberOfAdminPosts = updatedNumOfAdminPosts;
        } catch (error) {
          throw error;
        }
      });
    });
    // END POST tests //
  });
  // END CONTEXT POST API Tests with valid data //

  // CONTEXT POST API Tests with invalid data //
  context("POST /api/posts - invalid data", () =>  {
    // invalid title field //
    describe("POST /api/posts - invalid <BlogPost.title>", () => {
      it("Should NOT create a new <BlogPost> model without a <title> field and return a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: adminUserToken })
          .send({ blogPostData: { ...mockBlogPostData, title: "" } })
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
          .post("/api/posts")
          .set({ Authorization: adminUserToken })
          .send({ blogPostData: { ...mockBlogPostData, title: {} } })
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
    // invalid author field //
    describe("POST /api/posts - invalid <BlogPost.author>", () => {
      it("Should NOT create a new <BlogPost> model without an <author> field and return a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: adminUserToken })
          .send({ blogPostData: { ...mockBlogPostData, author: null } })
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
      it("Should NOT create a new <BlogPost> model without an <author.authorId> field and return a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: adminUserToken })
          .send({ blogPostData: { ...mockBlogPostData, author: { authorId: null, name: "name" } } })
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
      it("Should NOT create a new <BlogPost> model without an <author.name> field and return a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: adminUserToken })
          .send({ blogPostData: { ...mockBlogPostData, author: { authorId: "id", name: null } } })
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
      it("Should NOT create a new <BlogPost> model with an INCORRECT <author> field TYPE and return a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: adminUserToken })
          .send({ blogPostData: { ...mockBlogPostData, author: "author" } })
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
      it("Should NOT create a new <BlogPost> model with an INCORRECT <author.authorId> field TYPE and return a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: adminUserToken })
          .send({ blogPostData: { ...mockBlogPostData, author: { authorId: "bbllleaf", name: "name" } } })
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
      it("Should NOT create a new <BlogPost> model wit an INCORRECT <author.name> field TYPE and return a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: adminUserToken })
          .send({ blogPostData: { ...mockBlogPostData, author: { authorId: "id", name: {} } } })
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
    describe("POST /api/posts - invalid <BlogPost.content>", () => {
      it("Should NOT create a new <BlogPost> model without a <content> field and return a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: adminUserToken })
          .send({ blogPostData: { ...mockBlogPostData, content: "" } })
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
      it("Should NOT create a new <BlogPost> model with an INCORRECT <content> field and return a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: adminUserToken })
          .send({ blogPostData: { ...mockBlogPostData, content: {} } })
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
    describe("POST /api/posts - invalid <BlogPost.category>", () => {
      it("Should NOT create a new <BlogPost> model with an empty <category> field and return a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: adminUserToken })
          .send({ blogPostData: { ...mockBlogPostData, category: "" } })
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
      it("Should NOT create a new <BlogPost> model with a non approved <category> field and return a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: adminUserToken })
          .send({ blogPostData: { ...mockBlogPostData, category: "thisisnotvalid" } })
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
      it("Should NOT create a new <BlogPost> model with an INCORRECT <category> field TYPE and return a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: adminUserToken })
          .send({ blogPostData: { ...mockBlogPostData, category: [] } })
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
    describe("POST /api/posts - invalid <BlogPost.keywords>", () => {
      it("Should NOT create a new <BlogPost> model with empty <keywords> field and return a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: adminUserToken })
          .send({ blogPostData: { ...mockBlogPostData, keywords: "" } })
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
      it("Should NOT create a new <BlogPost> model with an INCORRECT <keywords> field TYPE and return a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: adminUserToken })
          .send({ blogPostData: { ...mockBlogPostData, category: {} } })
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
      it("Should NOT create a new <BlogPost> model with an EMPTY <keywords> ARRAY and return a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: adminUserToken })
          .send({ blogPostData: { ...mockBlogPostData, category: [] } })
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
  });
  // END CONTEXT POST API Tets with invalid data //
  after(async () => {
    try {
      await Admin.deleteMany({});
      await BlogPost.deleteMany({});
    } catch (error) {
      console.log(error);
    }
  });
});