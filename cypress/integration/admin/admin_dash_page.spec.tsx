/// <reference types="cypress" />
import { expect } from "chai";

import { getTestElement } from "../../helpers/generalHelpers";

context("Main Home Page", () => {
  const adminEmail: string = "admin@email.com";
  const adminPass: string = "password";

  describe("Admin NOT Logged in guest client", () => {
    // NOT LOGGED IN //
    it("Should NOT display the admin dashboard page, reroute to approriate 401 page", () => {
      cy.visit("http://localhost:3000/admin/dashboard")
        .then(() => {
          cy.url().should("match", /401/)
          getTestElement("401_Home_Btn").should("exist");
          getTestElement("401_Login_Btn").should("exist");
          getTestElement("401_Register_Btn").should("exist");
        })
    });
    it("Should be able to reroute to the home page", () => {
      cy.visit("http://localhost:3000/admin/dashboard")
        .then(() => {
          cy.url().should("match", /401/)
          return getTestElement("401_Home_Btn").click();
        })
        .then(() => {
          cy.url().should("equal", "http://localhost:3000/");
        });
    });
    it("Should be able to reroute to the login page", () => {
      cy.visit("http://localhost:3000/admin/dashboard")
        .then(() => {
          cy.url().should("match", /401/)
          return getTestElement("401_Login_Btn").click();
        })
        .then(() => {
          getTestElement("Login_Page_Form_Cont").should("exist");
          cy.url().should("equal", "http://localhost:3000/login");
        });
    });
    it("Should be able to reroute to the register page", () => {
      cy.visit("http://localhost:3000/admin/dashboard")
        .then(() => {
          cy.url().should("match", /401/)
          return getTestElement("401_Register_Btn").click();
        })
        .then(() => {
          getTestElement("Register_Page_Form_Cont").should("exist");
          cy.url().should("equal", "http://localhost:3000/register");
        });
    });


  });
  describe("Admin LOGGED in", () => {
    it("Should correctly render the admin page", () => {
      cy.visit("http://localhost:3000/login")
        .then(() => {
          getTestElement("Login_Page_Email_Input").type("admin@email.com");
          getTestElement("Login_Page_Password_Input").type("password");
          return getTestElement("Login_Page_Login_Btn").click();
        })
        .then(() => {
          // should render correct components //
          cy.url().should("equal", "http://localhost:3000/admin/dashboard");
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
    });
    it("Should correctly correctly log out admin", () => {
      cy.visit("http://localhost:3000/login")
        .then(() => {
          getTestElement("Login_Page_Email_Input").should("be.visible").type(adminEmail);
          getTestElement("Login_Page_Password_Input").should("be.visible").type(adminPass);
          //
          return getTestElement("Login_Page_Login_Btn").click();
        })
        .then(() => {
          getTestElement("Admin_Main_Menu").should("be.visible");
          getTestElement("Admin_Main_Page").should("be.visible");
          //
          return getTestElement("Admin_Main_Logout_Link").click();
        })
        .then(() => {
          cy.url().should("equal", "http://localhost:3000/");
          cy.getCookie("uniqueUserId")
            .then((cookie) => {
              expect(cookie.httpOnly).to.eq(true);
            });
          cy.getCookie("JWTToken").should("be.null");
          // auth state cookie should be preserved //
          cy.getCookie("authState").should("not.be.null");
           
        })
    });
  });
  
  afterEach(() => {

  });


});

export {};