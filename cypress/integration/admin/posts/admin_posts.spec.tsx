/// <reference types="cypress" />
/// <reference types="cypress-pipe" />

import { expect } from "chai";
import { getTestElement, closestBySelector } from "../../../helpers/generalHelpers";
//
import type { IAuthState } from "@/redux/_types/auth/dataTypes";
import type { BlogPostData, IBlogPostState } from "@/redux/_types/blog_posts/dataTypes";
// helpers //
import { checkEmptyObjVals } from "@/redux/_helpers/dataHelpers";
import { capitalizeString, formatTimeString } from "../../../../components/_helpers/displayHelpers";


describe("Admin dashboard navigation tets", () => {
  const adminEmail: string = "admin@email.com";
  const adminPass: string = "password";
  let authState: IAuthState;
  let blogPostsState: IBlogPostState;
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
    })
    .then(() => {
      cy.visit("http://localhost:3000/admin/dashboard/posts");
    })
  });

  it("Should correctly render all components at the <AdminBlogPosts> page", () => {
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
        });
        getTestElement("Admin_Blog_Post_Card_Created").each((elem, index) => {
          const formattedTimeString: string = formatTimeString(blogPosts[index].createdAt, { yearMonth: true });
          const createdString: string = `Created at: ${formattedTimeString}`;
          expect(elem.html()).to.equal(createdString);
        });
        getTestElement("Admin_Blog_Post_Card_Category").each((elem, index) => {
          const categoryString: string = `Category: ${capitalizeString(blogPosts[index].category)}`;
          expect(elem.html()).to.equal(categoryString);
        });
        getTestElement("Admin_Blog_Post_Card_Published").each((elem, index) => {
          const publishedStatus = blogPosts[index].published ? "Yes" : "No";
          const publishedString: string = `Published: ${publishedStatus}`;
          expect(elem.html()).to.equal(publishedString);
        });
      })
      .then(() => {
        const blogPostsLength = blogPostsState.blogPosts.length
        getTestElement("Admin_Blog_Post_Card_View_Btn").should("have.length",  blogPostsLength);
      });
    // assert correct blog post card rendering //
  });

  it("Should correctly toggle the preview modal and open the queried blog post", () => {
    let blogPostsState: IBlogPostState;

    //
    getTestElement("Admin_Blog_View_Modal").should("not.exist");
    getTestElement("Admin_Blog_Post_Card_View_Btn").first().click();
    //
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
      expect(blogPosts.length).to.be.lte(10);
      expect(errorMessages).to.be.null;
      expect(error).to.be.null;
      //
    }).then(() => {
      // blog post modal should be open //
      getTestElement("Admin_Blog_View_Modal").should("be.visible");
      // ensure all buttons are present //
      getTestElement("Blog_Modal_Close_Btn").should("be.visible").contains("Close");
      getTestElement("Blog_Modal_Edit_Btn").should("be.visible").contains("Edit");
      getTestElement("Blog_Modal_Publish_Btn").should("be.visible").contains("Publish");
      getTestElement("Blog_Modal_Delete_Btn").should("be.visible").contains("Delete");
    }).then(() => {
      const { title, author, category } = blogPostsState.currentBlogPost;
      // ensure corect data rendered //
      getTestElement("Blog_Modal_Title").contains(title);
      //
      getTestElement("Blog_Modal_Author")
        .contains("Author: ")
        .find("span").contains(author.name)
      getTestElement("Blog_Modal_Category")
        .contains("Category: ")
        .find("span").contains(category);
    }).then(() => {
      getTestElement("Blog_Modal_Close_Btn").click();
      // modal should be close //
      getTestElement("Admin_Blog_View_Modal").should("not.exist");
    });
  });

  it("Should correctly handle the <Delete> CANCEL functionality", () => {
    getTestElement("Admin_Blog_Post_Card_View_Btn").first().click();
    // redux state should not change //
    cy.window().its("store").invoke("getState").then((state) => {
      expect(authState).to.eql(state.authState);
      expect(blogPostsState).to.eql(state.blogPostsState);
    });
    // confirm delete should be open //
    const deleteModal = getTestElement("Confirm_Delete_Modal").should("exist").should("have.length", 1)
    const cancelButton = getTestElement("Confirm_Delete_Modal_Cancel_Btn").should("exist").should("have.length", 1);
    const delButton = getTestElement("Confirm_Delete_Modal_Del_Btn").should("exist").should("have.length", 1);
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
    getTestElement("Admin_Blog_Post_Card_View_Btn").first().click();
    //
    const blogPostViewModal = getTestElement("Admin_Blog_View_Modal").should("exist");
    // redux state should not change //
    cy.window().its("store").invoke("getState").then((state) => {
      expect(authState).to.eql(state.authState);
      expect(blogPostsState).to.eql(state.blogPostsState);
    });
    // confirm delete should be open //
    const deleteModal = getTestElement("Confirm_Delete_Modal").should("exist").should("have.length", 1)
    const cancelButton = getTestElement("Confirm_Delete_Modal_Cancel_Btn").should("exist").should("have.length", 1);
    const delButton = getTestElement("Confirm_Delete_Modal_Del_Btn").should("exist").should("have.length", 1);
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
    getTestElement("Admin_Main_Logout_Link").click();
  });
  */
});