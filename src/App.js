import React, { Component } from 'react';
import RNav from './components/index';

class App extends Component {
  render() {
    return (
      <div>
        <header>
          <RNav />
          <h1>mrugesh mohapatra</h1>
          <p>
            developer. music addict. open source enthusiast. noob photographer.
          </p>
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
        </header>

        <footer>
          <span>COPYRIGHT &copy; 2017 MRUGESH MOHAPATRA.</span>
        </footer>
      </div>
    );
  }
}

export default App;
