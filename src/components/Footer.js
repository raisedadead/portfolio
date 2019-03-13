import React from 'react';
import SocialNav from './Nav/SocialNav';

const Footer = () => (
  <footer>
    <SocialNav />
    <span>Copyright &copy; {new Date().getFullYear()} Mrugesh Mohapatra.</span>
  </footer>
);

export default Footer;
