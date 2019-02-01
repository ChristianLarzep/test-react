import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

import FormDemo from './js/pages/formDemo';

var data = require('./js/configurations/formVoice/formVoiceFields.json');

import './App.css';

const reducers = {
  form: formReducer
}
const reducer = combineReducers(reducers)
const store = createStore(reducer)

class App extends Component {

  submit = value => {
   console.log(value);
  }

  render() {
    return (
      <div className="App">
         <Provider store={store}>
             <FormDemo onSubmit={this.submit} fields={data} />
        </Provider>
      </div>
    );
  }
}

export default App;
