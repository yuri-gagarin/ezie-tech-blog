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
import type { IBlogPost } from "@/server/src/models/BlogPost";
import type { BlogPostData, EditBlogPostRes, ErrorBlogPostRes } from "@/redux/_types/blog_posts/dataTypes";
import type { BlogPostClientData } from "@/server/src/_types/blog_posts/blogPostTypes";
// helpers //
import { generateMockAdmins, generateMockBlogPosts, generateMockUsers } from "@/server/src/_helpers/mockDataGeneration";
import { generateMockPostData, loginUser } from "../../../hepers/testHelpers";

chai.use(chaiHTTP);


// Tests should cover all use cases in BlogPostsController:Edit action //
// As it stand now, non logged in clients have no privileges //
// A logged in User can EDIT their own Blog Post model provided they have CONTRIBUTOR <userType> //
// A logged in User with READER <userType> cannot edit //
describe("BlogPostsController:Edit PATCH API Tests", () => {
  let server: Express;
  let numberOfBlogPosts: number;
  let mockBlogPostData: BlogPostClientData;
  // user models //
  let adminUser: IAdmin;
  let contributorUser: IUser;
  let otherContributorUser: IUser;
  let readerUser: IUser;
  // blog post models //
  let adminUsersBlogPost: IBlogPost;
  let firstUsersBlogPost: IBlogPost;
  let secondUsersBlogPost: IBlogPost;
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
      await generateMockUsers({ number: 2, confirmed: true, type: "CONTRIBUTOR" });
      await generateMockUsers({ number: 1, confirmed: true, type: "READER" });
    } catch (error) {
      throw error;
    }
  });
  before(async () => {
    try {
      adminUser = await Admin.findOne({});
      readerUser = await User.findOne({ userType: "READER" });
      const contributorUsers: IUser[] = await User.find({ userType: "CONTRIBUTOR" });
      ([ contributorUser, otherContributorUser ] = contributorUsers);
      //
      await generateMockBlogPosts({ number: 10, user: adminUser });
      await generateMockBlogPosts({ number: 10, user: contributorUser });
      await generateMockBlogPosts({ number: 10, user: otherContributorUser });
      //
      adminUsersBlogPost = await BlogPost.findOne({ "author.authorId": adminUser._id });
      firstUsersBlogPost = await BlogPost.findOne({ "author.authorId": contributorUser._id });
      secondUsersBlogPost = await BlogPost.findOne({ "author.authorId": otherContributorUser._id });
      numberOfBlogPosts = await BlogPost.countDocuments();
      // mock blogpost data //
      mockBlogPostData = generateMockPostData({ authorId: contributorUser._id.toHexString(), name: contributorUser.firstName });
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
    let firstUsersPostId: string;
    before(() => {
      firstUsersPostId = firstUsersBlogPost._id.toHexString();
    });
    describe("PATCH /api/posts/:post_id - default response INVALID data", () => {
      it("Should NOT update an existing <BlogPost> model and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/posts/${firstUsersPostId}`)
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
    describe("PATCH /api/posts/:post_id - default response VALID data", () => {
      it("Should NOT update an existing <BlogPost> model and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/posts/${firstUsersPostId}`)
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
    let firstUsersPostId: string;
    before(() => {
      firstUsersPostId = firstUsersBlogPost._id.toHexString();
    });
    describe("PATCH /api/posts/:post_id - default response INVALID data", () => {
      it("Should NOT update an existing <BlogPost> model and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/posts/${firstUsersPostId}`)
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
    describe("PATCH /api/posts/:post_id - default response VALID data", () => {
      it("Should NOT update an existing <BlogPost> model and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/posts/${firstUsersPostId}`)
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

  // CONTEXT User Logged in CONTRIBUTOR account //
  context('User client - CONTRIBUTOR account', () => {
    let firstUsersPostId: string;
    let secondUsersPostId: string;
    before(() => {
      firstUsersPostId = firstUsersBlogPost._id.toHexString();
      secondUsersPostId = secondUsersBlogPost._id.toHexString();
    });
    // TEST OWN Blog Post, invalid data //
    describe("PATCH /api/posts/:post_id - own BlogPost - default response INVALID data", () => {
      it("Should NOT update an existing <BlogPost> model with an EMPTY TITLE field and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/posts/${firstUsersPostId}`)
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
      it("Should NOT update an existing <BlogPost> model with an INVALID TITLE field TYPE and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/posts/${firstUsersPostId}`)
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
      it("Should NOT update an existing <BlogPost> model with an EMPTY CONTENT field and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/posts/${firstUsersPostId}`)
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
      it("Should NOT update an existing <BlogPost> model with an INVALID CONTENT field TYPE and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/posts/${firstUsersPostId}`)
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
      it("Should NOT update an existing <BlogPost> model with an EMPTY KEYWORDS field and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/posts/${firstUsersPostId}`)
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
      it("Should NOT update an existing <BlogPost> model with an INVALID KEYWORDS field TYPE and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/posts/${firstUsersPostId}`)
          .set({ Authorization: contributorToken })
          .send({ blogPostData: { ...mockBlogPostData, keywords: "invalid" } })
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
      it("Should NOT update an existing <BlogPost> model with an EMPTY CATEGORY field and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/posts/${firstUsersPostId}`)
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
      it("Should NOT update an existing <BlogPost> model with an INVALID CATEGORY field TYPE and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/posts/${firstUsersPostId}`)
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
      it("Should NOT update an existing <BlogPost> model with a NON APPROVED CATEGORY field  and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/posts/${firstUsersPostId}`)
          .set({ Authorization: contributorToken })
          .send({ blogPostData: { ...mockBlogPostData, category: "notavalidcategory" } })
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
    });
    // END TEST OWN Blog Post, invalid data //
    // TEST OWN Blog Post, valid data //
    describe("PATCH /api/posts/:post_id - own Blog Post - default response VALID data", () => {
      let _editedBlogPost: BlogPostData;
      it("Should CORRECTLY update an existing <BlogPost> model and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/posts/${firstUsersPostId}`)
          .set({ Authorization: contributorToken })
          .send({ blogPostData: mockBlogPostData })
          .end((err, response) => {
            if (err) done(err);
            const { status } = response;
            const { responseMsg, editedBlogPost } = response.body as EditBlogPostRes; 
            expect(status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(editedBlogPost).to.be.an("object");
            // 
            expect(response.body.error).to.be.undefined;
            expect(response.body.errorMessages).to.be.undefined;
            //
            _editedBlogPost = editedBlogPost;
            done();
          });
      });
      it("Should correctly set the new <BlogPost> model fields", () => {
        expect(_editedBlogPost._id).to.be.a("string");
        expect(_editedBlogPost.title).to.equal(mockBlogPostData.title);
        expect(_editedBlogPost.content).to.equal(mockBlogPostData.content);
        expect(_editedBlogPost.author).to.eql(mockBlogPostData.author);
        expect(_editedBlogPost.keywords).to.eql(mockBlogPostData.keywords);
        expect(_editedBlogPost.category).to.equal(mockBlogPostData.category);
        expect(_editedBlogPost.editedAt).to.be.a("string");
        expect(_editedBlogPost.createdAt).to.be.a("string");       
      })
      it("Should NOT alter the number <BlogPost> model in the database", async () => {
        try {
          const editedBlogPost = await BlogPost.findOne({ _id: _editedBlogPost._id });
          const updatedNumOfBlogPosts: number = await BlogPost.countDocuments();
          // assert //
          expect(updatedNumOfBlogPosts).to.equal(numberOfBlogPosts);
          expect(editedBlogPost).to.not.be.null;
          //
        } catch (error) {
          throw error;
        }
      });
    });
    // END TEST OWN Blog Post, valid data //
    // TEST OTHER Users Blog post valid data //
    describe("PATCH /api/posts/:post_id - other users Blog Post - default response VALID data", () => {
      let _editedBlogPost: BlogPostData;
      it("Should NOT  update an existing <BlogPost> model and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/posts/${secondUsersPostId}`)
          .set({ Authorization: contributorToken })
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
            expect(response.body.editedBlogPost).to.be.undefined;
            //
            done();
          });
      });
      it("Should NOT alter the other User's <BlogPost> model fields", async () => {
        try {
          const queriedBlogPost = await BlogPost.findOne({ _id: secondUsersBlogPost._id });
          //
          expect(queriedBlogPost._id.toHexString()).to.equal(secondUsersBlogPost._id.toHexString());
          expect(queriedBlogPost.title).to.equal(secondUsersBlogPost.title);
          expect(queriedBlogPost.content).to.equal(secondUsersBlogPost.content);
          expect(queriedBlogPost.category).to.equal(secondUsersBlogPost.category);
          expect(queriedBlogPost.author).to.eql(secondUsersBlogPost.author);
          expect(queriedBlogPost.keywords).to.eql(secondUsersBlogPost.keywords);
          expect(queriedBlogPost.editedAt.toISOString()).to.equal(secondUsersBlogPost.editedAt.toISOString());
          expect(queriedBlogPost.createdAt.toISOString()).to.equal(secondUsersBlogPost.createdAt.toISOString());
        } catch (error) {
          throw error;
        }
      })
      it("Should NOT alter the number <BlogPost> model in the database", async () => {
        try {
          const queriedBlogPost = await BlogPost.findOne({ _id: secondUsersBlogPost._id });
          const updatedNumOfBlogPosts: number = await BlogPost.countDocuments();
          // assert //
          expect(updatedNumOfBlogPosts).to.equal(numberOfBlogPosts);
          expect(queriedBlogPost).to.not.be.null;
          //
        } catch (error) {
          throw error;
        }
      });
    });
    // END OTHER USers Blog post valid data //
  });
  // END CONTEXT User Logged in CONTRIBUTOR account //

  // CONTEXT Admin Logged in //
  context('Admin client - ADMIN Account', () => {
    let adminUsersPostId: string;
    let secondUsersPostId: string;
    before(() => {
      adminUsersPostId = adminUsersBlogPost._id.toHexString();
      secondUsersPostId = secondUsersBlogPost._id.toHexString();
    });
    // TEST OWN Blog Post, invalid data //
    describe("PATCH /api/users/:post_id - own BlogPost - default response INVALID data", () => {
      let mockBlogPostData: BlogPostClientData;
      before(() => {
        mockBlogPostData = generateMockPostData({ authorId: adminUser._id.toHexString(), name: adminUser.firstName });
      });
      it("Should NOT update an existing <BlogPost> model with an EMPTY TITLE field and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/posts/${adminUsersPostId}`)
          .set({ Authorization: adminToken })
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
      it("Should NOT update an existing <BlogPost> model with an INVALID TITLE field TYPE and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/posts/${adminUsersPostId}`)
          .set({ Authorization: adminToken })
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
      it("Should NOT update an existing <BlogPost> model with an EMPTY CONTENT field and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/posts/${adminUsersPostId}`)
          .set({ Authorization: adminToken })
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
      it("Should NOT update an existing <BlogPost> model with an INVALID CONTENT field TYPE and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/posts/${adminUsersPostId}`)
          .set({ Authorization: adminToken })
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
      it("Should NOT update an existing <BlogPost> model with an EMPTY KEYWORDS field and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/posts/${adminUsersPostId}`)
          .set({ Authorization: adminToken })
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
      it("Should NOT update an existing <BlogPost> model with an INVALID KEYWORDS field TYPE and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/posts/${adminUsersPostId}`)
          .set({ Authorization: adminToken })
          .send({ blogPostData: { ...mockBlogPostData, keywords: "invalid" } })
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
      it("Should NOT update an existing <BlogPost> model with an EMPTY CATEGORY field and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/posts/${adminUsersPostId}`)
          .set({ Authorization: adminToken })
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
      it("Should NOT update an existing <BlogPost> model with an INVALID CATEGORY field TYPE and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/posts/${adminUsersPostId}`)
          .set({ Authorization: adminToken })
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
      it("Should NOT update an existing <BlogPost> model with a NON APPROVED CATEGORY field  and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/posts/${adminUsersPostId}`)
          .set({ Authorization: adminToken })
          .send({ blogPostData: { ...mockBlogPostData, category: "notavalidcategory" } })
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
    });
    // END TEST OWN Blog Post, invalid data //
    // TEST OWN Blog Post, valid data //
    describe("PATCH /api/posts/:post_id - own Blog Post - default response VALID data", () => {
      let _editedBlogPost: BlogPostData;
      it("Should CORRECTLY update an existing <BlogPost> model and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/posts/${adminUsersPostId}`)
          .set({ Authorization: adminToken })
          .send({ blogPostData: mockBlogPostData })
          .end((err, response) => {
            if (err) done(err);
            const { status } = response;
            const { responseMsg, editedBlogPost } = response.body as EditBlogPostRes; 
            expect(status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(editedBlogPost).to.be.an("object");
            // 
            expect(response.body.error).to.be.undefined;
            expect(response.body.errorMessages).to.be.undefined;
            //
            _editedBlogPost = editedBlogPost;
            done();
          });
      });
      it("Should correctly set the new <BlogPost> model fields", () => {
        expect(_editedBlogPost._id).to.be.a("string");
        expect(_editedBlogPost.title).to.equal(mockBlogPostData.title);
        expect(_editedBlogPost.content).to.equal(mockBlogPostData.content);
        expect(_editedBlogPost.author.authorId).to.equal(adminUsersBlogPost.author.authorId.toHexString());
        expect(_editedBlogPost.author.name).to.equal(adminUsersBlogPost.author.name);
        expect(_editedBlogPost.keywords).to.eql(mockBlogPostData.keywords);
        expect(_editedBlogPost.category).to.equal(mockBlogPostData.category);
        expect(_editedBlogPost.editedAt).to.be.a("string");
        expect(_editedBlogPost.createdAt).to.be.a("string");       
      })
      it("Should NOT alter the number <BlogPost> models in the database", async () => {
        try {
          const editedBlogPost = await BlogPost.findOne({ _id: _editedBlogPost._id });
          const updatedNumOfBlogPosts: number = await BlogPost.countDocuments();
          // assert //
          expect(updatedNumOfBlogPosts).to.equal(numberOfBlogPosts);
          expect(editedBlogPost).to.not.be.null;
          //
        } catch (error) {
          throw error;
        }
      });
    });
    // END TEST OWN Blog Post //
    
    // TEST other Users Blog Post //
    describe("PATCH /api/users/:post_id - other users BlogPost - default response INVALID data", () => {
      let mockBlogPostData: BlogPostClientData;
      before(() => {
        mockBlogPostData = generateMockPostData({ authorId: otherContributorUser._id.toHexString(), name: otherContributorUser.firstName });
      });
      it("Should NOT update an existing <BlogPost> model with an EMPTY TITLE field and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/posts/${secondUsersPostId}`)
          .set({ Authorization: adminToken })
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
      it("Should NOT update an existing <BlogPost> model with an INVALID TITLE field TYPE and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/posts/${secondUsersPostId}`)
          .set({ Authorization: adminToken })
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
      it("Should NOT update an existing <BlogPost> model with an EMPTY CONTENT field and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/posts/${secondUsersPostId}`)
          .set({ Authorization: adminToken })
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
      it("Should NOT update an existing <BlogPost> model with an INVALID CONTENT field TYPE and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/posts/${secondUsersPostId}`)
          .set({ Authorization: adminToken })
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
      it("Should NOT update an existing <BlogPost> model with an EMPTY KEYWORDS field and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/posts/${secondUsersPostId}`)
          .set({ Authorization: adminToken })
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
      it("Should NOT update an existing <BlogPost> model with an INVALID KEYWORDS field TYPE and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/posts/${secondUsersPostId}`)
          .set({ Authorization: adminToken })
          .send({ blogPostData: { ...mockBlogPostData, keywords: "invalid" } })
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
      it("Should NOT update an existing <BlogPost> model with an EMPTY CATEGORY field and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/posts/${secondUsersPostId}`)
          .set({ Authorization: adminToken })
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
      it("Should NOT update an existing <BlogPost> model with an INVALID CATEGORY field TYPE and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/posts/${secondUsersPostId}`)
          .set({ Authorization: adminToken })
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
      it("Should NOT update an existing <BlogPost> model with a NON APPROVED CATEGORY field  and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/posts/${secondUsersPostId}`)
          .set({ Authorization: adminToken })
          .send({ blogPostData: { ...mockBlogPostData, category: "notavalidcategory" } })
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
    });
    // END TEST OTHER Users Blog Blog Post, invalid data //
    // TEST OTHER Users Blog Post, valid data //
    describe("PATCH /api/posts/:post_id - other User's Blog Post - default response VALID data", () => {
      let _editedBlogPost: BlogPostData;
      it("Should CORRECTLY update an existing <BlogPost> model and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/posts/${secondUsersPostId}`)
          .set({ Authorization: adminToken })
          .send({ blogPostData: mockBlogPostData })
          .end((err, response) => {
            if (err) done(err);
            const { status } = response;
            const { responseMsg, editedBlogPost } = response.body as EditBlogPostRes; 
            expect(status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(editedBlogPost).to.be.an("object");
            // 
            expect(response.body.error).to.be.undefined;
            expect(response.body.errorMessages).to.be.undefined;
            //
            _editedBlogPost = editedBlogPost;
            done();
          });
      });
      it("Should correctly set the new <BlogPost> model fields", () => {
        expect(_editedBlogPost._id).to.be.a("string");
        expect(_editedBlogPost.title).to.equal(mockBlogPostData.title);
        expect(_editedBlogPost.content).to.equal(mockBlogPostData.content);
        expect(_editedBlogPost.author.name).to.equal(secondUsersBlogPost.author.name);
        expect(_editedBlogPost.author.authorId).to.equal(secondUsersBlogPost.author.authorId.toHexString());
        expect(_editedBlogPost.keywords).to.eql(mockBlogPostData.keywords);
        expect(_editedBlogPost.category).to.equal(mockBlogPostData.category);
        expect(_editedBlogPost.editedAt).to.be.a("string");
        expect(_editedBlogPost.createdAt).to.be.a("string");       
      })
      it("Should NOT alter the number <BlogPost> models in the database", async () => {
        try {
          const editedBlogPost = await BlogPost.findOne({ _id: _editedBlogPost._id });
          const updatedNumOfBlogPosts: number = await BlogPost.countDocuments();
          // assert //
          expect(updatedNumOfBlogPosts).to.equal(numberOfBlogPosts);
          expect(editedBlogPost).to.not.be.null;
          //
        } catch (error) {
          throw error;
        }
      });
    });
    // END TEST Other Users Blog Post //
  });
  // END CONTEXT Admin logged in //
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