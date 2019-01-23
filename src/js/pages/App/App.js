import React, { Component } from 'react';
import { Provider } from 'react-redux';

import { createStore, combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import FormDemo from '../formDemo/formDemo';
import './App.css';

import spoken from '../../../../node_modules/spoken/build/spoken.js';

import { speak } from 'babbler';
import { recogniser } from 'babbler';

const reducers = {
  // ... your other reducers here ...
  form: formReducer     // <---- Mounted at 'form'
}
const reducer = combineReducers(reducers)
const store = createStore(reducer)

class App extends Component {
 constructor(props){
   super(props);
 }

  submit = (values) => {
    // Do something with the form values
    console.log(values);
    spoken.say('What is your name?').then( speech => {
    spoken.listen().then( transcript =>
        console.log("Answer: " + transcript) )
} )

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
