import React, { Component } from 'react'
import Routes from './Routes'
import { Head } from './components'

export default class App extends Component {
  render() {
    return (
      <div className="Application">
        <Head />
        <Routes />
      </div>
    )
  }
}
