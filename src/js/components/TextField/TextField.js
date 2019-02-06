import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Field } from 'redux-form';
import { autobind } from 'core-decorators';
import './style.css';

class TextField extends Component {
  @autobind
  renderField(field) {
    const {
      id,
      label,
      name,
      type,
      question,
      errorText,
      className,
      multiLine,
    } = this.props;

    const hasError = field.meta.touched && field.meta.invalid;
    const inputStyle = classnames({ 'input-text': (hasError === false), error: hasError });
    const styles = `textfield ${className}`;
    let inputElement;

    if (multiLine) {
      inputElement = (<textarea {...field.input} name={name} className={inputStyle} />);
    } else {
      inputElement = (
        <input
          id={id}
          className={inputStyle}
          name={name}
          type={type}
          {...field.input}
        />
      );
    }

    return (
      <div className={styles}>
        {label && <div className="label"><span className="label-text">{label}</span></div>}

        <div className="input">
          {inputElement}
          <div className="divCheckbox" style={{ display: 'none' }}>{question}</div>
        </div>

        {hasError && <span className="input-error-text">{errorText}</span>}
      </div>
    );
  }

  render() {
    return <Field {...this.props} component={this.renderField} />;
  }
}

TextField.propTypes = {
  disabled: PropTypes.bool,
  errorText: PropTypes.node,
  id: PropTypes.string.isRequired,
  label: PropTypes.node,
  multiLine: PropTypes.bool,
  name: PropTypes.string.isRequired,
  question: PropTypes.string,
  type: PropTypes.string,
};

TextField.defaultProps = {
  type: 'text',
  multiLine: false,
  errorText: 'Valor requerido',
};

export default TextField;
