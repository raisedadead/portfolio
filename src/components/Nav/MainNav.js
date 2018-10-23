import React from 'react'

const raisedButtonStyle = {
  backgroundColor: '#36d1dc',
  color: '#155263',
  fontWeight: 'bold'
}

const handleCalendlyClick = e => {
  e.preventDefault()
  window.Calendly.showPopupWidget('https://calendly.com/mrugesh-m')
  return false
}

const handleAMAClick = e => {
  e.preventDefault()
  window.open('https://github.com/raisedadead/ama/', '_blank')
  return false
}

export default () => (
  <nav
    className="uk-navbar-container uk-navbar-transparent uk-margin-top uk-margin-right"
    data-uk-navbar
  >
    <div className="uk-navbar-center">
      <ul className="uk-navbar-nav uk-iconnav">
        <li>
          <button
            title="schedule a meeting with me"
            className="uk-box-shadow-small uk-border-rounded uk-button"
            data-uk-tooltip="pos: bottom"
            style={raisedButtonStyle}
            onClick={handleCalendlyClick}
          >
            <span data-uk-icon="icon: calendar" />
          </button>
        </li>
        <li>
          <button
            title="ask me anything"
            className="uk-box-shadow-small uk-border-rounded uk-button"
            data-uk-tooltip="pos: bottom"
            style={raisedButtonStyle}
            onClick={handleAMAClick}
          >
            <span data-uk-icon="icon: question" />
          </button>
        </li>
      </ul>
    </div>
  </nav>
)
