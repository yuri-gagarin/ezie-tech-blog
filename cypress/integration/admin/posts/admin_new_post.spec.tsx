/// <reference types="cypress" />
/// <reference types="cypress-pipe" />

import { expect } from "chai";
import { getTestElement, closestBySelector } from "../../../helpers/generalHelpers";
//
import type { IAuthState } from "@/redux/_types/auth/dataTypes";
import type { BlogPostData, IBlogPostState } from "@/redux/_types/blog_posts/dataTypes";
import type { IBlogPost } from "@/server/src/models/BlogPost";
import type { LoginRes } from "@/redux/_types/auth/dataTypes";
import type { AdminData } from "@/redux/_types/users/dataTypes";

// helpers //
import { checkEmptyObjVals } from "@/redux/_helpers/dataHelpers";
import { capitalizeString, formatTimeString } from "../../../../components/_helpers/displayHelpers";

describe("Admin New Post page tests", () => {
  let adminsArr: AdminData[];
  let blogPostsArr: BlogPostData[];
  let adminJWTToken: string;
  let user: AdminData;

  before(() => {
    try {
      cy.task("connectToDB")
        .then(() => {
          return cy.task<{ admins: AdminData[] }>("seedAdmins", { number: 1, role: "owner" });
        })
        .then(({ admins }) => {
          adminsArr = admins;
          user = adminsArr[0];
          return cy.task<{ blogPosts: BlogPostData[]}>("seedBlogPosts", { number: 0, publishedStatus: "published", user })
        })
        .then(({ blogPosts}) => { 
          blogPostsArr = blogPosts;
          const { email } = user;
          return cy.request<LoginRes>("POST", "api/login",  { email, password: "password" })
        })
        .then((loginData) => {
          const { jwtToken } = loginData.body;
          adminJWTToken = jwtToken.token;
        });
      //
    } catch (error) {
      throw error;
    }
  });

  describe("Admin new blog posts page - normal render", () => {
    beforeEach(() => {
      cy.visit("/login")
        .then(() => {
          getTestElement("Login_Page_Email_Input").type(user.email);
          getTestElement("Login_Page_Password_Input").type("password");
          getTestElement("Login_Page_Login_Btn").click();
          //
        });
      cy.wait(6000)
      cy.visit("/admin/dashboard/posts/new");
      
        
    })

    it("Should render correct components", () => {
      getTestElement("Admin_New_Post_Form")
        .should("be.visible");
      getTestElement("Admin_Post_Preview")
        .should("be.visible");
    });
    it("Should set correct values in the input and preview", () => {
      // form //
      getTestElement("Admin_New_Post_Title_Input")
        .should("be.visible").and("have.value", "")
      getTestElement("Admin_New_Post_Keywords_Input")
        .should("be.visible").and("have.value", "")
      getTestElement("Admin_New_Post_Category_Input")
        .should("be.visible").and("have.value","");
      getTestElement("Admin_New_Post_Content_Input")
        .should("be.visible").and("have.value", "");
      // post preview values //
    });

  });

  after(() => {
    adminsArr.forEach((data) => console.log(typeof data._id));
    const ids: string[] = adminsArr.map(adminData => adminData._id);
    const blogPostIds: string[] = blogPostsArr.map(blogPostData => blogPostData._id);
    try {
      cy.task("deleteAdminModels", ids)
        .then(() => {
          return cy.task("deleteBlogPostModels", blogPostIds)
        });
    } catch (error) {
      throw (error);
    }
  });
})