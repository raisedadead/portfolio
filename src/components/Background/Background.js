import React from 'react'
import ImageLoader from '../Utils/ImageLoader'

const Background = props => (
  <ImageLoader src="assets/images/background.jpg" alt="background" {...props} />
)

export default Background
