import React, { Component } from 'react';

export default class SocialNav extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
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
    );
  }
}
