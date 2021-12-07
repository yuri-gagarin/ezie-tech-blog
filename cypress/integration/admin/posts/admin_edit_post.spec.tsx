/// <reference types="cypress" />
/// <reference types="cypress-pipe" />
//
import { expect } from "chai";
import faker from "faker";
// types //
import type { IBlogPostState, IGeneralState } from "@/redux/_types/generalTypes";
// helpers //
import { deepCopyObject } from "@/components/_helpers/generalHelpers";
import { checkEmptyObjVals } from "@/redux/_helpers/dataHelpers";
import { capitalizeString, formatTimeString } from "@/components/_helpers/displayHelpers";
import { BlogPostData, ErrorBlogPostRes } from "@/redux/_types/blog_posts/dataTypes";
import { StaticResponse } from "cypress/types/net-stubbing";

describe("Admin Edit Post page tests", () => {
  const adminEmail: string = "owner@email.com";
  const adminPass: string = "password";
  //
  let blogPostsState: IBlogPostState;
  let currentBlogPost: BlogPostData;
  let appState: IGeneralState;

  // login and navigate to dash //

  beforeEach(() => {
    cy.intercept({ method: "GET", url: "/api/posts" }).as("getPosts");
  });

  beforeEach(() => {
    cy.visit("http://localhost:3000/login");
    //
    cy.getByDataAttr("login-page-email-input").type(adminEmail);
    cy.getByDataAttr("login-page-password-input").type(adminPass);
    // 
    cy.getByDataAttr("login-page-login-btn").click();
    //
    cy.getByDataAttr("admin-main-page").should("be.visible");
    //
    cy.wait("@getPosts");
    cy.visit("http://localhost:3000/admin/dashboard/posts")
      .then(() => {
        cy.getByDataAttr("dash-blog-post-card").should("exist");
        //
        cy.window().its("store").invoke("getState").its("authState").its("currentUser").should("not.be.null");
        cy.window().its("store").invoke("getState").its("blogPostsState").its("blogPosts").should("have.length.above", 0);
        cy.window().its("store").invoke("getState").then((state) => {
          appState = deepCopyObject(state);
          currentBlogPost = { ...state.blogPostsState.blogPosts[0] };
        });
          
      });
  });

  it("Should render correct components", () => {
    cy.getByDataAttr("dash-blog-post-card-view-btn").first().click(); 
    cy.getByDataAttr("blog-modal-edit-btn").click();
    //
    cy.getByDataAttr("post-save-btn").should("be.visible").contains("Save");
    cy.getByDataAttr("post-cancel-btn").should("be.visible").contains("Cancel");
    //
    cy.getByDataAttr("admin-post-form").should("exist").and("be.visible");
    cy.getByDataAttr("post-preview").should("exist").and("be.visible");

    // assert correct values in form //
    cy.getByDataAttr("post-form-title-input").should("be.visible").and("have.value", currentBlogPost.title);
    cy.getByDataAttr("post-form-keywords-input").should("be.visible").and("have.value", currentBlogPost.keywords.join(","));
    // category dropdown //
    cy.getByDataAttr("post-form-category-input").find(".divider").should("be.visible").and("contain", capitalizeString(currentBlogPost.category));
    // assert correct values in preview view //
    cy.getByDataAttr("post-title-preview").find("span").last().should("contain", currentBlogPost.title);
    cy.getByDataAttr("post-category-preview").find("span").last().should("contain", capitalizeString(currentBlogPost.category));
    cy.getByDataAttr("post-keyword-preview-span").should("have.length", currentBlogPost.keywords.length);
  });

  it.only("Should correctly handle a <Save:Edit> error, show appropriate error responses", () => {
    // intercept an error /./
    const blogPostErrorResponse: ErrorBlogPostRes = { responseMsg: "Oppes", error: new Error("Oppes"), errorMessages: [ "An error occured" ]};
    const errorResponse: StaticResponse = { statusCode: 400, body: blogPostErrorResponse }; 
    cy.intercept({ method: "PATCH", url: "/api/posts/:postId" }, errorResponse).as("editBlogPost");
    //
    cy.getByDataAttr("dash-blog-post-card-view-btn").first().click(); 
    cy.getByDataAttr("blog-modal-edit-btn").click();
    // 
    cy.getByDataAttr("post-save-btn").should("be.visible").click();
    cy.wait("@editBlogPost", { timeout: 10000 });
    // 

  });

  it.only("Should correctly handle all data, CORRECTLY handle creation of a <BlogPost>, AND update state", () => {
    const errorResponse: StaticResponse = { statusCode: 400, body: mockErrorResponse };
    // get current user info //
    let authState: IAuthState;
    cy.intercept({ method: "POST", url: "/api/posts"}, errorResponse).as("createBlogPost");
    //
    cy.window().its("store").invoke("getState").then((state) => {
      authState = { ...state.authState, currentUser: { ...state.authState.currentUser }};
    })
    .then(() => {
      // type in values //
      cy.getByDataAttr("post-form-title-input").type(newPostData.title);
      cy.getByDataAttr("post-form-category-input").click().then((dropdown) => dropdown.find(".item").toArray()[0].click());
      cy.getByDataAttr("post-form-keywords-input").type(newPostData.keywords.join(","));
      cy.getByDataAttr("post-form-content-input").type(newPostData.content);
      //
    })
    .then(() => {
      cy.getByDataAttr("post-save-btn").click();
      return cy.wait("@createBlogPost")
    })
    .then((interception) => {
      const { responseMsg, createdBlogPost, error, errorMessages } = interception.response.body as CreateBlogPostRes;
      expect(responseMsg).to.be.a("string");
      expect(error).to.be.an("object")
      expect(errorMessages).to.be.an("array");
      //
      expect(createdBlogPost).to.be.undefined;
    })
    .then(() => {
      // url should not change //
      cy.url().should("eql", "http://localhost:3000/admin/dashboard/posts/new");
      cy.getByDataAttr("admin-post-form").should("exist").and("be.visible");
      cy.getByDataAttr("post-preview").should("exist").and("be.visible");
      cy.getByDataAttr("post-nav-main").should("exist").and("be.visible");
      // data in form and preview should not change //
      cy.getByDataAttr("post-form-title-input").should("have.value", newPostData.title);
      cy.getByDataAttr("post-form-keywords-input").should("have.value", newPostData.keywords.join(","));
      cy.getByDataAttr("post-form-category-input").find(".divider").contains("Informational");
      //cy.getByDataAttr("post-form-content-input").should("have.value", newPostData.content);
    })
    .then(() => {
      // redux state shoul change to reflect a new blog post model //
      cy.wait(4000)
      cy.window().its("store").invoke("getState").then((state) => {
        const { blogPostsState: oldBlogPostsState } = appState;
        const { status, responseMsg, loading, blogPosts, currentBlogPost, error, errorMessages } = state.blogPostsState;
        //
        expect(status).to.equal(400);
        expect(responseMsg).to.be.a("string");
        expect(loading).to.equal(false);
        expect(blogPosts.length).to.equal(0); // should be no api call to fetch updated posts //
        expect(checkEmptyObjVals(currentBlogPost)).to.equal(true);
        expect(error).to.not.be.null;
        expect(errorMessages).to.eql(mockErrorResponse.errorMessages);
      });
    });
  });

  /*
  // empty state data render tests //
  it("Should set correct default values in the input and preview", () => {
    // form //
    // form default values //
    cy.getByDataAttr("post-form-title-input")
      .should("be.visible").and("have.value", "")
    cy.getByDataAttr("post-form-keywords-input")
      .should("be.visible").and("have.value", "")
    // category dropdown //
    cy.getByDataAttr("post-form-category-input")
      .should("be.visible").and("have.value","");
    // category dropdown values //
    cy.getByDataAttr("post-form-category-input").click()
      .then((dropdown) => {
        return dropdown.find(".item");
      })
      .then((dropdownItems) => {
        expect(dropdownItems.length).to.equal(4);
        //
        dropdownItems.toArray().forEach((dropdownItem, index) => {
          expect(dropdownItem.firstChild.textContent).to.equal(capitalizeString(dropdownVals[index]));
        })
      });
    // content input // 
    cy.getByDataAttr("post-form-content-input")
      .should("be.visible").and("have.value", "");
    
    // post preview component ///
    // post preview values //
    cy.getByDataAttr("post-title-preview")
      .should("be.visible")
      .find("span")
      .then((spanEls) => {
        expect(spanEls.length).to.equal(1);
        expect(spanEls.first().html()).to.equal("Title:")
      });
    cy.getByDataAttr("post-author-preview")
      .should("be.visible")
      .find("span")
      .then((spanEls) => {
        expect(spanEls.length).to.equal(2);
        expect(spanEls.first().html()).to.equal("Author:")
      });
    cy.getByDataAttr("post-category-preview")
      .should("be.visible")
      .find("span")
      .then((spanEls) => {
        expect(spanEls.length).to.equal(1);
        expect(spanEls.first().html()).to.equal("Category:")
      });
      cy.getByDataAttr("post-keywords-preview")
        .should("be.visible")
        .find("span")
        .then((spanEls) => {
          expect(spanEls.length).to.equal(1);
          expect(spanEls.first().html()).to.equal("Keywords:")
        });
   
  });
  */

})