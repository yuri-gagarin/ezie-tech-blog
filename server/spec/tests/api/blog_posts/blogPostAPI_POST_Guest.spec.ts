import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
// models //
import BlogPost from "@/server/src/models/BlogPost";
import User from "@/server/src/models/User";
// server //
import { ServerInstance } from "../../../../src/server";
// types //
import type { Express } from "express";
import type { IUser } from "@/server/src/models/User";
import type { ErrorBlogPostRes } from "@/redux/_types/blog_posts/dataTypes";
import type { BlogPostClientData } from "@/server/src/_types/blog_posts/blogPostTypes";
// helpers //
import { generateMockBlogPosts, generateMockUsers } from "@/server/src/_helpers/mockDataGeneration";
import { generateMockPostData, loginUser } from "../../../hepers/testHelpers";

chai.use(chaiHTTP);

describe("BlogPostsController:Create POST API Tests", () => {
  let server: Express;
  let numberOfBlogPosts: number;
  let mockBlogPostData: BlogPostClientData;
  // user models //
  let contributorUser: IUser;
  let readerUser: IUser;
  // login tokens //
  let contributorToken: string;
  let readerToken: string;

  before(() => {
    server = ServerInstance.getExpressServer();
  });
  before(async () => {
    try {
      await generateMockUsers({ number: 1, confirmed: true, type: "CONTRIBUTOR" });
      await generateMockUsers({ number: 1, confirmed: true, type: "READER" });
    } catch (error) {
      throw error;
    }
  });
  before(async () => {
    try {
      contributorUser = await User.findOne({ userType: "CONTRIBUTOR" });
      readerUser = await User.findOne({ userType: "READER" });
      //
      await generateMockBlogPosts({ number: 10, user: contributorUser });
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
      const { email: contributorEmail } = contributorUser;
      const { email: readerEmail } = readerUser;
      // assign tokens //
      ({ userJWTToken: contributorToken } = await loginUser({ server, chai, email: contributorEmail }));
      ({ userJWTToken: readerToken } = await loginUser({ server, chai, email: readerEmail }));
      //
    } catch (error) {
      throw error;
    }
  });

  // CONTEXT Guest client no login //
  /*
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
  */
  // END CONTEXT Guest client no login //

  // CONTEXT User logged in READER account //
  context("User client - READER account", () => {
    describe("POST /api/users - default response INVALID data", () => {
      it("Should NOT create a new <BlogPost> model and send back a correct response", (done) => {
        chai.request(server)
          .post("/api/posts")
          .set({ Authorization: readerToken })
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
          .set({ Authorization: readerToken })
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
  // END CONTEXT Logged in READER account //
});