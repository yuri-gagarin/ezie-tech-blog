// test tooling //
import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
// models //
import BlogPost from "../../../../src/models/BlogPost";
// server //
import ServerPromise from "../../../../src/server";
// models //
import Admin from "../../../../src/models/Admin";
// helpers //
import { generateMockBlogPosts, generateMockAdmins } from "../../../../src/_helpers/mockDataGeneration";
import { loginUser, countBlogPosts, generateMockPostData } from "../../../hepers/testHelpers";
// types //
import type { Express } from "express";
import type { Server } from "@/server/src/server";
import type { IBlogPost } from "@/server/src/models/BlogPost"
import type { IUser } from "@/server/src/models/User";
import type { BlogPostClientData } from "@/server/src/_types/blog_posts/blogPostTypes";
import type { CreateBlogPostRes, BlogPostData, EditBlogPostRes, DeleteBlogPostRes, ErrorBlogPostRes } from "@/redux/_types/blog_posts/dataTypes";

chai.use(chaiHTTP);

describe("BlogPost Admin logged in API tests POST tests", function() {
  this.timeout(10000);
  let serverInstance: Server;
  let server: Express;
  let numberOfPosts: number; 
  let numberOfAdminPosts: number;
  let adminUser: IUser; 
  let adminUserToken: string;
  //
  let mockBlogPostData: BlogPostClientData;
  let _createdBlogPost: BlogPostData;

  // set up server, DB and create admins //
  before(async () => {
    try {
      serverInstance = await ServerPromise;
      server = serverInstance.getExpressServer();
      await generateMockAdmins(1)
      adminUser = await Admin.findOne({});
      //await generateMockBlogPosts(10);
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
});