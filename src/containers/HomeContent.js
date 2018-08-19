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
      {' '}
      Developer Advocate at&nbsp;
      <a
        href="https://www.freecodecamp.org"
        rel="noopener noreferrer"
        style={{
          color: '#D5F7FF',
          fontFamily: "'Quicksand', sans-serif",
          textDecoration: 'none',
          fontWeight: 'bold'
        }}
        target="_blank"
      >
        freeCodeCamp.org
      </a>
    </p>
  </div>
)
