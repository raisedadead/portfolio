/* eslint-disable jest/expect-expect */
describe(`404 page`, () => {
  it(`has appropriate layout markup`, () => {
    cy.visit(`/404`);
    cy.get(`main h1`).contains(`Page not found`);
    cy.get(`footer`).should(`be.not.null`);
  });
});
