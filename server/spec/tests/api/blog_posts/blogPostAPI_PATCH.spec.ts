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
import type { BlogPostData, CreateBlogPostRes, ErrorBlogPostRes } from "@/redux/_types/blog_posts/dataTypes";
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
      await generateMockBlogPosts({ number: 10, user: contributorUser });
      await generateMockBlogPosts({ number: 10, user: otherContributorUser });
      //
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
    describe("PATCH /api/users/:blog_post_id - default response INVALID data", () => {
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
    describe("PATCH /api/users - default response VALID data", () => {
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
    describe("PATCH /api/users/:post_id - default response INVALID data", () => {
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
    describe("PATCH /api/users/:post_id - default response VALID data", () => {
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