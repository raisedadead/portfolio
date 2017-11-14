import React, { Component } from 'react'
import { TopNav, SocialNav, Footer, Background } from '../../components'
import { HomeContent } from '.'
import { StylesHelper } from '../../components/'
import { DoubleBounce } from 'better-react-spinkit'

const mainContainer = StylesHelper(
  'uk-container',
  'uk-cover-container',
  'uk-width-viewport',
  'uk-height-viewport',
  'uk-padding-remove'
)
const content = StylesHelper('uk-position-center', 'uk-text-center')

export default class Home extends Component {
  render() {
    return (
      <div className={mainContainer}>
        <Background data-uk-cover />
        <TopNav />
        <div className={content}>
          <HomeContent />
          <DoubleBounce size={50} className={content} />
          <SocialNav />
        </div>
        <Footer />
      </div>
    )
  }
}
