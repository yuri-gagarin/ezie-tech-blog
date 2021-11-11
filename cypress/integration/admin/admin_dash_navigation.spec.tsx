/// <reference types="cypress" />

import { expect } from "chai";
import { getTestElement } from "../../helpers/generalHelpers";
//
import type { IAuthState } from "@/redux/_types/auth/dataTypes";

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

  describe("Admin Main Navbar - Links navigation", () => {
    it("Should correctly handle the <Dashboard> link click", () => {
      getTestElement("Main_Admin_Dash_Link").should("not.be.null").click();
      //
      getTestElement("Admin_Main_Page").should("be.visible");
      cy.url().should("equal", "http://localhost:3000/admin/dashboard");
      // login state should not change //
      cy.window().its("store").invoke("getState").then((state) => {
        expect(authState).to.eql(state.authState);
      });
    });
    it("Should correctly handle the <Posts> link click", () => {
      getTestElement("Main_Admin_Posts_Link").should("not.be.null").click();
      //
      getTestElement("Admin_Blog_Posts_Page").should("be.visible");
      cy.url().should("equal", "http://localhost:3000/admin/dashboard/posts");
      // login state should not change //
      cy.window().its("store").invoke("getState").then((state) => {
        expect(authState).to.eql(state.authState);
      });
    });

    it("Should correctly handle the <Projects> link click", () => {
      getTestElement("Main_Admin_Projects_Link").should("not.be.null").click();
      //
      getTestElement("Admin_Projects_Page").should("be.visible");
      cy.url().should("equal", "http://localhost:3000/admin/dashboard/projects");
      // login state should not change //
      cy.window().its("store").invoke("getState").then((state) => {
        expect(authState).to.eql(state.authState);
      });
    });
    /*
    it("Should correctly handle the <News> link click", () => {
      getTestElement("Main_Admin_Dash_Link").should("not.be.null").click();
      //
      getTestElement("Admin_News_Page").should("be.visible");
      cy.url().should("equal", "http://localhost:3000/admin/news");
      // login state should not change //
      cy.window().its("store").invoke("getState").then((state) => {
        expect(authState).to.eql(state.authState);
      });
    });
    */
    it("Should correctly handle the <Users> link click", () => {
      getTestElement("Main_Admin_Users_Link").should("not.be.null").click();
      //
      getTestElement("Admin_Users_Page").should("be.visible");
      cy.url().should("equal", "http://localhost:3000/admin/dashboard/users");
      // login state should not change //
      cy.window().its("store").invoke("getState").then((state) => {
        expect(authState).to.eql(state.authState);
      });
    });
      
  })

  // logout //
  afterEach(() => {
    getTestElement("Admin_Main_Logout_Link").click();
  })
})