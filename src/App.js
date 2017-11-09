import React, { Component } from 'react'

import { TopNav, SocialNav, Footer } from './components/index'

export default class App extends Component {
  render() {
    return (
      <div className="uk-container">
        <div className="uk-container">
          <TopNav />
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
