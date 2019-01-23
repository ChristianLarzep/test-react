import React from 'react';
import PropTypes from 'prop-types';
import './style.css';

function Header(props) {
  const { className } = props;
  return (
    <header className={className}>
      <div className="container">
        Logo
      </div>
    </header>
  );
}

Header.propTypes = {
  className: PropTypes.string,
};

export default Header;
