import React, { Component } from 'react'

export default class TopNav extends Component {
  render() {
    return (
      <nav className="uk-navbar-container uk-navbar-transparent" uk-navbar>
        <div className="uk-navbar-right">
          <ul className="uk-navbar-nav">
            <li>
              <a href="/resume/">résumé</a>
            </li>
            <li>
              <a href="https://github.com/raisedadead/ama/">ama</a>
            </li>
            <li>
              <a href="/contact/">contact</a>
            </li>
          </ul>
        </div>
      </nav>
    )
  }
}
