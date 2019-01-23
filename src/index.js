import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './js/pages/App/App';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <Router>
     <Switch>
       <Route path="/" component={App}/>
     </Switch>
  </Router>,
  document.getElementById('root'));
serviceWorker.unregister();
