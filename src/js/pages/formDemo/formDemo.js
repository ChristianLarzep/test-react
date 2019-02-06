import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Form, change, reset } from 'redux-form';

import { Page, Helmet, Title, TextField, Button } from '../../components';
import validator from '../../configurations/validator';

import Header from './components';

import './style.css';

@reduxForm({ form: 'voiceForm', validate: validator })
class FormDemo extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    fields: PropTypes.shape({}),
    handleSubmit: PropTypes.func,
    loading: PropTypes.bool,
    submitting: PropTypes.bool,
  };

    state = {
      finalTranscript: '',
      recognizing: false,
      recognition: {},
      numQuest: 0,
      counterQuest: 0,
      questions: [],
      fields: [],
      langs: 'Australia',
    }

    componentDidMount() {
      this.getInputs();
      if (!('webkitSpeechRecognition' in window)) {
      // TODO
      // upgrade();
      } else {
        const SpeechRecognition = window.webkitSpeechRecognition;
        const speechSyn = window.speechSynthesis;
        const { questions } = this.state;

        this.state.recognition = new SpeechRecognition();

        const { recognition } = this.state;

        recognition.continuous = false;
        recognition.interimResults = true;

        this.setState({ numQuest: questions.length });

        recognition.onstart = () => {
          const utterance = new SpeechSynthesisUtterance();
          utterance.text = questions[this.getCounterQuest()];
          utterance.lang = 'en-US';
          utterance.rate = 1.2;
          speechSyn.speak(utterance);

          this.setState(prevState => {
            return {
              counterQuest: prevState.counterQuest + 1,
            };
          });
        };

        recognition.onend = () => {
          const { counterQuest, numQuest } = this.state;
          if (counterQuest < numQuest) {
            setTimeout(() => { recognition.start(); }, 2000);
            this.setState({
              finalTranscript: '',
              recognizing: false,
            });
          }
        };

        recognition.onresult = event => {
          let finalTrans = '';
          const { fields } = this.state;
          const { dispatch } = this.props;
          for (let i = event.resultIndex; i < event.results.length; i += 1) {
            if (event.results[i].isFinal) {
              finalTrans += event.results[i][0].transcript;
            }
          }

          this.setState({ finalTranscript: this.capitalize(finalTrans) });
          const { finalTranscript } = this.state;
          dispatch(change('voiceForm', fields[this.getCounterQuest() - 1], finalTranscript));
        };
      }
    }

  getCounterQuest = () => {
    const { counterQuest } = this.state;
    return counterQuest;
  }

  getInputs = () => {
    const elements = document.getElementsByClassName('input');
    const { questions, fields } = this.state;
    for (let i = 0; i < elements.length; i += 1) {
      fields[i] = elements[i].childNodes[0].name;
      questions[i] = elements[i].childNodes[1].innerHTML;
    }

    this.setState(prevState => {
      return {
        questions: [...prevState.questions, questions],
        fields: [...prevState.fields, fields],
      };
    });
  }

  capitalize = s => {
    const firstChar = /\S/;
    return s.replace(firstChar, m => m.toUpperCase());
  }

  mySubmit = data => {
    const { dispatch } = this.props;
    dispatch(reset('voiceForm'));
    console.log(data);
  };

   onStart = () => {
     const { recognizing, langs, recognition } = this.state;
     if (recognizing) {
       recognition.stop();
       return;
     }

     this.setState({
       recognizing: true,
       finalTranscript: '',
       counterQuest: 0,
     });

     recognition.lang = langs;
     recognition.start();
   }

  selectAccent = e => {
    this.setState({ langs: e.target.value });
  }

  render() {
    const { handleSubmit, submitting, loading, invalid, fields: { textFields } } = this.props;

    return (
      <Page background="grey">

        <Helmet><title>BIOS</title></Helmet>
        <Header onStart={this.onStart} selectAccent={this.selectAccent} />

        <Title color="purple" tag="h3" className="title">Voice Form</Title>

        <Form name="voiceForm" onSubmit={handleSubmit(this.mySubmit)} className="form">
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
                multiLine={textfield.multiLine ? textfield.multiLine : false}
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
    );
  }
}

export default FormDemo;
