import React from 'react'
import { StylesHelper } from '../components/'

const mainContainer = StylesHelper(
  'uk-container',
  'uk-cover-container',
  'uk-width-viewport',
  'uk-height-viewport',
  'uk-padding-remove'
)
const content = StylesHelper('uk-position-center', 'uk-text-center')

export default () => (
  <div className={mainContainer}>
    <div className={content}>
      <span data-uk-icon="icon: ban; ratio:2;" />
      <h4 style={{ color: '#01AAC1', fontFamily: "'Montserrat', sans-serif" }}>
        404 | Nah...not happening. Can't find you need !
      </h4>
    </div>
  </div>
)
