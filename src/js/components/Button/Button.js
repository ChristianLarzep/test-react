import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './style.css';

function Button(props) {
  const { className, children, color, disabled, onClick, spinner, ...others } = props;

  const stylenames = classnames({
    btn: true,
    [`btn-${color}`]: (!!color && disabled == false),
    className:true,
    [`disabled-${color}`]: disabled
  });

  return (
    <button {...others} className={stylenames} onClick={onClick} disabled={disabled}>
      {!spinner && children}
      {spinner && <i class="fa fa-circle-o-notch fa-spin"></i>}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  color: PropTypes.string,
  disabled: PropTypes.bool,
  spinner: PropTypes.bool,
  type: PropTypes.string,
  onClick: PropTypes.func,
};

Button.defaultProps = {
  type: 'button',
};

export default Button;
