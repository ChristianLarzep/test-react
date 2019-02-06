import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './style.css';
import Button from '../../../components/Button/Button';

class Header extends Component {
  state = { accent: 'United States' };

  selectAccent = e => {
    const { selectAccent } = this.props;
    this.setState({ accent: e.target.value });
    selectAccent(e);
  }

  render() {
    const { onStart } = this.props;
    const { accent } = this.state;
    return (
      <header className="page-header">
        <div className="logo">
           Logo
        </div>
        <div className="btn-talk">
          <Button color="start" disabled={false} spinner={false} onClick={onStart}>
               Start
          </Button>
        </div>
        <div id="div_language">
          <select
            id="select_dialect"
            value={accent}
            onChange={this.selectAccent}
          >
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
  selectAccent: PropTypes.func,
  onStart: PropTypes.func,
};

export default Header;
