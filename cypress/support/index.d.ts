declare namespace Cypress {
  interface Chainable<Subject = any> {
    getByDataAttr(string: string): Chainable<Subject>;
  }
}