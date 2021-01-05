import React from 'react';
import { FaRegCopyright } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className='footer'>
      <div className='container'>
        <p>
          <FaRegCopyright /> Copyright DEVPAGE - {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
