import React, { Component } from 'react'

import { TopNav, SocialNav, Footer } from './components'

export default class App extends Component {
  render() {
    return (
      <div className="uk-container uk-height-viewport uk-background-muted">
        <TopNav />
        <div className="uk-position-center uk-text-center">
          <h1 className="uk-heading-primary">mrugesh mohapatra</h1>
          <p>
            developer. music addict. open source enthusiast. noob photographer.
          </p>
          <SocialNav />
          <Footer />
        </div>
      </div>
    )
  }
}
