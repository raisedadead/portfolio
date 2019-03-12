const metaData = require(`../../gatsby-config`).siteMetadata
const pageData = require(`../../nav-config`).pages.dashboard

describe(`Dashboard`, () => {
	it(`has appropriate layout markup`, () => {
		cy.visit(pageData.path)
		cy.get(`main h2`).contains(pageData.title)
		cy.get(`footer`).should(`be.not.null`)
		cy.url().should(`include`,`localhost`)
	})
})
