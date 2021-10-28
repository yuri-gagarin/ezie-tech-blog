import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
// models //
import BlogPost from "@/server/src/models/BlogPost";
import Admin from "@/server/src/models/Admin";
import User from "@/server/src/models/User";
// server //
import { ServerInstance } from "../../../../src/server";
// types //
import type { Express } from "express";
import type { IAdmin } from "@/server/src/models/Admin";
import type { IUser } from "@/server/src/models/User";
import type { BlogPostData, CreateBlogPostRes, ErrorBlogPostRes } from "@/redux/_types/blog_posts/dataTypes";
import type { BlogPostClientData } from "@/server/src/_types/blog_posts/blogPostTypes";
// helpers //
import { generateMockAdmins, generateMockBlogPosts, generateMockUsers } from "@/server/src/_helpers/mockDataGeneration";
import { generateMockPostData, loginUser } from "../../../hepers/testHelpers";

chai.use(chaiHTTP);

describe("BlogPostsController:Create POST API Tests", () => {
  let server: Express;
  let numberOfBlogPosts: number;
  let mockBlogPostData: BlogPostClientData;
  let secondMockBlogPostData: BlogPostClientData;
  // user models //
  let adminUser: IAdmin;
  let contributorUser: IUser;
  let readerUser: IUser;
  // login tokens //
  let adminToken: string;
  let contributorToken: string;
  let readerToken: string;

  before(() => {
    server = ServerInstance.getExpressServer();
  });
  before(async () => {
    try {
      await generateMockAdmins(1);
      await generateMockUsers({ number: 1, confirmed: true, type: "CONTRIBUTOR" });
      await generateMockUsers({ number: 1, confirmed: true, type: "READER" });
    } catch (error) {
      throw error;
    }
  });
  before(async () => {
    try {
      adminUser = await Admin.findOne({});
      contributorUser = await User.findOne({ userType: "CONTRIBUTOR" });
      readerUser = await User.findOne({ userType: "READER" });
      //
      await generateMockBlogPosts({ number: 10, user: contributorUser });
      numberOfBlogPosts = await BlogPost.countDocuments();
      // mock blogpost data //
      mockBlogPostData = generateMockPostData({ authorId: contributorUser._id.toHexString(), name: contributorUser.firstName });
      secondMockBlogPostData = generateMockPostData({ authorId: adminUser._id.toHexString(), name: adminUser.firstName });
    } catch (error) {
      throw error;
    }
  });
  // login users //
  before(async () => {
    try {
      const { email: adminEmail } = adminUser;
      const { email: contributorEmail } = contributorUser;
      const { email: readerEmail } = readerUser;
      // assign tokens //
      ({ userJWTToken: adminToken } = await loginUser({ server, chai, email: adminEmail }));
      ({ userJWTToken: contributorToken } = await loginUser({ server, chai, email: contributorEmail }));
      ({ userJWTToken: readerToken } = await loginUser({ server, chai, email: readerEmail }));
      //
    } catch (error) {
      throw error;
    }
  });

  // CONTEXT Guest client no login //
  context("Guest client - no Login", () => {
    describe("POST /api/users - default response INVALID data", () => {
      it("Should NOT create a new <BlogPost> model and send back a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .send({ blogPostData: {} })
          .end((error, response) => {
            if (error) done(error);
            // response is at the moment general //
            expect(response.status).to.equal(401);
            //
            expect(response.body.createdBogPost).to.be.undefined;
            done();
          })
      });
      it("Should NOT alter the number of <BlogPost> models in the database", async () => {
        try {
          const updatedNumOfBlogPosts: number = await BlogPost.countDocuments();
          //
          expect(updatedNumOfBlogPosts).to.equal(numberOfBlogPosts);
        } catch (error) {
          throw error;
        }
      });
    });
    describe("POST /api/uers - default response VALID data", () => {
      it("Should NOT create a new <BlogPost> model and send back a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .send({ blogPostData: mockBlogPostData })
          .end((error, response) => {
            if (error) done(error);
            // response is at the moment general //
            expect(response.status).to.equal(401);
            //
            expect(response.body.createdBogPost).to.be.undefined;
            done();
          })
      });
      it("Should NOT alter the number of <BlogPost> models in the database", async () => {
        try {
          const updatedNumOfBlogPosts: number = await BlogPost.countDocuments();
          //
          expect(updatedNumOfBlogPosts).to.equal(numberOfBlogPosts);
        } catch (error) {
          throw error;
        }
      });
    });
  });
  // END CONTEXT Guest client no login //

  // CONTEXT User logged in READER account //
  context("User client - READER account", () => {
    describe("POST /api/users - default response INVALID data", () => {
      it("Should NOT create a new <BlogPost> model and send back a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: readerToken })
          .send({ blogPostData: {} })
          .end((err, response) => {
            if (err) done(err);
            const { status } = response;
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes; 
            expect(status).to.equal(401);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(response.body.createdBogPost).to.be.undefined;
            done();
          })
      });
      it("Should NOT alter the number of <BlogPost> models in the database", async () => {
        try {
          const updatedNumOfBlogPosts: number = await BlogPost.countDocuments();
          //
          expect(updatedNumOfBlogPosts).to.equal(numberOfBlogPosts);
        } catch (error) {
          throw error;
        }
      });
    });
    describe("POST /api/uers - default response VALID data", () => {
      it("Should NOT create a new <BlogPost> model and send back a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: readerToken })
          .send({ blogPostData: mockBlogPostData })
          .end((err, response) => {
            if (err) done(err);
            const { status } = response;
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes; 
            expect(status).to.equal(401);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(response.body.createdBogPost).to.be.undefined;
            done();
          })
      });
      it("Should NOT alter the number of <BlogPost> models in the database", async () => {
        try {
          const updatedNumOfBlogPosts: number = await BlogPost.countDocuments();
          //
          expect(updatedNumOfBlogPosts).to.equal(numberOfBlogPosts);
        } catch (error) {
          throw error;
        }
      });
    });
  });
  // END CONTEXT Logged in READER account //

  // CONTEXT User logged in CONTRIBUTOR account //
  context("USER client - CONTRIBUTOR account", () => {
    describe("POST /api/users - default response INVALID data", () => {
      it("Should NOT create a new <BlogPost> model with an EMPTY TITLE field and send back a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: contributorToken })
          .send({ blogPostData: { ...mockBlogPostData, title: "" } })
          .end((err, response) => {
            if (err) done(err);
            const { status } = response;
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes; 
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(response.body.createdBogPost).to.be.undefined;
            done();
          });
      });
      it("Should NOT create a new <BlogPost> model with an INVALID TITLE field TYPE and send back a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: contributorToken })
          .send({ blogPostData: { ...mockBlogPostData, title: {} } })
          .end((err, response) => {
            if (err) done(err);
            const { status } = response;
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes; 
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(response.body.createdBogPost).to.be.undefined;
            done();
          });
      });
      it("Should NOT create a new <BlogPost> model with an EMPTY AUTHOR field and send back a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: contributorToken })
          .send({ blogPostData: { ...mockBlogPostData, author: "" } })
          .end((err, response) => {
            if (err) done(err);
            const { status } = response;
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes; 
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(response.body.createdBogPost).to.be.undefined;
            done();
          });
      });
      it("Should NOT create a new <BlogPost> model with an INVALID AUTHOR field TYPE and send back a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: contributorToken })
          .send({ blogPostData: { ...mockBlogPostData, author: "notvalid" } })
          .end((err, response) => {
            if (err) done(err);
            const { status } = response;
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes; 
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(response.body.createdBogPost).to.be.undefined;
            done();
          });
      });
      it("Should NOT create a new <BlogPost> model with an EMTPY AUTHOR.AUTHOR_ID field and send back a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: contributorToken })
          .send({ blogPostData: { ...mockBlogPostData, author: { ...mockBlogPostData.author, authorId: "" } } })
          .end((err, response) => {
            if (err) done(err);
            const { status } = response;
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes; 
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(response.body.createdBogPost).to.be.undefined;
            done();
          });
      });
      it("Should NOT create a new <BlogPost> model with an INVALID AUTHOR.AUTHOR_ID field TYPE and send back a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: contributorToken })
          .send({ blogPostData: { ...mockBlogPostData, author: { ...mockBlogPostData.author, authorId: "notvalidObjectId" } } })
          .end((err, response) => {
            if (err) done(err);
            const { status } = response;
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes; 
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(response.body.createdBogPost).to.be.undefined;
            done();
          });
      });
      it("Should NOT create a new <BlogPost> model with an EMPTY AUTHOR.NAME field and send back a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: contributorToken })
          .send({ blogPostData: { ...mockBlogPostData, author: { ...mockBlogPostData.author, name: "" } } })
          .end((err, response) => {
            if (err) done(err);
            const { status } = response;
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes; 
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(response.body.createdBogPost).to.be.undefined;
            done();
          });
      });
      it("Should NOT create a new <BlogPost> model with an INVALID AUTHOR.NAME field TYPE and send back a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: contributorToken })
          .send({ blogPostData: { ...mockBlogPostData, author: { ...mockBlogPostData.author, name: {} } } })
          .end((err, response) => {
            if (err) done(err);
            const { status } = response;
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes; 
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(response.body.createdBogPost).to.be.undefined;
            done();
          });
      });
      it("Should NOT create a new <BlogPost> model with an EMPTY CONTENT field and send back a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: contributorToken })
          .send({ blogPostData: { ...mockBlogPostData, content: "" } })
          .end((err, response) => {
            if (err) done(err);
            const { status } = response;
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes; 
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(response.body.createdBogPost).to.be.undefined;
            done();
          });
      });
      it("Should NOT create a new <BlogPost> model with an INVALID CONTENT field TYPE and send back a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: contributorToken })
          .send({ blogPostData: { ...mockBlogPostData, content: {} } })
          .end((err, response) => {
            if (err) done(err);
            const { status } = response;
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes; 
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(response.body.createdBogPost).to.be.undefined;
            done();
          });
      });
      it("Should NOT create a new <BlogPost> model with an EMPTY KEYWORDS field and send back a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: contributorToken })
          .send({ blogPostData: { ...mockBlogPostData, keywords: [] } })
          .end((err, response) => {
            if (err) done(err);
            const { status } = response;
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes; 
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(response.body.createdBogPost).to.be.undefined;
            done();
          });
      });
      it("Should NOT create a new <BlogPost> model with an INVALID KEYWORDS field TYPE and send back a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: contributorToken })
          .send({ blogPostData: { ...mockBlogPostData, keywords: "stringorsomething" } })
          .end((err, response) => {
            if (err) done(err);
            const { status } = response;
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes; 
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(response.body.createdBogPost).to.be.undefined;
            done();
          });
      });
      it("Should NOT create a new <BlogPost> model with an EMPTY CATEGORY field and send back a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: contributorToken })
          .send({ blogPostData: { ...mockBlogPostData, category: "" } })
          .end((err, response) => {
            if (err) done(err);
            const { status } = response;
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes; 
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(response.body.createdBogPost).to.be.undefined;
            done();
          });
      });
      it("Should NOT create a new <BlogPost> model with an INVALID CATEGORY field TYPE and send back a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: contributorToken })
          .send({ blogPostData: { ...mockBlogPostData, category: {} } })
          .end((err, response) => {
            if (err) done(err);
            const { status } = response;
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes; 
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(response.body.createdBogPost).to.be.undefined;
            done();
          });
      });
      it("Should NOT create a new <BlogPost> model with an NON APPROVED CATEGORY field NAME and send back a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: contributorToken })
          .send({ blogPostData: { ...mockBlogPostData, category: "notpartofcategories" } })
          .end((err, response) => {
            if (err) done(err);
            const { status } = response;
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes; 
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(response.body.createdBogPost).to.be.undefined;
            done();
          });
      });
      it("Should NOT alter the number of <BlogPost> models in the database", async () => {
        try {
          const updatedNumOfBlogPosts: number = await BlogPost.countDocuments();
          //
          expect(updatedNumOfBlogPosts).to.equal(numberOfBlogPosts);
        } catch (error) {
          throw error;
        }
      });
    });
    describe("POST /api/uers - default response VALID data", () => {
      let _createdBlogPost: BlogPostData;
      it("Should CORRECTLY create a NEW <BlogPost> model and send back a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: contributorToken })
          .send({ blogPostData: mockBlogPostData })
          .end((err, response) => {
            if (err) done(err);
            const { status } = response;
            const { responseMsg, createdBlogPost } = response.body as CreateBlogPostRes; 
            expect(status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(createdBlogPost).to.be.an("object");
            // 
            expect(response.body.error).to.be.undefined;
            expect(response.body.errorMessages).to.be.undefined;
            //
            _createdBlogPost = createdBlogPost;
            done();
          });
      });
      it("Should correctly set the new <BlogPost> model fields", () => {
        expect(_createdBlogPost._id).to.be.a("string");
        expect(_createdBlogPost.title).to.equal(mockBlogPostData.title);
        expect(_createdBlogPost.content).to.equal(mockBlogPostData.content);
        expect(_createdBlogPost.author).to.eql(mockBlogPostData.author);
        expect(_createdBlogPost.keywords).to.eql(mockBlogPostData.keywords);
        expect(_createdBlogPost.category).to.equal(mockBlogPostData.category);
        expect(_createdBlogPost.published).to.equal(false);
        expect(_createdBlogPost.editedAt).to.be.a("string");
        expect(_createdBlogPost.createdAt).to.be.a("string");       
      })
      it("Should insert <BlogPost> model in the database and increment the number of <BlogPost> by 1", async () => {
        try {
          const createdBlogPost = await BlogPost.findOne({ _id: _createdBlogPost._id });
          const updatedNumOfBlogPosts: number = await BlogPost.countDocuments();
          // assert //
          expect(updatedNumOfBlogPosts).to.equal(numberOfBlogPosts + 1);
          expect(createdBlogPost).to.not.be.null;
          //
          numberOfBlogPosts = updatedNumOfBlogPosts;
        } catch (error) {
          throw error;
        }
      });
    });
  });
  // END CONTEXT Logged in READER account //
  // CONTEXT Logged in ADMIN ACCOUNT //
  context("ADMIN client - ADMIN account", () => {
    describe("POST /api/users - default response INVALID data", () => {
      it("Should NOT create a new <BlogPost> model with an EMPTY TITLE field and send back a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: adminToken })
          .send({ blogPostData: { ...secondMockBlogPostData, title: "" } })
          .end((err, response) => {
            if (err) done(err);
            const { status } = response;
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes; 
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(response.body.createdBogPost).to.be.undefined;
            done();
          });
      });
      it("Should NOT create a new <BlogPost> model with an INVALID TITLE field TYPE and send back a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: adminToken })
          .send({ blogPostData: { ...secondMockBlogPostData, title: {} } })
          .end((err, response) => {
            if (err) done(err);
            const { status } = response;
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes; 
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(response.body.createdBogPost).to.be.undefined;
            done();
          });
      });
      it("Should NOT create a new <BlogPost> model with an EMPTY AUTHOR field and send back a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: adminToken })
          .send({ blogPostData: { ...secondMockBlogPostData, author: "" } })
          .end((err, response) => {
            if (err) done(err);
            const { status } = response;
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes; 
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(response.body.createdBogPost).to.be.undefined;
            done();
          });
      });
      it("Should NOT create a new <BlogPost> model with an INVALID AUTHOR field TYPE and send back a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: adminToken })
          .send({ blogPostData: { ...secondMockBlogPostData, author: "notvalid" } })
          .end((err, response) => {
            if (err) done(err);
            const { status } = response;
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes; 
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(response.body.createdBogPost).to.be.undefined;
            done();
          });
      });
      it("Should NOT create a new <BlogPost> model with an EMTPY AUTHOR.AUTHOR_ID field and send back a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: adminToken })
          .send({ blogPostData: { ...secondMockBlogPostData, author: { ...secondMockBlogPostData.author, authorId: "" } } })
          .end((err, response) => {
            if (err) done(err);
            const { status } = response;
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes; 
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(response.body.createdBogPost).to.be.undefined;
            done();
          });
      });
      it("Should NOT create a new <BlogPost> model with an INVALID AUTHOR.AUTHOR_ID field TYPE and send back a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: adminToken })
          .send({ blogPostData: { ...secondMockBlogPostData, author: { ...secondMockBlogPostData.author, authorId: "notvalidObjectId" } } })
          .end((err, response) => {
            if (err) done(err);
            const { status } = response;
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes; 
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(response.body.createdBogPost).to.be.undefined;
            done();
          });
      });
      it("Should NOT create a new <BlogPost> model with an EMPTY AUTHOR.NAME field and send back a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: adminToken })
          .send({ blogPostData: { ...secondMockBlogPostData, author: { ...secondMockBlogPostData.author, name: "" } } })
          .end((err, response) => {
            if (err) done(err);
            const { status } = response;
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes; 
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(response.body.createdBogPost).to.be.undefined;
            done();
          });
      });
      it("Should NOT create a new <BlogPost> model with an INVALID AUTHOR.NAME field TYPE and send back a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: adminToken })
          .send({ blogPostData: { ...secondMockBlogPostData, author: { ...secondMockBlogPostData.author, name: {} } } })
          .end((err, response) => {
            if (err) done(err);
            const { status } = response;
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes; 
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(response.body.createdBogPost).to.be.undefined;
            done();
          });
      });
      it("Should NOT create a new <BlogPost> model with an EMPTY CONTENT field and send back a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: adminToken })
          .send({ blogPostData: { ...secondMockBlogPostData, content: "" } })
          .end((err, response) => {
            if (err) done(err);
            const { status } = response;
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes; 
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(response.body.createdBogPost).to.be.undefined;
            done();
          });
      });
      it("Should NOT create a new <BlogPost> model with an INVALID CONTENT field TYPE and send back a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: adminToken })
          .send({ blogPostData: { ...secondMockBlogPostData, content: {} } })
          .end((err, response) => {
            if (err) done(err);
            const { status } = response;
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes; 
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(response.body.createdBogPost).to.be.undefined;
            done();
          });
      });
      it("Should NOT create a new <BlogPost> model with an EMPTY KEYWORDS field and send back a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: adminToken })
          .send({ blogPostData: { ...secondMockBlogPostData, keywords: [] } })
          .end((err, response) => {
            if (err) done(err);
            const { status } = response;
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes; 
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(response.body.createdBogPost).to.be.undefined;
            done();
          });
      });
      it("Should NOT create a new <BlogPost> model with an INVALID KEYWORDS field TYPE and send back a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: adminToken })
          .send({ blogPostData: { ...secondMockBlogPostData, keywords: "stringorsomething" } })
          .end((err, response) => {
            if (err) done(err);
            const { status } = response;
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes; 
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(response.body.createdBogPost).to.be.undefined;
            done();
          });
      });
      it("Should NOT create a new <BlogPost> model with an EMPTY CATEGORY field and send back a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: adminToken })
          .send({ blogPostData: { ...secondMockBlogPostData, category: "" } })
          .end((err, response) => {
            if (err) done(err);
            const { status } = response;
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes; 
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(response.body.createdBogPost).to.be.undefined;
            done();
          });
      });
      it("Should NOT create a new <BlogPost> model with an INVALID CATEGORY field TYPE and send back a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: adminToken })
          .send({ blogPostData: { ...secondMockBlogPostData, category: {} } })
          .end((err, response) => {
            if (err) done(err);
            const { status } = response;
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes; 
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(response.body.createdBogPost).to.be.undefined;
            done();
          });
      });
      it("Should NOT create a new <BlogPost> model with an NON APPROVED CATEGORY field NAME and send back a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: adminToken })
          .send({ blogPostData: { ...secondMockBlogPostData, category: "notpartofcategories" } })
          .end((err, response) => {
            if (err) done(err);
            const { status } = response;
            const { responseMsg, error, errorMessages } = response.body as ErrorBlogPostRes; 
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(response.body.createdBogPost).to.be.undefined;
            done();
          });
      });
      it("Should NOT alter the number of <BlogPost> models in the database", async () => {
        try {
          const updatedNumOfBlogPosts: number = await BlogPost.countDocuments();
          //
          expect(updatedNumOfBlogPosts).to.equal(numberOfBlogPosts);
        } catch (error) {
          throw error;
        }
      });
    });
    describe("POST /api/uers - default response VALID data", () => {
      let _createdBlogPost: BlogPostData;
      it("Should CORRECTLY create a NEW <BlogPost> model and send back a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: adminToken })
          .send({ blogPostData: secondMockBlogPostData })
          .end((err, response) => {
            if (err) done(err);
            const { status } = response;
            const { responseMsg, createdBlogPost } = response.body as CreateBlogPostRes; 
            expect(status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(createdBlogPost).to.be.an("object");
            // 
            expect(response.body.error).to.be.undefined;
            expect(response.body.errorMessages).to.be.undefined;
            //
            _createdBlogPost = createdBlogPost;
            done();
          });
      });
      it("Should correctly set the new <BlogPost> model fields", () => {
        expect(_createdBlogPost._id).to.be.a("string");
        expect(_createdBlogPost.title).to.equal(secondMockBlogPostData.title);
        expect(_createdBlogPost.content).to.equal(secondMockBlogPostData.content);
        expect(_createdBlogPost.author).to.eql(secondMockBlogPostData.author);
        expect(_createdBlogPost.keywords).to.eql(secondMockBlogPostData.keywords);
        expect(_createdBlogPost.category).to.equal(secondMockBlogPostData.category);
        expect(_createdBlogPost.published).to.equal(false);
        expect(_createdBlogPost.editedAt).to.be.a("string");
        expect(_createdBlogPost.createdAt).to.be.a("string");       
      })
      it("Should insert <BlogPost> model in the database and increment the number of <BlogPost> by 1", async () => {
        try {
          const createdBlogPost = await BlogPost.findOne({ _id: _createdBlogPost._id });
          const updatedNumOfBlogPosts: number = await BlogPost.countDocuments();
          // assert //
          expect(updatedNumOfBlogPosts).to.equal(numberOfBlogPosts + 1);
          expect(createdBlogPost).to.not.be.null;
          //
          numberOfBlogPosts = updatedNumOfBlogPosts;
        } catch (error) {
          throw error;
        }
      });
    });
  });
  // END CONTEXT Logged in ADMIN ACCOUNT //
  after(async () => {
    try {
      await Admin.deleteMany({});
      await User.deleteMany({});
      await BlogPost.deleteMany({});
    } catch (error) {
      throw error;
    }
  });
});