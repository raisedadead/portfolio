import React from 'react'

const raisedButtonStyle = {
  height: 50,
  margin: '4px 0 4px 0',
  backgroundColor: '#00000000',
  color: '#f8f8f8'
}
export default props => (
  <nav
    className="uk-navbar-container uk-navbar-transparent"
    data-uk-navbar
    {...props}
  >
    <div className="uk-navbar-center">
      <ul className="uk-navbar-nav uk-iconnav">
        <li>
          <a
            aria-label="Twitter"
            title="Twitter"
            href="https://twitter.com/raisedadead"
            className="uk-border-circle"
            data-uk-icon="icon: twitter"
            target="_blank"
            rel="noopener noreferrer"
            style={raisedButtonStyle}
          >
            <span className="label uk-hidden">Twitter</span>
          </a>
        </li>
        <li>
          <a
            aria-label="GitHub"
            title="GitHub"
            href="https://github.com/raisedadead"
            className="uk-border-circle"
            data-uk-icon="icon: github"
            target="_blank"
            rel="noopener noreferrer"
            style={raisedButtonStyle}
          >
            <span className="label uk-hidden">GitHub</span>
          </a>
        </li>
        <li>
          <a
            aria-label="Medium"
            title="Medium"
            href="https://blog.raisedadead.com"
            className="uk-border-circle"
            data-uk-icon="icon: pencil"
            target="_blank"
            rel="noopener noreferrer"
            style={raisedButtonStyle}
          >
            <span className="label uk-hidden">Medium</span>
          </a>
        </li>
        <li>
          <a
            aria-label="freeCodeCamp"
            title="freeCodeCamp"
            href="https://freeCodeCamp.org/raisedadead"
            className="uk-border-circle"
            data-uk-icon="icon: code"
            target="_blank"
            rel="noopener noreferrer"
            style={raisedButtonStyle}
          >
            <span className="label uk-hidden">freeCodeCamp</span>
          </a>
        </li>
        <li>
          <a
            aria-label="LinkedIn"
            title="LinkedIn"
            href="https://linkedin.com/in/mrugeshm"
            className="uk-border-circle"
            data-uk-icon="icon: linkedin"
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
