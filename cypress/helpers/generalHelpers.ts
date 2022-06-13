/// <reference types="cypress" />
import type { HttpResponseInterceptor, RouteMatcher, StaticResponse } from 'cypress/types/net-stubbing';
export const getTestElement = (selector: string) => {
  return cy.get(`[data-test-id="${selector}"]`);
};

export const closestBySelector = (el: JQuery<HTMLElement>, selector: string) => {
  return el.closest(`[data-test-id="${selector}"`);
};

export const interceptIndefinitely = (requestMatcher: RouteMatcher, response?: StaticResponse | HttpResponseInterceptor): { sendResponse: () => void; } => {
  let sendResponse;
  const trigger = new Promise((resolve) => {
    sendResponse = resolve;
  });
  cy.intercept(requestMatcher, (request) => {
    return trigger.then(() => {
      request.reply(response);
    });
  });
  return { sendResponse }
};
