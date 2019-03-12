import HtmlHead from '../components/htmlhead'
import Layout from '../components/layout'
import React from 'react'
// import { css } from '@emotion/core'
import { Link } from 'gatsby'
import { OutboundLink } from 'gatsby-plugin-google-analytics'

const pageData = require(`../../nav-config`).pages.tools

class ToolsMarkup extends React.Component {
	state = {}
	render() {
		return (
			<Layout>
				<HtmlHead title={pageData.title} />
				<main>
					<h2>Tools &amp; Utilities Used in this Starter</h2>
					<div>
						<h3>netlify-identity-widget</h3>
						<p>This module can be seen in action on the <Link to='/dashboard/'>password protected dashboard</Link>.</p>
					</div>
					<div>
						<h3>Jest &amp; Cypress</h3>
						<p>If you're a TDD practitioner, you'll appreciate that the Gatsby community widely adopts Jest and Cypress.</p>
						<p>These tools can't really be demonstrated online, but if you <OutboundLink href='//github.com/DavidSabine/gatsby-starter'>clone the repo</OutboundLink> you'll be able to run the unit tests and integration tests in Jest and Cypress.</p>
					</div>
				</main>
			</Layout>
		)
	}
}

export default ToolsMarkup
