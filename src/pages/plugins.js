import HtmlHead from '../components/htmlhead'
import Layout from '../components/layout'
import React from 'react'
import { Link, graphql, StaticQuery } from 'gatsby'
import { OutboundLink } from 'gatsby-plugin-google-analytics'

const pageData = require(`../../nav-config`).pages.plugins

class PluginsMarkup extends React.Component {
	state = {}
	render() {
		return (
			<StaticQuery
				query={graphql`
					query sitePlugins {
						plugins: allSitePlugin {
							edges {
								node{
									id
									name
									pluginFilepath
								}
							}
						}
					}
					`
				}
				render={({ plugins }) => (
					<Layout>
						<HtmlHead title={pageData.title} />
						<main>
							<h2>Plugins Used in this Starter</h2>
								{plugins.edges.map(({ node: plugin }) => (
									<PluginList plugin={plugin} />
								))}
						</main>
					</Layout>
				)}
			/>
		)
	}
}

export default PluginsMarkup

class PluginList extends React.Component {
	render() {
		const plugin = this.props.plugin
		if(plugin.pluginFilepath.indexOf(`gatsby/dist`) === -1) {
			return (
				<article>
					<PluginArticle pluginName={plugin.name} plugin={plugin} />
				</article>
			)
		} else {
			return null
		}
	}
}

class PluginArticle extends React.Component {
	state = {
		helloButtonText: `Click Me`
	}
	sayHelloWorld() {
		fetch(`/.netlify/functions/hello`, {
			method: `GET`
		})
		.then(res => res.json())
		.then(({ message }) => this.setState({ helloButtonText: message }))
	}
	render() {
		const thisHeading = <h3 id={this.props.plugin.id}>{this.props.plugin.name}</h3>
		const thisArticle = this.props.plugin.name
		switch(thisArticle) {
			case `gatsby-plugin-create-client-paths`:
				return (
					<div>
						{thisHeading}
						<p>This plugin is useful when creating <em>App</em>-like behaviour which you do not want rendered statically.  For example, maybe you have a <Link to='/dashboard/'>Customer Dashboard</Link> which displays sensitive information and reports and you:</p>
						<ul>
							<li>want the data dynamically generated</li>
							<li>want the information kept private from search bots</li>
						</ul>
					</div>
				)
			case `gatsby-plugin-emotion`:
				return (
					<div>
						{thisHeading}
						<p><OutboundLink href='https://emotion.sh/'>emotion</OutboundLink> is a CSS-in-JS library.  Gatsby tutorials about styled-components demonstrate the use of emotion, so I've included and used this technique in this starter.</p>
						<p>Regarding CSS: this starter uses Typography.js and emotion for styled components... only.  I am exploring a possible future without the bulk of bootstrap.css (or similar).</p>
					</div>
				)
			case `gatsby-plugin-google-analytics`:
				return (
					<div>
						{thisHeading}
						<p>This plugin simply takes a UA code and a few options, then injects the appropriate JavaScript into the DOM on every page of your site.</p>
					</div>
				)
			case `gatsby-plugin-google-tagmanager`:
				return (
					<div>
						{thisHeading}
						<p>This plugin simply takes your GTM code and a few options, then injects the appropriate JavaScript into the DOM on every page of your site.</p>
						<p>This starter uses Google Tagmanager to track navigation actions, but also to inject JavaScript functions into the DOM — a feature I didn't realize was possible.  (For example, from your Google Tagmnager UI, you can write and inject JavaScript code which will execute in this page.)</p>
					</div>
				)
			case `gatsby-plugin-manifest`:
				return (
					<div>
						{thisHeading}
						<p>This plugin produces appropriate code and assets to produce the web app manifest.</p>
					</div>
				)
			case `gatsby-plugin-react-helmet`:
				return (
					<div>
						{thisHeading}
						<p>This plugin is essential.  With it, this starter produces all the important meta tags and such in the document's &lt;HEAD&gt;.</p>
						<p>His starter also include and example Cypress test to verify that Helmet is working as you need.</p>
					</div>
				)
			case `gatsby-plugin-robots-txt`:
				return (
					<div>
						{thisHeading}
						<p>This plugin simply produces a robots.txt file during build.</p>
					</div>
				)
			case `gatsby-plugin-netlify-functions`:
				return (
					<div>
						{thisHeading}
						<p>So, Netlify hosts lambda functions which you write and keep in your gatsby repository.  It's really convenient.</p>
						<p>What's even better, is that they've produced a tool which makes it possible to locally host and run tests against your lambda function — yes, on http://localhost!</p>
						<p>This plugin then does two <strong>super helpful</strong> things:</p>
						<ul>
							<li>this plugin tells webpack where to find the source code of your lambda functions, and where to put the build so that Netlify's servers can find them in your repo.</li>
							<li>and this plugin makes like a proxy so that your lambda function (running at https://localhost:9000 by default) appears on port :8000 so that you can use the function while running Jest or Cypress tests, or while running <code>gatsby develop</code>.</li>
						</ul>
						<p><OutboundLink href='/.netlify/functions/hello'>Click here to see the output of a simple 'hello world' lambda function.</OutboundLink></p>
						<p>
							<button onClick={event => this.sayHelloWorld(event)}>
								{this.state.helloButtonText}
							</button>
						</p>
					</div>
				)
			case `gatsby-plugin-sitemap`:
				return (
					<div>
						{thisHeading}
						<p>This plugin simply produces a sitemap.xml file during build.</p>
					</div>
				)
			case `gatsby-plugin-typography`:
				return (
					<div>
						{thisHeading}
						<p>Typography.js is an interesting approach to creating global CSS rules for HTML elements.  As the name implies, it's <em>sweet spot</em> is typography — the style of text and textual elements (blockquotes, headings, and so on).</p>
					</div>
				)
			case `gatsby-plugin-offline`:
				return (
					<div>
						{thisHeading}
						<p>This plugin helps manage state for Progressive Web Apps when internet connections are intermittent.</p>
						<p>Just add it to your gatsby-config.js... no additional work required.</p>
					</div>
				)
			default:
				return null
		}
	}
}
