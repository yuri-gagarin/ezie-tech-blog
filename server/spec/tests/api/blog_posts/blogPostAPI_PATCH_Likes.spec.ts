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


// Tests should cover all use cases in BlogPostsController:ToggleLike action //
// As it stand now, non logged in clients have no privileges //
// ALL Logged in Users, READER and CONRIBUTOR can both like and remove like on a blog post //
// ALL Admins CAN both add and remove like on a blog post //
// Likes should be limited to one per Logged in Users/Admin //
describe("BlogPostsController:ToggleLike PATCH - TOGGLE Like API Tests", () => {
  let server: Express;
  let numberOfBlogPosts: number;
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
    describe("PATCH /api/posts/toggle_like/:post_id - No Login - default response", () => {
      it("Should NOT update an existing <BlogPost> model and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/posts/toggle_like/${firstUsersPostId}`)
          .send({ blogPostData: {} })
          .end((error, response) => {
            if (error) done(error);
            // response is at the moment general //
            expect(response.status).to.equal(401);
            //
            expect(response.body.editedBlogPost).to.be.undefined;
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
      it("Should NOT alter the queried <BlogPost> model in any way", async () => {
        try {
          const queriedBlogPost: IBlogPost = await BlogPost.findOne({ _id: firstUsersPostId });
          expect(queriedBlogPost._id.toHexString()).to.equal(firstUsersBlogPost._id.toHexString());
          expect(queriedBlogPost.title).to.equal(firstUsersBlogPost.title);
          expect(queriedBlogPost.content).to.equal(firstUsersBlogPost.content);
          expect(queriedBlogPost.numOflikes).to.equal(firstUsersBlogPost.numOflikes);
          expect(queriedBlogPost.keywords).to.eql(firstUsersBlogPost.keywords);
          expect(queriedBlogPost.author).to.eql(firstUsersBlogPost.author);
          expect(queriedBlogPost.likes).to.eql(firstUsersBlogPost.likes);
        } catch (error) {
          throw error;
        }
      });
    });
   
  });
  // END CONTEXT Guest client no login //

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