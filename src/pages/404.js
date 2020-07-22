import React from 'react';
import tw, { styled, css } from 'twin.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInstagram,
  faTwitter,
  faGithub,
  faLinkedin
} from '@fortawesome/free-brands-svg-icons';

const dashedLinkStyle = css`
  ${tw`border-dashed border-gray-500 border-b-2 no-underline`}
`;

const FourOhFourLayout = styled.div`
  ${tw`font-poppins antialiased w-screen h-screen mx-auto flex flex-col justify-center items-center`}
`;

const Footer = styled.footer`
  ${tw`absolute bottom-0 w-screen text-gray-800 shadow-inner`}
`;

const FAIcon = ({ icon }) => (
  <FontAwesomeIcon
    css={css`
      ${tw`ml-6 w-4 h-4`}
    `}
    icon={icon}
  />
);

export const FourOhFourMarkup = () => (
  <FourOhFourLayout>
    <h1>404 | Page not found.</h1>
    <br />
    <h4>
      Uh - Oh! Apologies, looks like the something you were looking for has been
      lost to oblivion.
    </h4>
    <br />
    <h4>
      Why don't you checkout {` `}
      <a
        css={css`
          ${dashedLinkStyle}
        `}
        href="/"
      >
        something interesting instead
      </a>
      .
    </h4>
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
  </FourOhFourLayout>
);

FourOhFourMarkup.displayName = `FourOhFourMarkup`;
export default FourOhFourMarkup;
