import React, { Component } from 'react';
import { Provider } from 'react-redux';

import { createStore, combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import FormDemo from '../formDemo/formDemo';
import './App.css';

const reducers = {
  form: formReducer
}
const reducer = combineReducers(reducers)
const store = createStore(reducer)

class App extends Component {

  submit = values => {
    console.log(values);
  }

  render() {
    return (
      <div className="App">
         <Provider store={store}>
             <FormDemo onSubmit={this.submit}/>
        </Provider>
      </div>
    );
  }
}

export default App;
