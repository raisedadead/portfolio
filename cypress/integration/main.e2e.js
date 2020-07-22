/* eslint-disable jest/expect-expect */
describe(`dummy`, () => {
  it(`test -- check test setups are working`, () => {
    cy.visit(`/`);
    cy.url().should(`include`, `localhost`);
  });
});
