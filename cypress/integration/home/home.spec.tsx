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
  });

  it("Should correctly set the initial redux store", () => {
    cy.window().its("store").invoke("getState").then((state) => {
      // auth state user should be null //
      expect(state.authState.currentUser).to.be.null;
      expect(state.authState.loggedIn).to.be.false;
      expect(state.authState.isAdmin).to.be.false;
      // home blog post state //
      expect(state.blogPostsState.blogPosts).to.be.an("array");
      expect(state.blogPostsState.blogPosts.length).to.equal(3);
      //
      // home project state //
      expect(state.projectsState.currentSelectedProject).to.be.null;
      expect(state.projectsState.projectsArr.length).to.equal(0);
      //
      expect(state.rssState.readingList.length).to.equal(0);
      expect(state.rssState.rssFeed.length).to.equal(0);
    });
  });

  it("Should have an <All Blog Posts> button and properly respond to the <click> action", () => {
    getTestElement("Home_Latest_Blog").scrollIntoView();
    //
    const btn = getTestElement("Home_Go_To_Blog_Section_Btn").contains("All Blog Posts");
    btn.click().wait(2000);
    // should go to blog post page //
    cy.url().should("match", /blog/);
  });

  it("Should have an <All News Feeds> button and properly respond to the <click> action", () => {
    getTestElement("Home_News_Component").scrollIntoView();
    //
    const btn = getTestElement("Home_Go_To_News_Section_Btn").contains("All News Feeds");
    btn.click();
    // should go to rss news page //
    cy.url().should("match", /news/);
    cy.wait(5000);
  });

  it("Should have a <See More> button for Projects and properly respond to the <click> action", () => {
    getTestElement("Home_Projects").scrollIntoView();
    //
    const btn = getTestElement("Home_Go_To_Projects_Section_Btn").contains("See More");
    btn.click().wait(2000);
    // should go to rss news page //
    cy.url().should("match", /projects/);
  });


});

export {};