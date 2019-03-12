const pages = require(`../../nav-config`).pages
const uacode = `UA-125425021-1`

describe(`gatsby-plugin-google-tagmanager`, () => {
	for (const pageData in pages) {
		it(`is included in page: ` + pages[pageData].path, () => {
			const gtmcode = `GTM-W9DNBKC`
			cy.visit(pages[pageData].path).then(window => {
				const currentHref = window.location.href
				const headHtml = window.document.head.innerHTML
				assert.notEqual(headHtml.indexOf(gtmcode), -1)
			})
		})
	}
})

describe(`gatsby-plugin-google-analytics`, () => {
	for (const pageData in pages) {
		it(`is included in page: ` + pages[pageData].path, () => {
			cy.visit(pages[pageData].path).then(window => {
				const currentHref = window.location.href
				const headHtml = window.document.head.innerHTML
				if (currentHref.indexOf(`:8000`) === -1) {
					assert.notEqual(headHtml.indexOf(uacode), -1, `in production`)
				} else {
					assert.equal(headHtml.indexOf(uacode), -1, `not in development`)
				}
			})
		})
	}
})

describe(`robots document`, () => {
	it(`exists`, () => {
		cy.request(`/robots.txt`).should(xhr => {
			expect(xhr.status).to.eq(200)
			expect(xhr.headers).to.have.property(
				`content-type`,
				`text/plain; charset=UTF-8`
			)
			expect(xhr.body).to.contain(`User-agent: *`)
		})
	})
})
	
describe(`sitemap document`, () => {
	it(`exists`, () => {
		cy.request(`/sitemap.xml`).should(xhr => {
			expect(xhr.status).to.eq(200)
			expect(xhr.headers).to.have.property(
				`content-type`,
				`text/xml; charset=UTF-8`
			)
		})
	})
})
		
describe(`manifest document`, () => {
	it(`exists`, () => {
		cy.request(`/manifest.webmanifest`).should(xhr => {
			expect(xhr.status).to.eq(200)
			expect(xhr.headers).to.have.property(
				`content-type`,
				`application/manifest+json`
			)
		})
	})
})
