import React, { Component } from 'react'
import { Spring } from 'react-spring'

import {
  // MainNav,
  Background,
  Footer,
  ImageLoader,
  StylesHelper
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
    const fromStyle = { opacity: 0 }
    const toStyle = { opacity: 1, transition: 'opacity 2.0s' }
    return (
      <Spring from={fromStyle} to={toStyle}>
        {props => (
          <div style={props}>
            <div className={mainContainer}>
              <Background data-uk-cover />
              <div
                className="uk-position-cover"
                style={{
                  background: 'linear-gradient(to bottom, #36d1dc88, #5b86e5)'
                }}
              />
              <div style={contentSyles} className={content}>
                <div
                  style={{ width: '15vw', height: '15vw', borderRadius: '50%' }}
                  className="uk-box-shadow-large"
                >
                  <ImageLoader
                    src="assets/images/profile.webp"
                    alt="profile image"
                  />
                </div>
                <HomeContent />
                {/*<MainNav />*/}
              </div>
              <Footer />
            </div>
          </div>
        )}
      </Spring>
    )
  }
}
