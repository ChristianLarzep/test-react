import React, { Component }  from 'react';
import PropTypes from 'prop-types';

import classnames from 'classnames';
import './style.css';
class Page extends Component{
  render(){
  const { children, background } = this.props;
  const styles = classnames({
    [`${background}-background`]: !!background,
    'page-body': true
  })
  return (
          <div className={styles}>
             {children}
          </div>
  );
 }
}

Page.propTypes = {
  children: PropTypes.node,
  background: PropTypes.string
};

export default Page;
