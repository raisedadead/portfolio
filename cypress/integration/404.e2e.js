const pageData = require(`../../nav-config`).pages.fourOhFour

describe(`404 page`, () => {
	it(`has appropriate layout markup`, () => {
		cy.visit(pageData.path)
		cy.get(`main h2`).contains(`Page not found`)
		cy.get(`footer`).should(`be.not.null`)
	})
})
