import React from 'react'

const raisedButtonStyle = { height: 50, margin: '4px 0 4px 0' }
const TopNav = () => {
  return (
    <nav className="uk-navbar-container uk-navbar-transparent" data-uk-navbar>
      <div className="uk-navbar-right">
        <ul className="uk-navbar-nav uk-iconnav">
          <li>
            <a
              title="résumé"
              href="/resume/"
              className="uk-card uk-card-default uk-border-circle"
              data-uk-icon="icon: copy"
              data-uk-tooltip
              style={raisedButtonStyle}
            >
              <span className="uk-hidden">résumé</span>
            </a>
          </li>
          <li>
            <a
              title="ask me anything"
              href="https://github.com/raisedadead/ama/"
              className="uk-card uk-card-default uk-border-circle"
              data-uk-icon="icon: comment"
              data-uk-tooltip
              style={raisedButtonStyle}
            >
              <span className="uk-hidden">ask me anything</span>
            </a>
          </li>
          <li>
            <a
              title="contact"
              href="/contact/"
              className="uk-card uk-card-default uk-border-circle"
              data-uk-icon="icon: mail"
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
