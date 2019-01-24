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

    state = {
      create_email:false,
      final_transcript:'',
      recognizing: false,
      ignore_onend: null,
      start_timestamp: null,
      recognition:null
    }

  constructor(props){
    super(props);

  }

  componentDidMount() {

    if (!('webkitSpeechRecognition' in window)) {
      //upgrade();
    } else {
      //start_button.style.display = 'inline-block';
      var speechRecognition = window.webkitSpeechRecognition;

      this.state.recognition = new speechRecognition();
      this.state.recognition.continuous = false; //The default value for continuous is false, meaning that when the user stops talking, speech recognition will end
      this.state.recognition.interimResults = true;

      this.state.recognition.onstart = function() { //onstart event handler. For each new set of results, it calls the onresult event handler.

        this.setState({recognizing: true})
        //showInfo('info_speak_now');
        //start_img.src = 'mic-animate.gif';
      }.bind(this);

      this.state.recognition.onerror = function(event) { //onerror event handler
        /*if (event.error == 'no-speech') {
          start_img.src = 'mic.gif';
          showInfo('info_no_speech');
          ignore_onend = true;
        }
        if (event.error == 'audio-capture') {
          start_img.src = 'mic.gif';
          showInfo('info_no_microphone');
          ignore_onend = true;
        }
        if (event.error == 'not-allowed') {
          if (event.timeStamp - start_timestamp < 100) {
            showInfo('info_blocked');
          } else {
            showInfo('info_denied');
          }
          ignore_onend = true;
        }*/
      };

      this.state.recognition.onend = function() { // onend event handler
        /*console.log("Done");
        recognizing = false;
        if (ignore_onend) {
          return;
        }
        start_img.src = 'mic.gif';
        if (!final_transcript) {
          showInfo('info_start');
          return;
        }
        showInfo('');
        if (window.getSelection) {
          window.getSelection().removeAllRanges();
          var range = document.createRange();
          range.selectNode(document.getElementById('final_span'));
          window.getSelection().addRange(range);
        }
        if (create_email) {
          create_email = false;
          createEmail();
        }*/
      };

      this.state.recognition.onresult = function(event) {  // onresult event handler
        var interim_transcript = '';
        var final_trans = '';
        for (var i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
             final_trans += event.results[i][0].transcript;

          } else {
            interim_transcript += event.results[i][0].transcript;
          }
        }
        this.state.final_transcript = this.capitalize(final_trans);
        //final_span.innerHTML = linebreak(final_transcript); // to convert these to HTML tags <br> or <p> and sets these strings as the innerHTML of their corresponding <span> elements
          //console.log(this.linebreak(this.state.final_transcript));
        //interim_span.innerHTML = linebreak(interim_transcript);// to convert these to HTML tags <br> or <p> and sets these strings as the innerHTML of their corresponding <span> elements
          console.log("Result: ",this.linebreak(interim_transcript));
          this.props.initialize({ name: this.state.final_transcript });
        //if (final_transcript || interim_transcript) {
        //  showButtons('inline-block');
        //}
      }.bind(this);
    }
       //this.props.initialize({ lastname: 'some value here' });

   }

   linebreak(s) {
     var two_line = /\n\n/g;
     var one_line = /\n/g;
     return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
   }

   capitalize(s) {
     var first_char = /\S/;
     return s.replace(first_char, function(m) { return m.toUpperCase(); });
   }

  mySubmit = data => {
    this.startToTalk();
  };

  startToTalk = () =>  {
    console.log("IN");
    const { recognizing } = this.state;
    if (this.state.recognizing) {
      this.state.recognition.stop();
      return;
    }
    this.state.final_transcript = '';
    this.state.recognition.lang = 'United States';
    this.state.recognition.start(); // call to onstart event handler
    this.state.ignore_onend = false;
    //final_span.innerHTML = '';
    //interim_span.innerHTML = '';
    //start_img.src = 'mic-slash.gif';
    //showInfo('info_allow');
    //showButtons('none');
    //start_timestamp = event.timeStamp;
  }

  render(){
    const { handleSubmit, pristine, reset, submitting, loading  } = this.props;
    return(
       <Page id="login-page" className="login-page">
           <Helmet>
               <title>Bienvenido</title>
           </Helmet>
           <Title color="purple" tag="h3" >Formulario</Title>
           <Form  name="myForm" onSubmit={handleSubmit(this.mySubmit)}>
              <div className="row">
               <TextField
                  id="name"
                  name="name"
                  type="text"
                  label="Name"
                  errorText="Ingresa tu nombre."
                />
                <TextField
                   id="lastname"
                   name="lastname"
                   type="text"
                   label="Lastname"
                   errorText="Ingresa tu apellido."
                 />
                 <Button id="button-login" color="success" type="submit" disabled={false} spinner={false}>
                    Enviar
                </Button>
                </div>
           </Form>
       </Page>
    )
  }
}

export default FormDemo = reduxForm({
  form: 'simple' // a unique identifier for this form
})(FormDemo)




//https://redux-form.com/8.1.0/examples/simple/
