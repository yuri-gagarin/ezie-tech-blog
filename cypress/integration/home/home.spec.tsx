/// <reference types="cypress" />
import { expect } from "chai";

import { getTestElement } from "../../helpers/generalHelpers";

context("Main Home Page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("Should correctly render the main home page set corret cookes", () => {
    getTestElement("Main_Home_Page_Grid");
    getTestElement("Home_Landing_Component");
    getTestElement("Home_Tech_Component");
    getTestElement("Home_News_Component");
    // approriate cookie should be set //
    cy.getCookie("JWTToken").should("be.null");
    cy.getCookie("authState").should("be.null");
    cy.getCookie("uniqueUserId")
      .then((cookie) => {
        expect(cookie.httpOnly).to.eq(true);
      });
  });

  it("Should have a <SeeMoreBtn> component and respond properly to action", () => {
    const seeMoreBtn = getTestElement("Home_Landing_See_More_Btn").find("button");
    seeMoreBtn.click();
    // 
    cy.window().then(($win) =>  expect($win.scrollY).to.be.closeTo(500, 50));
  });

  it("Should display most recent blog posts on the main page", () => {
    getTestElement("Home_Latest_Blog").scrollIntoView();
    getTestElement("Blog_Bottom_Card").should("have.length", 3);
  })

});

export {};