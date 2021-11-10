/// <reference types="cypress" />
import { expect } from "chai";

import { getTestElement } from "../../helpers/generalHelpers";

context("Main Home Page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login");
  });

  it("Should correctly render the login page", () => {
    getTestElement("Login_Page_Header").find("h1").contains("Login");
    getTestElement("Login_Page_Email_Input").should("have.value", "");
    getTestElement("Login_Page_Password_Input").should("have.value", "");
    // login and register btns //
    getTestElement("Login_Page_Login_Btn").contains("Login");
    getTestElement("Login_Page_Register_Link").contains("Register");
     // error modal should not be visible //
     getTestElement("Gen_Error_Modal").should("not.exist");
  });

  it("Should correctly render ERROR when logging in with empty fields ", () => {
    // attempet login with empty fields //
    getTestElement("Login_Page_Login_Btn").click();
    // 
    getTestElement("Gen_Error_Modal").should("exist");
    getTestElement("Gen_Error_Modal_Msg").should("have.length", 2);
  });
  it("Should correctly render ERROR when logging in with empty <email> field ", () => {
    // attempt login with an empty email field //
    getTestElement("Login_Page_Password_Input").type("password");
    getTestElement("Login_Page_Login_Btn").click();
    // 
    getTestElement("Gen_Error_Modal").should("exist");
    getTestElement("Gen_Error_Modal_Msg").should("have.length", 1);
  });
  it("Should correctly render ERROR when logging in with empty <password> field ", () => {
    // attempt login with an empty password field //
    getTestElement("Login_Page_Email_Input").type("admin@email.com");
    getTestElement("Login_Page_Login_Btn").click();
    // 
    getTestElement("Gen_Error_Modal").should("exist");
    getTestElement("Gen_Error_Modal_Msg").should("have.length", 1);
  });
  
  it("Should correctly render ERROR when logging in with wrong login data", () => {
    // attempt login with an empty password field //
    getTestElement("Login_Page_Email_Input").type("wrong@email.com");
    getTestElement("Login_Page_Password_Input").type("wrongpassword");
    getTestElement("Login_Page_Login_Btn").click();
    // 
    getTestElement("Gen_Error_Modal").should("exist");
    getTestElement("Gen_Error_Modal_Msg").should("have.length", 1);
  });

  it("Should correctly log in Admin and render the admin page", () => {
    getTestElement("Login_Page_Email_Input").type("admin@email.com");
    getTestElement("Login_Page_Password_Input").type("password");
    getTestElement("Login_Page_Login_Btn").click();
    // 
    cy.url().should("match", /admin\/dashboard/);
    //
    getTestElement("Admin_Main_Page").should("not.be.null");
    cy.window().its("store").invoke("getState").then((state) => {
      // auth state user should be set //
      expect(state.authState.currentUser).to.not.be.null;
      expect(state.authState.loggedIn).to.be.true;
      expect(state.authState.isAdmin).to.be.true;
      // home blog post state //
      expect(state.blogPostsState.blogPosts).to.be.an("array");
      //
      // home project state //
      expect(state.projectsState.currentSelectedProject).to.be.null;
      expect(state.projectsState.projectsArr).to.be.an("array");
      //
      expect(state.rssState.readingList.length).to.equal(0);
      expect(state.rssState.rssFeed.length).to.equal(0);
      // check cookies //
      cy.getCookie("JWTToken").should("not.be.null");
      cy.getCookie("authState").should("not.be.null");
      cy.getCookie("uniqueUserId")
        .then((cookie) => {
          expect(cookie.httpOnly).to.eq(true);
        });
      cy.getCookie("JWTToken")
        .then((cookie) => {
          expect(cookie.httpOnly).to.eq(true);
        });
      cy.getCookie("authState")
        .then((cookie) => {
          expect(cookie.httpOnly).to.eq(false);
        });
      });
  })
  afterEach(() => {

  });


});

export {};