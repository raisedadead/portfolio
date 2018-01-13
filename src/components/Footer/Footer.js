import React from 'react'
import SocialNav from '../Nav/SocialNav'

export default () => (
  <footer
    className="uk-position-bottom-center uk-margin-bottom"
    style={{ color: '#D5F7FF', fontFamily: "'Quicksand', sans-serif" }}
  >
    <SocialNav style={{ marginBottom: '10px' }} />
    <span>Copyright &copy; {new Date().getFullYear()} Mrugesh Mohapatra.</span>
  </footer>
)
