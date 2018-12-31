import React, { Component } from 'react'
import Routes from './Routes'
import { PageHeaders } from './components'

export default class App extends Component {
  render() {
    return (
      <div className="Application">
        <PageHeaders />
        <Routes />
      </div>
    )
  }
}
