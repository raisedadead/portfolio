import React from 'react'

const raisedButtonStyle = { height: 50, margin: '4px 0 4px 0' }
const TopNav = () => {
  return (
    <nav className="uk-navbar-container uk-navbar-transparent" data-uk-navbar>
      <div className="uk-navbar-right">
        <ul className="uk-navbar-nav uk-iconnav">
          <li>
            <a
              className="uk-card uk-card-default uk-border-circle"
              href="/resume/"
              data-uk-icon="icon: copy"
              title="résumé"
              data-uk-tooltip
              style={raisedButtonStyle}
            >
              <span className="uk-hidden">résumé</span>
            </a>
          </li>
          <li>
            <a
              className="uk-card uk-card-default uk-border-circle"
              href="https://github.com/raisedadead/ama/"
              data-uk-icon="icon: comment"
              title="ask me anything"
              data-uk-tooltip
              style={raisedButtonStyle}
            >
              <span className="uk-hidden">ask me anything</span>
            </a>
          </li>
          <li>
            <a
              className="uk-card uk-card-default uk-border-circle"
              href="/contact/"
              data-uk-icon="icon: mail"
              title="contact"
              data-uk-tooltip
              style={raisedButtonStyle}
            >
              <span className="uk-hidden">contact</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default TopNav
