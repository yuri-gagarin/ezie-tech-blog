/// <reference types="cypress" />

export const getTestElement = (selector: string) => {
  return cy.get(`[data-testid="${selector}"]`);
};