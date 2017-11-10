import React from 'react'

const raisedButtonStyle = { height: 50, margin: '4px 0 4px 0' }
const SocialNav = () => {
  return (
    <div>
      <ul className="uk-navbar-nav uk-iconnav">
        <li>
          <a
            href="https://twitter.com/raisedadead"
            className="uk-card uk-card-default uk-border-circle"
            data-uk-icon="icon: twitter"
            style={raisedButtonStyle}
          >
            <span className="label uk-hidden">Twitter</span>
          </a>
        </li>
        <li>
          <a
            href="https://github.com/raisedadead"
            className="uk-card uk-card-default uk-border-circle"
            data-uk-icon="icon: github"
            style={raisedButtonStyle}
          >
            <span className="label uk-hidden">GitHub</span>
          </a>
        </li>
        <li>
          <a
            href="https://blog.raisedadead.com"
            className="uk-card uk-card-default uk-border-circle"
            data-uk-icon="icon: world"
            style={raisedButtonStyle}
          >
            <span className="label uk-hidden">Blog</span>
          </a>
        </li>
        <li>
          <a
            href="https://freeCodeCamp.org/raisedadead"
            className="uk-card uk-card-default uk-border-circle"
            data-uk-icon="icon: code"
            style={raisedButtonStyle}
          >
            <span className="label uk-hidden">freeCodeCamp</span>
          </a>
        </li>
        <li>
          <a
            href="https://linkedin.com/in/mrugeshm"
            className="uk-card uk-card-default uk-border-circle"
            data-uk-icon="icon: linkedin"
            style={raisedButtonStyle}
          >
            <span className="label uk-hidden">LinkedIn</span>
          </a>
        </li>
      </ul>
    </div>
  )
}

export default SocialNav
