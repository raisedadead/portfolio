import React, { Component } from 'react'
import Routes from './Routes'
import { PageHeaders } from './components'

export default class App extends Component {
  state = {
    loading: true,
    loadStartTime: new Date()
  }

  componentDidMount() {
    const loadTime = new Date() - this.state.loadStartTime
    if (loadTime < 200) {
      setTimeout(() => {
        this.setState({ loading: false })
      }, 1000)
    } else {
      this.setState({ loading: false })
    }
  }

  render() {
    const { loading } = this.state

    if (loading) {
      return null
    }

    const spinnerContainer = document.getElementById('spinner-container')
    if (spinnerContainer) {
      spinnerContainer.classList.add('available')
      setTimeout(() => {
        // remove from DOM
        spinnerContainer.outerHTML = ''
      }, 2000)
    }
    return (
      <div className="Application">
        <PageHeaders />
        <Routes />
      </div>
    )
  }
}
