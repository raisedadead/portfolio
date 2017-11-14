import React, { Component } from 'react'
import { PropTypes } from 'prop-types'

export default class ImageLoader extends Component {
  constructor(props) {
    super(props)
    this.state = { style: { opacity: 0 } }
  }

  onImageLoad = () => {
    const updatedStyle = { opacity: 1, transition: 'opacity 1.0s' }
    this.setState({ style: updatedStyle })
  }

  render = () => {
    const { alt, ...props } = this.props
    return (
      <img
        {...props}
        alt={alt}
        style={this.state.style}
        onLoad={this.onImageLoad.bind(this)}
      />
    )
  }
}

ImageLoader.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string
}

ImageLoader.defaultProps = {
  src: '',
  alt: ''
}
