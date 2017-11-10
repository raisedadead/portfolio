import React from 'react'

const raisedButtonStyle = { height: 50, margin: '4px 0 4px 0' }
const SocialNav = () => (
  <nav className="uk-navbar-container uk-navbar-transparent" data-uk-navbar>
    <div className="uk-navbar-center">
      <ul className="uk-navbar-nav uk-iconnav">
        <li>
          <a
            title="Twitter"
            href="https://twitter.com/raisedadead"
            className="uk-box-shadow-small uk-box-shadow-hover-xlarge uk-border-circle"
            data-uk-icon="icon: twitter"
            data-uk-tooltip="pos: bottom"
            target="_blank"
            rel="noopener noreferrer"
            style={raisedButtonStyle}
          >
            <span className="label uk-hidden">Twitter</span>
          </a>
        </li>
        <li>
          <a
            title="GitHub"
            href="https://github.com/raisedadead"
            className="uk-box-shadow-small uk-box-shadow-hover-xlarge uk-border-circle"
            data-uk-icon="icon: github"
            data-uk-tooltip="pos: bottom"
            target="_blank"
            rel="noopener noreferrer"
            style={raisedButtonStyle}
          >
            <span className="label uk-hidden">GitHub</span>
          </a>
        </li>
        <li>
          <a
            title="Medium"
            href="https://blog.raisedadead.com"
            className="uk-box-shadow-small uk-box-shadow-hover-xlarge uk-border-circle"
            data-uk-icon="icon: world"
            data-uk-tooltip="pos: bottom"
            target="_blank"
            rel="noopener noreferrer"
            style={raisedButtonStyle}
          >
            <span className="label uk-hidden">Medium</span>
          </a>
        </li>
        <li>
          <a
            title="freeCodeCamp"
            href="https://freeCodeCamp.org/raisedadead"
            className="uk-box-shadow-small uk-box-shadow-hover-xlarge uk-border-circle"
            data-uk-icon="icon: code"
            data-uk-tooltip="pos: bottom"
            target="_blank"
            rel="noopener noreferrer"
            style={raisedButtonStyle}
          >
            <span className="label uk-hidden">freeCodeCamp</span>
          </a>
        </li>
        <li>
          <a
            title="LinkedIn"
            href="https://linkedin.com/in/mrugeshm"
            className="uk-box-shadow-small uk-box-shadow-hover-xlarge uk-border-circle"
            data-uk-icon="icon: linkedin"
            data-uk-tooltip="pos: bottom"
            target="_blank"
            rel="noopener noreferrer"
            style={raisedButtonStyle}
          >
            <span className="label uk-hidden">LinkedIn</span>
          </a>
        </li>
      </ul>
    </div>
  </nav>
)

export default SocialNav
