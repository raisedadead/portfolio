describe(`Homepage at baseUrl: ` + `/`, () => {
  it(`has appropriate layout markup`, () => {
    cy.visit(`/`);
    cy.get(`footer`).should(`be.not.null`);
    cy.url().should(`include`, `localhost`);
  });
});
