/// <reference types="cypress" />
import { expect } from "chai";

import { getTestElement } from "../../helpers/generalHelpers";

context("Main Nav Tests", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });
  
  it("Should NOT be visible on initial load", () => {
  });
  it("Should be visible after scroll", () => {
    cy.scrollTo(0, 500);
    getTestElement("Main_Menu").should("be.visible");
  });
  it("Should display the <Blog> link and correctly navigate", () => {
    cy.scrollTo(0, 500);
    getTestElement("Main_Menu_Blog_Link").click();
    // should go to blog post page //
    cy.url().should("match", /blog/);
  });
  it("Should display the <News> link and correctly navigate", () => {
    cy.scrollTo(0, 500);
    getTestElement("Main_Menu_News_Link").click();
    cy.wait(5000);
    // should go to blog post page //
    cy.url().should("match", /news/);
    cy.wait(3000);
  })
  it("Should display the <Projects> link and correctly navigate", () => {
    cy.scrollTo(0, 500);
    getTestElement("Main_Menu_Projects_Link").click();
    cy.wait(5000);
    // should go to blog post page //
    cy.url().should("match", /projects/);
    cy.wait(3000);
  });
  it("Should display the <About> link and correctly navigate", () => {
    cy.scrollTo(0, 500);
    getTestElement("Main_Menu_About_Link").click();
    cy.wait(5000);
    // should go to blog post page //
    cy.url().should("match", /about/);
    cy.wait(3000);
  });
  it("Should display the <Login> link and correctly navigate", () => {
    cy.scrollTo(0, 500);
    getTestElement("Main_Menu_Login_Link").click();
    cy.wait(5000);
    // should go to blog post page //
    cy.url().should("match", /login/);
    cy.wait(3000);
  });


});

export {};