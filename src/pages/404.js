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
  background: #a0f6d2;
`;

export const FourOhFourMarkup = () => (
  <FourOhFourLayout>
    <div
      css={css`
        ${tw`text-center text-gray-700 font-bold p-8 md:p-12 lg:p-16 flex flex-col`}
      `}
    >
      <h1
        css={css`
          ${tw`text-2xl md:text-4xl mb-8`}
        `}
      >
        404 | Page not found.
      </h1>

      <p
        css={css`
          ${tw`text-base mb-8`}
        `}
      >
        Uh - Oh! Apologies, looks like the something you were looking for has
        been lost to oblivion.
      </p>

      <p
        css={css`
          ${tw`text-base mb-8`}
        `}
      >
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
      </p>
    </div>
    <Footer>
      <div
        css={css`
          ${tw`container mx-auto px-0 py-2 flex flex-col justify-center items-center md:py-4 md:flex-row md:justify-between md:w-2/3 lg:w-1/2`}
        `}
      >
        <span
          css={css`
            ${tw`mb-2 md:my-auto`}
          `}
        >
          &copy; {new Date().getFullYear()} Mrugesh Mohapatra.
        </span>
        <div
          css={css`
            ${tw`flex flex-row justify-center items-center`}
          `}
        >
          <a
            href="https://twitter.com/raisedadead"
            aria-label="twitter"
            target="_blank"
            rel="me noopener noreferrer"
          >
            <FontAwesomeIcon
              css={css`
                ${tw`ml-4`}
              `}
              icon={faTwitter}
            />
          </a>
          <a
            href="https://github.com/raisedadead"
            aria-label="github"
            target="_blank"
            rel="me noopener noreferrer"
          >
            <FontAwesomeIcon
              css={css`
                ${tw`ml-4`}
              `}
              icon={faGithub}
            />
          </a>
          <a
            href="https://linkedin.com/in/mrugeshm"
            aria-label="linkedin"
            target="_blank"
            rel="me noopener noreferrer"
          >
            <FontAwesomeIcon
              css={css`
                ${tw`ml-4`}
              `}
              icon={faLinkedin}
            />
          </a>
          <a
            href="https://instagram.com/raisedadead"
            aria-label="instagram"
            target="_blank"
            rel="me noopener noreferrer"
          >
            <FontAwesomeIcon
              css={css`
                ${tw`ml-4`}
              `}
              icon={faInstagram}
            />
          </a>
        </div>
      </div>
    </Footer>
  </FourOhFourLayout>
);

FourOhFourMarkup.displayName = `FourOhFourMarkup`;
export default FourOhFourMarkup;
