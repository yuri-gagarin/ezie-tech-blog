/// <reference types="cypress" />

import { getTestElement } from "../helpers/generalHelpers";

context("Main Home Page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("Should render the main home page", () => {
    const el = getTestElement("Home_Landing_Main_Component");
    el.contains("button");
  })
});

export {};