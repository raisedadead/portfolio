import React from 'react'
import { Link } from 'gatsby'
const pages = require(`../../nav-config`).pages

class AllSitePages extends React.Component {
	render() {
		let listItems = []
		for (const page in pages) {
			if (pages.hasOwnProperty(page)) {
				if(pages[page].navTitle){
					listItems.push(
						<li key={page} id={page}>
							<Link activeClassName='current' to={pages[page].path}>
								{pages[page].navTitle}
							</Link>
						</li>
					)
				}
			}
		}
			return (
		<section>
			<h2>About this&nbsp;Starter</h2>
			<nav>
				<ul>
					{listItems}
				</ul>
			</nav>
	  </section>
    )
  }
}

export default AllSitePages
