import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Field } from 'redux-form';
import './style.css';

class TextField extends Component {
    renderField(field){
      const {
        id,
        disabled,
        label,
        name,
        type,
        question,
        errorText,
        input,
        meta
      } = this.props;

      const hasError = field.meta.touched && field.meta.invalid;
      const styles = classnames({ disabled, 'textfield':true });
      const inputStyle = classnames({ 'input-text': (hasError == false) , 'error': hasError })

      return(
          <div className={styles}>
            {label && <label className="label-text">{label}</label>}

            <div className='input'>
                <input
                  id={id}
                  className={inputStyle}
                  name={name}
                  type={type}
                  alt={question}
                  {...field.input}
                />
            </div>
            {hasError && <span className="input-error-text">{errorText}</span>}
          </div>
       )
    }

    render(){
      return <Field {...this.props} component={this.renderField.bind(this)} />
    }
}

TextField.propTypes = {
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  label: PropTypes.node,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  errorText: PropTypes.node,
  question: PropTypes.string
};

TextField.defaultProps = {
  type: 'text'
};

export default TextField;
