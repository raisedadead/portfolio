import React, { Component } from 'react'

const raisedButtonStyle = {
  backgroundColor: '#36d1dc',
  color: '#155263',
  fontWeight: 'bold'
}

export default class MainNav extends Component {
  constructor(props, context) {
    super(props, context)
    this.verifyCallback = this.verifyCallback.bind(this)
    this.handleAMAClick = this.handleAMAClick.bind(this)
    this.handleCalendlyClick = this.handleCalendlyClick.bind(this)
  }

  verifyCallback(recaptchaToken) {
    console.log(recaptchaToken, '<= your recaptcha token')
  }

  handleCalendlyClick = () => {
    window.grecaptcha.ready(function() {
      window.grecaptcha
        .execute('6LdKBXcUAAAAAE2TSd6rjjzK2lTybOtJmvvWJ5kW', {
          action: 'calendly'
        })
        .then(function(token) {
          console.log(token)
          window.Calendly.showPopupWidget('https://calendly.com/mrugesh-m')
        })
    })
  }

  handleAMAClick = e => {
    window.open('https://github.com/raisedadead/ama/', '_blank')
  }

  render() {
    return (
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
                onClick={this.handleCalendlyClick}
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
                onClick={this.handleAMAClick}
              >
                <span data-uk-icon="icon: question" />
              </button>
            </li>
          </ul>
        </div>
      </nav>
    )
  }
}
