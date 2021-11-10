/// <reference types="cypress" />
import { expect } from "chai";

import { getTestElement } from "../../helpers/generalHelpers";

context("Main Home Page", () => {

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
          cy.url().should("equal", "http://localhost:3000/register");
        });
    });


  });
  describe("Admin LOGGED in", () => {

  })
  
  afterEach(() => {

  });


});

export {};