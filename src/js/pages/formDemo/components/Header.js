import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './style.css';
import Button from '../../../components/Button/Button';

class Header extends Component {
  state = {
    accent: 'United States'
  }

  selectAccent = e => {
    this.setState({
      accent: e.target.value
    })
    this.props.sendAccent(e)
  }

  render(){
  const { className } = this.props;
  return (
    <header className={className}>
      <div className="logo">
         Logo
      </div>
      <div className="btn-talk">
          <Button color="start"  disabled={false} spinner={false}  onClick = {this.props.onStart}>
             Start
         </Button>
      </div>
      <div id="div_language">
         <select id="select_dialect"
         value={this.state.accent}
         onChange={this.selectAccent} >
           <option value="Australia">Australia</option>
           <option value="Canada">Canada</option>
           <option value="India">India</option>
           <option value="New Zealand">New Zealand</option>
           <option value="South Africa">South Africa</option>
           <option value="United Kingdom">United Kingdom</option>
           <option value="United States">United States</option>
         </select>
       </div>
    </header>
  );
 }
}

Header.propTypes = {
  className: PropTypes.string,
};

export default Header;
