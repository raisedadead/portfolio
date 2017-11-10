import React, { Component } from 'react'

import { TopNav, SocialNav, Footer } from './components'

export default class App extends Component {
  render() {
    return (
      <div className="uk-container uk-width-viewport uk-height-viewport uk-padding-remove">
        <TopNav />
        <div className="uk-position-center uk-text-center">
          <h1 className="uk-heading-primary">mrugesh mohapatra</h1>
          <p>
            developer. music addict. open source enthusiast. noob photographer.
          </p>
          <SocialNav />
        </div>
        <Footer />
      </div>
    )
  }
}
