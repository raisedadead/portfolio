import React from 'react'
import { StylesHelper } from '../components/'

const heading = StylesHelper('uk-heading-primary')
const tagline = StylesHelper('uk-text-large')

export default props => (
  <div {...props}>
    <header>
      <h1
        className={heading}
        style={{
          color: '#F5F5F5',
          fontFamily: "'Quicksand', sans-serif",
          fontWeight: 'bold'
        }}
      >
        mrugesh mohapatra
      </h1>
    </header>
    <main>
      <h2
        className={tagline}
        style={{ color: '#D5F7FF', fontFamily: "'Quicksand', sans-serif" }}
      >
        developer. music addict. open source enthusiast. noob photographer.
      </h2>
      <p style={{ color: '#D5F7FF', fontFamily: "'Quicksand', sans-serif" }}>
        Developer Advocate at freeCodeCamp.org
      </p>
    </main>
  </div>
)
