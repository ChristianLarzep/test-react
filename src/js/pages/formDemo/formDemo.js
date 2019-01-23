import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {  reduxForm, Form, Field } from 'redux-form';

import Page from './components/Page';

import Helmet from '../../components/Helmet/Helmet';
import Title from '../../components/Title/Title';
import TextField from '../../components/TextField/TextField';
import Button from '../../components/Button/Button';

import './style.css';

class FormDemo extends Component{

  static propTypes = {
      errors: PropTypes.shape({
        message: PropTypes.string,
      }),
      handleSubmit: PropTypes.func,
      loading: PropTypes.bool,
      login: PropTypes.func,
      resendToken: PropTypes.func,
      resetState: PropTypes.func,
      role: PropTypes.string,
      success: PropTypes.bool,
    };

  constructor(props){
    super(props)
    this.state = {

    }
  }


  mySubmit = async data => {
    console.log("DATA: ",data);
  };

  render(){
    const { handleSubmit, pristine, reset, submitting, loading  } = this.props;
    return(
       <Page id="login-page" className="login-page">
           <Helmet>
               <title>Bienvenido</title>
           </Helmet>
           <Title color="purple" tag="h3" >Formulario</Title>
           <Form  onSubmit={handleSubmit}>
              <div className="row">
               <TextField
                  id="email"
                  name="email"
                  type="email"
                  errorText="Ingresa un formato de correo correcto."
                />
                <TextField
                   id="password"
                   name="password"
                   type="password"
                   label="Contraseña"
                   errorText="Contraseña incorrecta."
                 />

                 <Field name="favoriteColor" component="select">
                    <option></option>
                    <option value="ff0000">Red</option>
                    <option value="00ff00">Green</option>
                    <option value="0000ff">Blue</option>
                  </Field>
                 <Button id="button-login" color="success" type="submit" disabled={false} spinner={false}>
                  Iniciar Sesión
                </Button>
                </div>
           </Form>
       </Page>
    )
  }
}

FormDemo = reduxForm({
  form: 'simple' // a unique identifier for this form
})(FormDemo)

export default FormDemo;
//https://redux-form.com/8.1.0/examples/simple/
