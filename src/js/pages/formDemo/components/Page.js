import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import './style.css';
class Page extends Component{
  render(){
  const { children } = this.props;
  return (
      <section className="page" >
          <Header className="page-header" sendAccent={(e) => this.props.onSendAccent(e)} onStart = {this.props.onStart}/>
          <div className="page-body">
             <div className="body-container">
                 {children}
             </div>
          </div>
      </section>
  );
 }
}


Page.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  id: PropTypes.string,
};

export default Page;
