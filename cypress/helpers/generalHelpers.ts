/// <reference types="cypress" />

export const getTestElement = (selector: string) => {
  return cy.get(`[data-test-id="${selector}"]`);
};

export const closestBySelector = (el: JQuery<HTMLElement>, selector: string) => {
  return el.closest(`[data-test-id="${selector}"`);
};
