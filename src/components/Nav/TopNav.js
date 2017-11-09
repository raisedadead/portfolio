import React from 'react'

const TopNav = () => {
  return (
    <nav
      className="uk-navbar-container uk-navbar-right uk-navbar-transparent"
      data-uk-navbar
    >
      <div className="uk-navbar-right">
        <ul className="uk-navbar-nav uk-iconnav">
          <li>
            <a
              href="/resume/"
              data-uk-icon="icon: copy"
              title="résumé"
              data-uk-tooltip
            >
              <span className="uk-hidden">résumé</span>
            </a>
          </li>
          <li>
            <a
              href="https://github.com/raisedadead/ama/"
              data-uk-icon="icon: comment"
              title="ask me anything"
              data-uk-tooltip
            >
              <span className="uk-hidden">ask me anything</span>
            </a>
          </li>
          <li>
            <a
              href="/contact/"
              data-uk-icon="icon: mail"
              title="contact"
              data-uk-tooltip
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
