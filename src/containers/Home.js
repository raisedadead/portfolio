import React, { Component } from 'react'
import {
  MainNav,
  Footer,
  Background,
  StylesHelper,
  ImageLoader
} from '../components'

import HomeContent from './HomeContent'

const mainContainer = StylesHelper(
  'uk-container',
  'uk-cover-container',
  'uk-width-viewport',
  'uk-height-viewport',
  'uk-padding-remove'
)
const content = StylesHelper('uk-position-center', 'uk-text-center')

const contentSyles = {
  width: '60vw',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
}
export default class Home extends Component {
  render() {
    return (
      <div className={mainContainer}>
        <Background data-uk-cover />
        <div
          className="uk-position-cover"
          style={{
            background: 'linear-gradient(to right, #36d1dcaa, #5b86e5aa)'
          }}
        />
        <div style={contentSyles} className={content}>
          <div style={{ width: '25%', height: '25%' }}>
            <ImageLoader src="assets/images/profile.png" alt="profile image" />
          </div>
          <HomeContent />
          <MainNav />
        </div>
        <Footer />
      </div>
    )
  }
}
