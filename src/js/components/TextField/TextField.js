import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Field } from 'redux-form';
import './style.css';

function TextField(props) {
  const {
    id,
    //className,
    disabled,
    //errorText,
    label,
    name,
    type,
    input,
    question,
    //value,
    //...others
  } = props;

  const stylenames = classnames({
      disabled,
      'textfield':true
    });

  return (
    <div className={stylenames}>
      {label && <label className="label-text">{label}</label>}

      <div className='input'>
        {input && <Field  id={id} {...input} component="input" className="" type={type} alt={question} />}
        {!input && (
          <Field
            id={id}
            className="input-text"
            name={name}
            type={type}
            component="input"
            alt={question}
          />
        )}
      </div>
    </div>
  );
}

TextField.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  errorText: PropTypes.node,
  id: PropTypes.string.isRequired,
  /**
  * ReduxForm Prop
  */
  input: PropTypes.shape({
    name: PropTypes.string,
    onChange: PropTypes.func,
  }),
  label: PropTypes.node,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,

};

TextField.defaultProps = {
  type: 'text',
  errorText: 'Valor requerido',
};

export default TextField;
