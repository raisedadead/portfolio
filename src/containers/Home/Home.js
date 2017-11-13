import React from 'react'

import { TopNav, SocialNav, Footer, ImageLoader } from '../../components'

const Home = () => (
  <div className="uk-container uk-cover-container uk-width-viewport uk-height-viewport uk-padding-remove">
    <ImageLoader
      src="assets/images/background.jpg"
      alt="background"
      data-uk-cover
    />
    <TopNav />
    <div className="uk-position-center uk-text-center">
      <p
        className="uk-heading-primary"
        style={{ color: '#00649F', fontFamily: "'Lora', sans-serif" }}
      >
        mrugesh mohapatra
      </p>
      <p
        className="uk-text-large"
        style={{ color: '#32424A', fontFamily: "'Montserrat', sans-serif" }}
      >
        developer. music addict. open source enthusiast. noob photographer.
      </p>
      <SocialNav />
    </div>
    <Footer />
  </div>
)

export default Home
