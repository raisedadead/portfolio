import React from 'react'
import { StylesHelper } from '../components/'

const heading = StylesHelper('uk-heading-primary')
const tagline = StylesHelper('uk-text-large')

export default props => (
  <div {...props}>
    <p
      className={heading}
      style={{
        color: '#F5F5F5',
        fontFamily: "'Quicksand', sans-serif",
        fontWeight: 'bold'
      }}
    >
      mrugesh mohapatra
    </p>
    <p
      className={tagline}
      style={{ color: '#D5F7FF', fontFamily: "'Quicksand', sans-serif" }}
    >
      developer. music addict. open source enthusiast. noob photographer.
    </p>
    <p style={{ color: '#D5F7FF', fontFamily: "'Quicksand', sans-serif" }}>
      Developer Advocate at freeCodeCamp.org
    </p>
  </div>
)
