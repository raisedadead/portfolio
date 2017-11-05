import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div id="wrapper">
        <div id="bg" />
        <div id="overlay" />
        <div id="main">
          <header id="header">
            <h1>mrugesh mohapatra</h1>
            <p>
              developer. music addict. open source enthusiast. noob
              photographer.
            </p>
            <nav>
              <ul>
                <li>
                  <a href="https://twitter.com/raisedadead">
                    <span class="label">Twitter</span>
                  </a>
                </li>
                <li>
                  <a href="https://freeCodeCamp.org/raisedadead">
                    <span class="label">freeCodeCamp</span>
                  </a>
                </li>
                <li>
                  <a href="https://github.com/raisedadead">
                    <span class="label">GitHub</span>
                  </a>
                </li>
                <li>
                  <a href="https://blog.raisedadead.com">
                    <span class="label">Medium</span>
                  </a>
                </li>
                <li>
                  <a href="https://linkedin.com/in/mrugeshm">
                    <span class="label">LinkedIn</span>
                  </a>
                </li>
              </ul>
            </nav>
          </header>

          <footer id="footer">
            <span class="copyright">
              COPYRIGHT &copy; 2017 MRUGESH MOHAPATRA.
            </span>
          </footer>
        </div>
      </div>
    );
  }
}

export default App;
