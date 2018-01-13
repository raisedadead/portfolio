import React from 'react'

const raisedButtonStyle = {
  height: '50px',
  margin: '4px 0px',
  backgroundColor: '#36d1dc',
  color: '#155263',
  fontWeight: 'bold'
}
export default () => (
  <nav
    className="uk-navbar-container uk-navbar-transparent uk-margin-top uk-margin-right"
    data-uk-navbar
  >
    <div className="uk-navbar-center">
      <ul className="uk-navbar-nav uk-iconnav">
        <li>
          <a
            title="résumé"
            href="https://git.raisedadead.com/resume/"
            className="uk-box-shadow-small uk-border-rounded"
            data-uk-tooltip="pos: bottom"
            target="_blank"
            rel="noopener noreferrer"
            style={raisedButtonStyle}
          >
            <span>résumé</span>
          </a>
        </li>
        <li>
          <a
            title="ask me anything"
            href="https://github.com/raisedadead/ama/"
            className="uk-box-shadow-small uk-border-rounded"
            data-uk-tooltip="pos: bottom"
            target="_blank"
            rel="noopener noreferrer"
            style={raisedButtonStyle}
          >
            <span>ask me anything</span>
          </a>
        </li>
      </ul>
    </div>
  </nav>
)
