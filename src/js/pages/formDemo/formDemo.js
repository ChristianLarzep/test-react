import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Form, change, reset } from 'redux-form';

import Header from './components';
import { Page, Helmet, Title, TextField, Button } from '../../components';


import validator from '../../configurations/validator';

import './style.css';

@reduxForm({ form: 'voiceForm', validate: validator })
class FormDemo extends Component{

  static propTypes = {
      handleSubmit: PropTypes.func,
      loading: PropTypes.bool
    };

    state = {
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
      //TODO
      //upgrade();
    } else {
      var speechRecognition = window.webkitSpeechRecognition;
      var speechSyn = window.speechSynthesis;
      const { questions } = this.state;

      this.state.recognition = new speechRecognition();
      this.state.recognition.continuous = false;
      this.state.recognition.interimResults = true;

      this.setState({ numQuest: questions.length })

      this.state.recognition.onstart = () => {
        var utterance = new SpeechSynthesisUtterance();
        utterance.text = questions[this.state.counterQuest];
        utterance.lang = 'en-US';
        utterance.rate = 1.2;
        speechSyn.speak(utterance);

        this.setState({ counterQuest: this.state.counterQuest + 1 });
      };

      this.state.recognition.onend = () => {
        const { counterQuest, numQuest} = this.state;
        if(counterQuest < numQuest){
             setTimeout(function(){ this.state.recognition.start(); }.bind(this), 2000);
              this.setState({
                final_transcript:'',
                recognizing: false,
            })
        }
      };

      this.state.recognition.onresult = event => {
        var final_trans = '';
        const { fields } = this.state;
        for (var i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
             final_trans += event.results[i][0].transcript;
          }
        }

        this.setState({ final_transcript: this.capitalize(final_trans) })
        this.props.dispatch(change('voiceForm', fields[this.state.counterQuest - 1] ,this.state.final_transcript ));
      };
    }
   }

  getInputs = () => {
      var elements = document.getElementsByClassName("input");
      for(var i=0; i<elements.length; i++) {
          this.state.questions[i] = elements[i].childNodes[0].alt;
          this.state.fields[i] = elements[i].childNodes[0].name;
      }
  }

  capitalize = s => {
     var first_char = /\S/;
     return s.replace(first_char, function(m) { return m.toUpperCase(); });
  }

  mySubmit = data => {
    this.props.dispatch(reset('voiceForm'));
    console.log(data);
  };

   onStart = () =>  {
      const { recognizing } = this.state;
      if (recognizing) {
        this.state.recognition.stop();
        return;
      }

      this.setState({
        recognizing: true,
        final_transcript: '',
        counterQuest: 0
      })

      this.state.recognition.lang = this.state.langs;
      this.state.recognition.start();
  }

  selectAccent = e => {
    this.setState({langs:e.target.value});
  }

  render(){
    const { handleSubmit, submitting, loading, invalid, fields: { textFields } } = this.props;

    return(
      <Page background="grey">

        <Helmet><title>BIOS</title></Helmet>
        <Header onStart={this.onStart} selectAccent={this.selectAccent} />

        <Title color="purple" tag="h3" >Voice Form</Title>

        <Form  name="voiceForm" onSubmit={handleSubmit(this.mySubmit)} className="form">
          <div className="row">

               {textFields.map(textfield => (
                 <TextField
                    key={textfield.id}
                    id={textfield.id}
                    name={textfield.name}
                    type={textfield.type}
                    label={textfield.label}
                    question={textfield.question}
                    errorText={textfield.errorText}
                    className={textfield.className}
                  />
               ))}

            </div>
            <div className="button-space">
              <Button id="button-login" color="success" type="submit" disabled={invalid || submitting} spinner={loading}>
                 Send
             </Button>
           </div>
        </Form>
      </Page>
    )
  }
}

export default FormDemo;
