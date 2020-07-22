import React from 'react';
import tw, { styled, css } from 'twin.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInstagram,
  faTwitter,
  faGithub,
  faLinkedin
} from '@fortawesome/free-brands-svg-icons';

import ProfileImage from '../images/profile.png';

const dashedLinkStyle = css`
  ${tw`border-dashed border-gray-500 border-b-2 no-underline`}
`;

const HomeLayout = styled.div`
  ${tw`font-poppins antialiased w-screen h-screen mx-auto flex sm:flex-row flex-col justify-center items-center`}
  background: #90cdf4; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to bottom,
    #ffffff,
    #abdcff
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to bottom,
    #ffffff,
    #abdcff
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
`;

const HomeCard = ({ children }) => (
  <div
    css={css`
      ${tw`w-4/5 md:w-1/2 rounded-lg bg-white`}
      box-shadow: 50px 50px 100px #33383f;
    `}
  >
    <div
      css={css`
        ${tw`p-8 md:p-16 text-center`}
      `}
    >
      {children}
    </div>
  </div>
);

const Footer = styled.footer`
  ${tw`absolute bottom-0 w-screen text-gray-800 shadow-inner`}
  background: #90cdf4;
`;

const FAIcon = ({ icon }) => (
  <FontAwesomeIcon
    css={css`
      ${tw`ml-6 w-4 h-4`}
    `}
    icon={icon}
  />
);

export const IndexMarkup = () => (
  <HomeLayout>
    <HomeCard>
      <img
        css={css`
          ${tw`rounded-full mx-auto -mt-16 mb-4 md:-mt-32 md:mb-16 h-32 w-32 md:h-48 md:w-48`}
          box-shadow: 50px 50px 100px #33383f;
        `}
        src={ProfileImage}
        alt="Mrugesh Mohapatra's profile image"
      />

      <h1
        css={css`
          ${tw`text-2xl md:text-4xl font-black text-gray-800`}
        `}
      >
        mrugesh mohapatra
      </h1>

      <hr
        css={css`
          ${tw`mx-auto w-1/4 mt-2 mb-8 border-blue-600 border-2`}
        `}
      />

      <h2
        css={css`
          ${tw`text-base md:text-xl my-8 font-bold text-gray-800`}
        `}
      >
        developer 👨‍💻 • music addict 🎸 • open source enthusiast🌟 • photography
        noob 📷 • travel 🥑
      </h2>

      <h3
        css={css`
          ${tw`text-base md:text-xl my-8 font-bold text-gray-800`}
        `}
      >
        Technology & Community,{`  `}
        <a
          css={css`
            ${dashedLinkStyle}
          `}
          href="https://www.freecodecamp.org"
          aria-label="freecodecamp.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          freeCodeCamp.org
        </a>
      </h3>

      <p
        css={css`
          ${tw`text-sm md:text-base my-8 font-bold text-gray-800`}
        `}
      >
        Consider browsing {`  `}
        <a
          css={css`
            ${dashedLinkStyle}
          `}
          href="https://devlog.sh"
          aria-label="blog"
          target="_blank"
          rel="noopener noreferrer"
        >
          my blog 📝
        </a>
        , or buying me {` `}
        <a
          css={css`
            ${dashedLinkStyle}
          `}
          href="https://www.buymeacoffee.com/mrugesh"
          aria-label="buy me a coffee"
          target="_blank"
          rel="noopener noreferrer"
        >
          a coffee ☕️
        </a>
        .
      </p>
    </HomeCard>
    <Footer>
      <div
        css={css`
          ${tw`container mx-auto px-4 py-4 md:px-16 flex md:flex-row flex-col md:justify-between justify-center content-center items-center`}
        `}
      >
        <span
          css={css`
            ${tw`mb-2 md:my-auto`}
          `}
        >
          &copy; {new Date().getFullYear()} Mrugesh Mohapatra.
        </span>
        <span>
          <a
            href="https://twitter.com/raisedadead"
            aria-label="twitter"
            target="_blank"
            rel="me noopener noreferrer"
          >
            <FAIcon icon={faTwitter} />
          </a>
          <a
            href="https://github.com/raisedadead"
            aria-label="github"
            target="_blank"
            rel="me noopener noreferrer"
          >
            <FAIcon icon={faGithub} />
          </a>
          <a
            href="https://linkedin.com/in/mrugeshm"
            aria-label="linkedin"
            target="_blank"
            rel="me noopener noreferrer"
          >
            <FAIcon icon={faLinkedin} />
          </a>
          <a
            href="https://instagram.com/raisedadead"
            aria-label="instagram"
            target="_blank"
            rel="me noopener noreferrer"
          >
            <FAIcon icon={faInstagram} />
          </a>
        </span>
      </div>
    </Footer>
  </HomeLayout>
);

IndexMarkup.displayName = `IndexMarkup`;
export default IndexMarkup;
