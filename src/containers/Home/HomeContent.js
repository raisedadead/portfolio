import React from 'react'
import { StylesHelper } from '../../components/Utils'

const heading = StylesHelper('uk-heading-primary')
const tagline = StylesHelper('uk-text-large')
const HomeContent = props => (
  <div {...props}>
    <p
      className={heading}
      style={{ color: '#F5F5F5', fontFamily: "'Lora', sans-serif" }}
    >
      mrugesh mohapatra
    </p>
    <p
      className={tagline}
      style={{ color: '#D5F7FF', fontFamily: "'Montserrat', sans-serif" }}
    >
      developer. music addict. open source enthusiast. noob photographer.
    </p>
  </div>
)

export default HomeContent
