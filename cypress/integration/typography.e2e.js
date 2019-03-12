const pages = require(`../../nav-config`).pages

describe(`typography.js is used `, () => {
	for (const pageData in pages) {
		it(`at `+ pages[pageData].path, () => {
			cy.visit(pages[pageData].path, {failOnStatusCode: false })
			cy.get(`html style[id='typography.js']`).should('exist')
		})
	}
})
