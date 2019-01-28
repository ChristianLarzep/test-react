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
      handleSubmit: PropTypes.func,
      loading: PropTypes.bool
    };

    state = {
      create_email:false,
      final_transcript:'',
      recognizing: false,
      recognition:{},
      numQuest: 0,
      counterQuest: 0,
      questions: [],
      fields: [],
      langs: 'Australia'
    }

  componentDidMount() {
    this.getInputs();
    if (!('webkitSpeechRecognition' in window)) {
      //upgrade();
    } else {
      var speechRecognition = window.webkitSpeechRecognition;
      var speechSyn = window.speechSynthesis;
      const { questions } = this.state;

      this.state.recognition = new speechRecognition();
      this.state.recognition.continuous = false; //The default value for continuous is false, meaning that when the user stops talking, speech recognition will end
      this.state.recognition.interimResults = true;
      this.setState({
        numQuest: this.state.questions.length
      })

      this.state.recognition.onstart = () => { //onstart event handler. For each new set of results, it calls the onresult event handler.
        var u = new SpeechSynthesisUtterance();
        u.text = questions[this.state.counterQuest];
        u.lang = 'en-US';
        u.rate = 1.2;
        speechSyn.speak(u);
        this.setState({
          counterQuest: this.state.counterQuest + 1,
        });
      };

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

        this.setState({ final_transcript: this.capitalize(final_trans) })
        this.props.dispatch(change('myForm', fields[this.state.counterQuest - 1] ,this.state.final_transcript ));
      }.bind(this);
    }
   }

  getInputs = () => {
      var elements = document.getElementsByClassName("input");
      for(var i=0; i<elements.length; i++) {
          this.state.questions[i] = elements[i].childNodes[0].alt;
          this.state.fields[i] = elements[i].childNodes[0].name;
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
    if (recognizing) {
      this.state.recognition.stop();
      return;
    }

    this.setState({
      final_transcript: ''
    })

    this.state.recognition.lang = this.state.langs;
    this.state.recognition.start(); // call to onstart event handler
  }

  handleChange = e => {
    this.setState({langs:e.target.value});
  }

  render(){
    const { handleSubmit, pristine, reset, submitting, loading  } = this.props;
    return(
       <Page id="login-page" className="login-page" onSendAccent= { (e) => this.handleChange(e)} onStart= {this.startToTalk} >
           <Helmet>
               <title>Bienvenido</title>
           </Helmet>

           <Title color="purple" tag="h3" >Voice Form</Title>
           <Form  name="myForm" onSubmit={handleSubmit}>
              <div className="row">
               <TextField
                  id="name"
                  name="name"
                  type="text"
                  label="Name"
                  question="What is your name?"
                />
                <TextField
                   id="lastname"
                   name="lastname"
                   type="text"
                   label="Lastname"
                   question="What is your lastname?"
                 />
                 <TextField
                    id="age"
                    name="age"
                    type="text"
                    label="Age"
                    question="How old are you?"
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
