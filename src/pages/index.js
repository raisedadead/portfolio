import HomeContent from '../components/Home/HomeContent';
import React from 'react';

export const IndexMarkup = () => (
  <div>
    <HomeContent />
    <df-messenger
      intent="WELCOME"
      chat-title="frozen-fire"
      agent-id="8faaae5b-a250-4a2e-a958-6833a2d0c1d3"
      language-code="en"
    ></df-messenger>
  </div>
);

IndexMarkup.displayName = `IndexMarkup`;
export default IndexMarkup;
