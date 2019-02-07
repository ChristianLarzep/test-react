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
    title: PropTypes.string,
  };

    state = {
      recognizing: false,
      recognition: {},
      numQuest: 0,
      counterQuest: 0,
      questions: [],
      fields: [],
      langs: 'Australia',
      fieldsData: this.props.fields,
      confirmQuestion: [undefined],
      confirming: false,
      confirmResponse: '',
    }

    componentDidMount() {
      this.getInputs();
      if (!('webkitSpeechRecognition' in window)) {
      // TODO
      // upgrade();
      } else {
        const SpeechRecognition = window.webkitSpeechRecognition;
        const speechSyn = window.speechSynthesis;
        const { questions, confirmQuestion } = this.state;

        this.state.recognition = new SpeechRecognition();

        const { recognition } = this.state;

        recognition.continuous = false;
        recognition.interimResults = true;

        this.setState({ numQuest: questions.length });

        recognition.onstart = () => {
          const { confirming } = this.state;
          const utterance = new SpeechSynthesisUtterance();
          utterance.lang = 'en-US';
          utterance.rate = 1.2;

          if (confirming) {
            utterance.text = confirmQuestion[this.getCounterQuest()];
          } else {
            utterance.text = questions[this.getCounterQuest()];

            this.setState(prevState => {
              return {
                counterQuest: prevState.counterQuest + 1,
                confirmResponse: '',
              };
            });
          }
          speechSyn.speak(utterance);
        };

        recognition.onend = () => {
          const { counterQuest, numQuest, confirmResponse } = this.state;
          this.repeatQuestion(confirmResponse);
          const confirm = this.willConfirm();
          if (counterQuest < numQuest || confirm) {
            setTimeout(() => { recognition.start(); }, 2000);
            this.setState({ recognizing: false, confirming: confirm });
          }
        };

        recognition.onresult = event => {
          let transcription = '';
          const { fields, confirming } = this.state;
          const { dispatch } = this.props;
          for (let i = event.resultIndex; i < event.results.length; i += 1) {
            if (event.results[i].isFinal) {
              transcription += event.results[i][0].transcript;
            } else {
              transcription += event.results[i][0].transcript;
            }
          }

          if (confirming) {
            this.setState({ confirmResponse: transcription });
          } else {
            dispatch(change('voiceForm', fields[this.getCounterQuest() - 1], this.capitalize(transcription)));
          }
        };
      }
    }

  repeatQuestion = response => {
    const words = ['yes', 'jazz', 'just'];
    const { confirming, confirmQuestion } = this.state;
    if (words.includes(response) && confirming) {
      this.setState(prevState => {
        return {
          counterQuest: prevState.counterQuest - 1,
        };
      });
    } else if (words.includes(response) === false && confirming) {
      confirmQuestion[this.getCounterQuest()] = undefined;
    }
  }

  willConfirm = () => {
    const { confirmQuestion } = this.state;
    if (typeof confirmQuestion[this.getCounterQuest()] === 'undefined') {
      return false;
    }

    return true;
  }

  getCounterQuest = () => {
    const { counterQuest } = this.state;
    return counterQuest;
  }

  getInputs = () => {
    const { questions, fields, confirmQuestion, fieldsData: { textFields } } = this.state;

    for (let i = 0; i < textFields.length; i += 1) {
      fields[i] = textFields[i].name;
      questions[i] = textFields[i].question;
      confirmQuestion[i + 1] = textFields[i].confirmQuestion;
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
       counterQuest: 0,
     });

     recognition.lang = langs;
     recognition.start();
   }

  selectAccent = e => {
    this.setState({ langs: e.target.value });
  }

  render() {
    const { handleSubmit, submitting, loading, invalid, title } = this.props;
    const { fieldsData: { textFields } } = this.state;

    return (
      <Page background="grey">

        <Helmet><title>BIOS</title></Helmet>
        <Header onStart={this.onStart} selectAccent={this.selectAccent} />

        <Title color="purple" tag="h3" className="title">{title}</Title>

        <Form name="voiceForm" onSubmit={handleSubmit(this.mySubmit)} className="form">
          <div className="row">

            {textFields.map(textfield => (
              <TextField
                key={textfield.id}
                id={textfield.id}
                name={textfield.name}
                type={textfield.type}
                label={textfield.label}
                errorText={textfield.errorText}
                className={textfield.className}
                multiLine={!!textfield.multiLine}
              />
            ))}

          </div>
          <div className="button-space">
            <Button id="btn-submit" color="success" type="submit" disabled={invalid || submitting} spinner={loading}>
                 Send
            </Button>
          </div>
        </Form>
      </Page>
    );
  }
}

export default FormDemo;
