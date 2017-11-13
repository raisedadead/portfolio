import React from 'react'
import { TopNav, SocialNav, Footer, Background } from '../../components'
import { HomeContent } from '.'
import { StylesHelper } from '../../components/Utils'

const mainContainer = StylesHelper(
  'uk-container',
  'uk-cover-container',
  'uk-width-viewport',
  'uk-height-viewport',
  'uk-padding-remove'
)
const content = StylesHelper('uk-position-center', 'uk-text-center')

const Home = () => (
  <div className={mainContainer}>
    <Background data-uk-cover />
    <TopNav />
    <div className={content}>
      <HomeContent />
      <SocialNav />
    </div>
    <Footer />
  </div>
)

export default Home
