import React from 'react'

const raisedButtonStyle = { height: 50, margin: '4px 0 4px 0' }
const TopNav = () => (
  <nav
    className="uk-navbar-container uk-navbar-transparent uk-margin-top uk-margin-right"
    data-uk-navbar
  >
    <div className="uk-navbar-right">
      <ul className="uk-navbar-nav uk-iconnav">
        <li>
          <a
            title="résumé"
            href="https://git.raisedadead.com/resume/"
            className="uk-box-shadow-small uk-box-shadow-hover-xlarge uk-border-rounded"
            data-uk-icon="icon: copy"
            data-uk-tooltip="pos: bottom"
            target="_blank"
            rel="noopener noreferrer"
            style={raisedButtonStyle}
          >
            <span className="uk-hidden">résumé</span>
          </a>
        </li>
        <li>
          <a
            title="ask me anything"
            href="https://github.com/raisedadead/ama/"
            className="uk-box-shadow-small uk-box-shadow-hover-xlarge uk-border-rounded"
            data-uk-icon="icon: comment"
            data-uk-tooltip="pos: bottom"
            target="_blank"
            rel="noopener noreferrer"
            style={raisedButtonStyle}
          >
            <span className="uk-hidden">ask me anything</span>
          </a>
        </li>
      </ul>
    </div>
  </nav>
)

export default TopNav
