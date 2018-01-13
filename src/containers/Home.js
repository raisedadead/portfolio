import React, { Component } from 'react'
import { MainNav, Footer, Background, StylesHelper } from '../components'

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
  width: '75vw',
  height: '50vh',
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
          <HomeContent />
          <MainNav />
        </div>
        <Footer />
      </div>
    )
  }
}
