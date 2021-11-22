/// <reference types="cypress" />
/// <reference types="cypress-pipe" />

import { expect } from "chai";
// types 
import type { IAuthState } from "@/redux/_types/auth/dataTypes";
import type { IBlogPostState } from "@/redux/_types/blog_posts/dataTypes";
// helpers //
import { checkEmptyObjVals } from "@/redux/_helpers/dataHelpers";
import { capitalizeString, formatTimeString } from "../../../../components/_helpers/displayHelpers";


describe("Admin dashboard navigation tets", () => {
  const adminEmail: string = "owner@email.com";
  const adminPass: string = "password";
  let authState: IAuthState;
  let blogPostsState: IBlogPostState;
  // login and navigate to dash //

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
    cy.window().its("store").invoke("getState").then((state) => {
      if (!state.authState.currentUser || !state.authState.isAdmin) throw new Error("Login error in <before> hook");
      authState = { ...state.authState };
    })
    .then(() => {
      cy.visit("http://localhost:3000/admin/dashboard/posts");
    })
  });

  it("Should correctly render all components at the <AdminBlogPosts> page", () => {
    //
    cy.getByDataAttr("dash-blog-posts-page").should("be.visible");
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
        expect(blogPosts.length).to.be.lte(100);
        expect(errorMessages).to.be.null;
        expect(error).to.be.null;
        //
      })
      .then(() => {
        const blogPostsLength = blogPostsState.blogPosts.length
        cy.getByDataAttr("dash-blog-post-card").should("have.length", blogPostsLength);
      })
      .then(() => {
        const { blogPosts } = blogPostsState;
        cy.getByDataAttr("dash-blog-post-card-title").each((elem, index) => {
          expect(elem.html()).to.equal(blogPosts[index].title);
        });
        cy.getByDataAttr("dash-blog-post-card-created").each((elem, index) => {
          const formattedTimeString: string = formatTimeString(blogPosts[index].createdAt, { yearMonth: true });
          const createdString: string = `Created at: ${formattedTimeString}`;
          expect(elem.html()).to.equal(createdString);
        });
        cy.getByDataAttr("dash-blog-post-card-category").each((elem, index) => {
          const categoryString: string = `Category: ${capitalizeString(blogPosts[index].category)}`;
          expect(elem.html()).to.equal(categoryString);
        });
        cy.getByDataAttr("dash-blog-post-card-published").each((elem, index) => {
          const publishedStatus = blogPosts[index].published ? "Yes" : "No";
          const publishedString: string = `Published: ${publishedStatus}`;
          expect(elem.html()).to.equal(publishedString);
        });
      })
      .then(() => {
        const blogPostsLength = blogPostsState.blogPosts.length
        cy.getByDataAttr("dash-blog-post-card-view-btn").should("have.length",  blogPostsLength);
      });
    // assert correct blog post card rendering //
  });

  it("Should correctly toggle the preview modal and open the queried blog post", () => {
    let blogPostsState: IBlogPostState;
    //
    cy.getByDataAttr("dash-blog-view-modal").should("not.exist");
    cy.getByDataAttr("dash-blog-post-card-view-btn").first().click();
    // wait for store update - edit later //
    cy.wait(3000);
    // assert new state //
    cy.window().its("store").invoke("getState").then((state) => {
      blogPostsState = { ...state.blogPostsState };
      const { status, loading, currentBlogPost, blogPosts, error, errorMessages } = blogPostsState;

      expect(authState).to.eql(state.authState);
      // check blogPostState updates //
      expect(status).to.equal(200);
      expect(loading).to.equal(false);
      expect(currentBlogPost).to.eql(blogPosts[0]);
      expect(blogPosts.length).to.be.lte(100);
      expect(errorMessages).to.be.null;
      expect(error).to.be.null;
      //
    }).then(() => {
      // blog post modal should be open //
      cy.getByDataAttr("blog-view-modal").should("be.visible");
      // ensure all buttons are present //
      cy.getByDataAttr("blog-modal-close-btn").should("be.visible").contains("Close");
      cy.getByDataAttr("blog-modal-edit-btn").should("be.visible").contains("Edit");
      cy.getByDataAttr("blog-modal-publish-btn").should("be.visible").contains("Publish");
      cy.getByDataAttr("blog-modal-delete-btn").should("be.visible").contains("Delete");
    }).then(() => {
      const { title, author, category } = blogPostsState.currentBlogPost;
      // ensure corect data rendered //
      cy.getByDataAttr("blog-modal-title").contains(title);
      //
      cy.getByDataAttr("blog-modal-author")
        .contains("Author: ")
        .find("span").contains(author.name)
      cy.getByDataAttr("blog-modal-category")
        .contains("Category: ")
        .find("span").contains(category);
    }).then(() => {
      cy.getByDataAttr("blog-modal-close-btn").click();
      // modal should be close //
      cy.getByDataAttr("blog-view-modal").should("not.exist");
    });
  });

  it.only("Should correctly handle the <Delete> CANCEL functionality", () => {
    cy.getByDataAttr("dash-blog-post-card-view-btn").first().click();
    // redux state should not change //
    cy.window().its("store").invoke("getState").then((state) => {
      expect(authState).to.eql(state.authState);
      expect(blogPostsState).to.eql(state.blogPostsState);
    });
    // confirm delete should be open //
    const deleteModal = cy.getByDataAttr("confirm-delete-modal").should("exist").and("have.length", 1)
    const cancelButton = cy.getByDataAttr("confirm-delete-modal-cancel-btn").should("exist").and("have.length", 1);
    const delButton = cy.getByDataAttr("confirm-delete-modal-del-btn").should("exist").and("have.length", 1);
    // should successfully cancel //
    // redux state should stay the same //
    cancelButton.click().then(() => {
      return cy.window().its("store").invoke("getState");
    })
    .then((state) => {
      expect(authState).to.eql(state.authState);
      expect(blogPostsState).to.eql(state.blogPostsState);
    });
    // confirm delete modal should be closed //
    deleteModal.should("not.exist");
    cancelButton.should("not.exist");
    delButton.should("not.exist");

  })
  it("Should correctly handle the <Delete> CONFIRM DELETE functionality", () => {
    cy.getByDataAttr("dash-blog-post-card-view-btn").first().click();
    //
    const blogPostViewModal = cy.getByDataAttr("blog-view-modal").should("exist");
    // redux state should not change //
    cy.window().its("store").invoke("getState").then((state) => {
      expect(authState).to.eql(state.authState);
      expect(blogPostsState).to.eql(state.blogPostsState);
    });
    // confirm delete should be open //
    const deleteModal = cy.getByDataAttr("confirm-delete-modal").should("exist").should("have.length", 1)
    const delButton = cy.getByDataAttr("confirm-delete-modal-del-btn").should("exist").should("have.length", 1);
    // should successfully cancel //
    // redux auth state should stay the same //
    delButton.click().then(() => {
      return cy.window().its("store").invoke("getState");
    })
    .then((state) => {
      const { status, loading, responseMsg, currentBlogPost, blogPosts, error, errorMessages } = state.blogPostsState;
      expect(authState).to.eql(state.authState);
      // changed <BlogPosts> state //
      expect(status).to.equal(200);
      expect(loading).to.equal(false);
      expect(responseMsg).to.be.a("string");
      expect(checkEmptyObjVals(currentBlogPost)).to.equal(true);
      expect(blogPosts.length).to.equal(blogPostsState.blogPosts.length - 1);
      expect(error).to.be.null;
      expect(errorMessages).to.be.null;
    });
    // confirm delete modal should be closed //
    deleteModal.should("not.exist");
    // blog post view modal should be closed //
    blogPostViewModal.should("not.exist");
  })

  

  // logout //
  /*
  afterEach(() => {
    cy.getByDataAttr("dash_Main_Logout_Link").click();
  });
  */
});