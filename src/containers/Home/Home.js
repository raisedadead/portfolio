import React from 'react'

import { TopNav, SocialNav, Footer } from '../../components'

const Home = () => (
  <div className="uk-container uk-cover-container uk-width-viewport uk-height-viewport uk-padding-remove">
    <img src="assets/images/background.jpg" alt="background" data-uk-cover />
    <TopNav />
    <div className="uk-position-center uk-text-center">
      <p className="uk-heading-primary" style={{ color: 'black' }}>
        mrugesh mohapatra
      </p>
      <p className="uk-text-large">
        developer. music addict. open source enthusiast. noob photographer.
      </p>
      <SocialNav />
    </div>
    <Footer />
  </div>
)

export default Home
