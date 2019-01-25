import React, { Component } from 'react';
//import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {  reduxForm, Form, change} from 'redux-form';

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
      recognition:null,
      numQuest: 2,
      counterQuest: 0,
      questions: ["What is your name?", "What is your lastname?"],
      fields: ["name", "lastname"],
      langs: 'Australia'
    }

  componentDidMount() {

    if (!('webkitSpeechRecognition' in window)) {
      //upgrade();
    } else {
      //start_button.style.display = 'inline-block';
      var speechRecognition = window.webkitSpeechRecognition;
      var speechSyn = window.speechSynthesis;
      const { questions } = this.state;

      this.state.recognition = new speechRecognition();
      this.state.recognition.continuous = false; //The default value for continuous is false, meaning that when the user stops talking, speech recognition will end
      this.state.recognition.interimResults = true;

      this.state.recognition.onstart = function() { //onstart event handler. For each new set of results, it calls the onresult event handler.
        var u = new SpeechSynthesisUtterance();
        u.text = questions[this.state.counterQuest];
        u.lang = 'en-US';
        u.rate = 1.2;
        speechSyn.speak(u);
        this.setState({
          counterQuest: this.state.counterQuest + 1,
        })
        //showInfo('info_speak_now');
        //start_img.src = 'mic-animate.gif';
      }.bind(this);

      this.state.recognition.onerror = function(event) { //onerror event handler
      };

      this.state.recognition.onend = function() { // onend event handler
        const { counterQuest, numQuest} = this.state;
        if(counterQuest < numQuest){
             setTimeout(function(){ this.startToTalk(); }.bind(this), 2000);
              this.setState({
                final_transcript:'',
                recognizing: false,
              })

        }
      }.bind(this);

      this.state.recognition.onresult = function(event) {  // onresult event handler
        var interim_transcript = '';
        var final_trans = '';
        const { fields } = this.state;
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
        //this.props.initialize({  : this.state.final_transcript });
        
        this.props.dispatch(change('myForm', fields[this.state.counterQuest - 1] ,this.state.final_transcript ));
        //if (final_transcript || interim_transcript) {
        //  showButtons('inline-block');
        //}
      }.bind(this);
    }
   }


   linebreak = s => {
     var two_line = /\n\n/g;
     var one_line = /\n/g;
     return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
   }

   capitalize = s => {
     var first_char = /\S/;
     return s.replace(first_char, function(m) { return m.toUpperCase(); });
   }

  mySubmit = data => {
    console.log(data);
  };

  startToTalk = () =>  {
    const { recognizing } = this.state;
    if (this.state.recognizing) {
      this.state.recognition.stop();
      return;
    }
    this.state.final_transcript = '';
    this.state.recognition.lang = this.state.langs;
    this.state.recognition.start(); // call to onstart event handler
    this.state.ignore_onend = false;
  }

  handleChange = (e) => {
    console.log(e.target.value);
    this.setState({langs:e.target.value});
  }

 //https://w3c.github.io/speech-api/speechapi.html#speechsynthesisvoicelist
  render(){
    const { handleSubmit, pristine, reset, submitting, loading  } = this.props;
    return(
       <Page id="login-page" className="login-page" onSendAccent= { (e) => this.handleChange(e)} onStart= {this.startToTalk} >
           <Helmet>
               <title>Bienvenido</title>
           </Helmet>

           <Title color="purple" tag="h3" >Voice Form</Title>
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
                    Send
                </Button>
                </div>
           </Form>
       </Page>
    )
  }
}

export default FormDemo = reduxForm({
  form: 'myForm' // a unique identifier for this form
})(FormDemo)
