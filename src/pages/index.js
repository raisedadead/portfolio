import AppDescription from '../components/appdescription'
import HtmlHead from '../components/htmlhead'
import Layout from '../components/layout'
import React from 'react'

const pageData = require(`../../nav-config`).pages.home

export const IndexMarkup = props => (
	<Layout>
		<HtmlHead title={pageData.title} />
		<main>
			<AppDescription />
		</main>
	</Layout>
)

export default IndexMarkup
