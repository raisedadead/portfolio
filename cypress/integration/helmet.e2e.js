const metaData = require(`../../gatsby-config`).siteMetadata
const pages = require(`../../nav-config`).pages

describe(`helmet component contains valid <head> markup`, () => {

	for (const pageData in pages) {
		it(`at `+ pages[pageData].path, () => {
			cy.visit(pages[pageData].path, {failOnStatusCode: false })
			const pageTitle = pages[pageData].title
			cy.get(`html`).should(`have.attr`, `lang`, metaData.lang)
			cy.get(`html title`).should(`have.text`, metaData.titleTemplate.replace(`%s`, pageTitle))
			cy.get(`html meta[itemprop='description']`).should(`have.attr`, `content`, metaData.description)
			cy.get(`html meta[itemprop='image']`).should(`have.attr`, `content`, metaData.icon)
			cy.get(`html meta[itemprop='name']`).should(`have.attr`, `content`, pageTitle)
			cy.get(`html meta[name='description']`).should(`have.attr`, `content`, metaData.description)
			cy.get(`html meta[name='twitter:card']`).should(`have.attr`, `content`, `summary_large_image`)
			cy.get(`html meta[name='twitter:creator']`).should(`have.attr`, `content`, metaData.twitterCreator)
			cy.get(`html meta[name='twitter:description']`).should(`have.attr`, `content`, metaData.description)
			cy.get(`html meta[name='twitter:image']`).should(`have.attr`, `content`, metaData.icon)
			cy.get(`html meta[name='twitter:image:alt']`).should(`have.attr`, `content`, metaData.defaultTitle)
			cy.get(`html meta[name='twitter:title']`).should(`have.attr`, `content`, metaData.defaultTitle)
			cy.get(`html meta[property='og:description']`).should(`have.attr`, `content`, metaData.description)
			cy.get(`html meta[property='og:image']`).should(`have.attr`, `content`, metaData.icon)
			cy.get(`html meta[property='og:locale']`).should(`have.attr`, `content`, metaData.locale)
			cy.get(`html meta[property='og:title']`).should(`have.attr`, `content`, metaData.defaultTitle)
			cy.get(`html meta[property='og:type']`).should(`have.attr`, `content`, `website`)
			cy.get(`html meta[property='og:url']`).should(`have.attr`, `content`, metaData.siteUrl)
		})
	}
})