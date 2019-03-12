import React from 'react'
import { OutboundLink } from 'gatsby-plugin-google-analytics'

class AppDescription extends React.Component {
	render() {
		return (
			<section>
				<p data-testid="app-description">This is a Gatsbyjs starter that I use to test things and practice.  You are welcome to look around for examples how to use many Gatsby plugins and utilities.</p>
				<code className='block'>
					$ gatsby new my-website https://github.com/DavidSabine/gatsby-starter<br />
					# these commands presume that you have node, yarn, git, and gatsby-cli<br />
					# visit the readme at <OutboundLink href="//github.com/DavidSabine/gatsby-starter/blob/master/README.md">github.com/DavidSabine/gatsby-starter</OutboundLink>
				</code>
				<p>To see it all in action, then run the following:</p>
				<code className='block'>
					$ yarn<br />
					$ yarn develop
					# then go to http://localhost:8000 in your browser<br />
				</code>
				<p>To see the tests run, use...</p>
				<code className='block'>
					$ yarn test<br />
					$ yarn test:e2e<br />
				</code>
				<p>
					The demo of this starter is at <OutboundLink href="//gatsby-starter.davesabine.com">gatsby-starter.davesabine.com</OutboundLink> and the full source code is at <OutboundLink href="//github.com/DavidSabine/gatsby-starter">github.com/DavidSabine/gatsby-starter</OutboundLink>.
				</p>
			</section>
		)
	}
}

export default AppDescription
