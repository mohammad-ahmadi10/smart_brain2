import React from 'react';
import {BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';
import 'bootstrap';

import Main from './component/Main/Main.js';
import Register from './component/Register/Register.js';
import Login from './component/Login/Login.js';
import Forget from './component/Forget/Forget.js';
import PasswordReset from "./component/PasswordReset/PasswordReset.js";





function App() {

  const NotFoundPage = () =>{return(<p>404 Page not found</p>)}

  return(
    <Router>
      <Switch>
          <Route exact path="/main" render={({history}) => <Main history={history}/>}/>
          <Route exact path="/register" render= {({history}) => <Register history={history} />}/>
          <Route exact path="/" render= {({history}) => <Login history={history}/>}/>
          <Route exact path="/login" render= {({history}) => <Login history={history}/>}/>
          <Route exact path="/forgetPasword" render= {() => <Forget/> }/>
          <Route exact path={`/passwordReset/:token`} render={({history}) => <PasswordReset history={history}/>}/>     
          <Route render={() => <NotFoundPage/>}/>
      </Switch>
    </Router>
  ) 
}
export default App;
