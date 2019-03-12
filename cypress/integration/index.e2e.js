const metaData = require(`../../gatsby-config`).siteMetadata
const pageData = require(`../../nav-config`).pages.home

describe(`Homepage at baseUrl: `+ pageData.path, () => {
	it(`has appropriate layout markup`, () => {
		cy.visit(pageData.path)
		cy.get(`header h1`).contains(`gatsby-starter by David Sabine`)
		cy.get(`footer`).should(`be.not.null`)
		cy.url().should('include',`localhost`)
	})
})
