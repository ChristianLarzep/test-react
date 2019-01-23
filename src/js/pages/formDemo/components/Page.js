import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import './style.css';

function Page(props){
  const {id, className, children } = props;
  return (
      <section className="page">
          <Header className="page-header"/>
          <div className="page-body">
             <div className="body-container">
               <div className="form">
                 {children}
               </div>
             </div>
          </div>
      </section>
  );
}


Page.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  id: PropTypes.string,
};

export default Page;
