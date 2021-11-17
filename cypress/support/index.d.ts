declare namespace Cypress {
  interface Chainable<Subject = HTMLElement> {
    getByDataAttr<E extends Node = HTMLElement>(string: string): Chainable<JQuery<E>>;
  }
}