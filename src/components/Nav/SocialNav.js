import React from 'react';

const SocialNav = () => (
  <nav>
    <div>
      <ul>
        <li>
          <a
            aria-label="Twitter"
            title="Twitter"
            href="https://twitter.com/raisedadead"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Twitter</span>
          </a>
        </li>
        <li>
          <a
            aria-label="GitHub"
            title="GitHub"
            href="https://github.com/raisedadead"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>GitHub</span>
          </a>
        </li>
        <li>
          <a
            aria-label="Medium"
            title="Medium"
            href="https://blog.raisedadead.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Medium</span>
          </a>
        </li>
        <li>
          <a
            aria-label="freeCodeCamp"
            title="freeCodeCamp"
            href="https://freeCodeCamp.org/raisedadead"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>freeCodeCamp</span>
          </a>
        </li>
        <li>
          <a
            aria-label="LinkedIn"
            title="LinkedIn"
            href="https://linkedin.com/in/mrugeshm"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>LinkedIn</span>
          </a>
        </li>
      </ul>
    </div>
  </nav>
);

export default SocialNav;
