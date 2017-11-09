import React from 'react'

const SocialNav = () => {
  return (
    <div>
      <ul>
        <li>
          <a href="https://twitter.com/raisedadead">
            <span className="label">Twitter</span>
          </a>
        </li>
        <li>
          <a href="https://freeCodeCamp.org/raisedadead">
            <span className="label">freeCodeCamp</span>
          </a>
        </li>
        <li>
          <a href="https://github.com/raisedadead">
            <span className="label">GitHub</span>
          </a>
        </li>
        <li>
          <a href="https://blog.raisedadead.com">
            <span className="label">Medium</span>
          </a>
        </li>
        <li>
          <a href="https://linkedin.com/in/mrugeshm">
            <span className="label">LinkedIn</span>
          </a>
        </li>
      </ul>
    </div>
  )
}

export default SocialNav
