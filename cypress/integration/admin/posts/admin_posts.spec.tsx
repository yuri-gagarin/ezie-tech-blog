/// <reference types="cypress" />
/// <reference types="cypress-pipe" />

import { expect } from "chai";
import { getTestElement, closestBySelector } from "../../../helpers/generalHelpers";
//
import type { IAuthState } from "@/redux/_types/auth/dataTypes";
import type { BlogPostData, IBlogPostState } from "@/redux/_types/blog_posts/dataTypes";
// helpers //
import { checkEmptyObjVals } from "@/redux/_helpers/dataHelpers";
import { capitalizeString, formatTimeString, trimStringToSpecificLength } from "../../../../components/_helpers/displayHelpers";


describe("Admin dashboard navigation tets", () => {
  const adminEmail: string = "admin@email.com";
  const adminPass: string = "password";
  let authState: IAuthState;
  // login and navigate to dash //

  beforeEach(() => {
    cy.visit("http://localhost:3000/login");
    //
    getTestElement("Login_Page_Email_Input").type(adminEmail);
    getTestElement("Login_Page_Password_Input").type(adminPass);
    // 
    getTestElement("Login_Page_Login_Btn").click();
    //
    getTestElement("Admin_Main_Page").should("be.visible");
    //
    cy.window().its("store").invoke("getState").then((state) => {
      if (!state.authState.currentUser || !state.authState.isAdmin) throw new Error("Login error in <before> hook");
      authState = { ...state.authState };
    });
  });

  it("Should correctly render all components at the <AdminBlogPosts> page", () => {
    let blogPostsState: IBlogPostState;
    //
    cy.intercept("GET", "/api/posts").as("getBlogPosts");
    cy.visit("http://localhost:3000/admin/dashboard/posts");
    //
    getTestElement("Admin_Blog_Posts_Page").should("be.visible");
    cy.wait(5000);
    // assert correct state //
    cy.window().its("store").invoke("getState")
      .then((state) => {
        blogPostsState = { ...state.blogPostsState };
        const { status, loading, currentBlogPost, blogPosts, error, errorMessages } = blogPostsState;

        expect(authState).to.eql(state.authState);
        // check blogPostState updates //
        expect(status).to.equal(200);
        expect(loading).to.equal(false);
        expect(checkEmptyObjVals(currentBlogPost)).to.equal(true);
        expect(blogPosts.length).to.be.lte(10);
        expect(errorMessages).to.be.null;
        expect(error).to.be.null;
        //
      })
      .then(() => {
        const blogPostsLength = blogPostsState.blogPosts.length
        getTestElement("Admin_Blog_Post_Card").should("have.length", blogPostsLength);
      })
      .then(() => {
        const { blogPosts } = blogPostsState;
        getTestElement("Admin_Blog_Post_Card_Title").each((elem, index) => {
          expect(elem.html()).to.equal(blogPosts[index].title);
        })
        getTestElement("Admin_Blog_Post_Card_Created").each((elem, index) => {
          const formattedTimeString: string = formatTimeString(blogPosts[index].createdAt, { yearMonth: true });
          const createdString: string = `Created at: ${formattedTimeString}`;
          expect(elem.html()).to.equal(createdString);
        })
        getTestElement("Admin_Blog_Post_Card_Category").each((elem, index) => {
          const categoryString: string = `Category: ${capitalizeString(blogPosts[index].category)}`;
          expect(elem.html()).to.equal(categoryString);
        })
        getTestElement("Admin_Blog_Post_Card_Published").each((elem, index) => {
          const publishedStatus = blogPosts[index].published ? "Yes" : "No";
          const publishedString: string = `Published: ${publishedStatus}`;
          expect(elem.html()).to.equal(publishedString);
        })
        /*
        getTestElement("Admin_Blog_Post_Card").each((renderedCard, index) => {
          const cardTitleEl = closestBySelector(renderedCard, "Admin_Blog_Post_Card_Title");
          const cardCreatedEl = closestBySelector(renderedCard, "Admin_Blog_Post_Card_Created");
          const cardDescEl = closestBySelector(renderedCard, "Admin_Blog_Post_Card_Desc");
          const cardCategoryEl = closestBySelector(renderedCard, "Admin_Blog_Post_Card_Category");
          const cardPublishedEl = closestBySelector(renderedCard,"Admin_Blog_Post_Card_Published");
          //
          console.log(cardTitleEl.text())
        });
        */
      })
    // assert correct blog post card rendering //
    //
   
  });

  

  // logout //
  afterEach(() => {
    getTestElement("Admin_Main_Logout_Link").click();
  });
});