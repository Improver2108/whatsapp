import React from 'react';
import Login from './Login'
import Main from './Main';
import Home from './Home';
import Test from './Test'
import {Route,Switch} from 'react-router-dom';

function App() {
  return(
    <div>
      <Switch>
        <Route exact path='/' component={Home}></Route>
        <Route exact path='/login' component={Login}/>
        <Route exact path='/main' component={Main}/>
        <Route exact path='/test' component={Test}></Route>
      </Switch>
    </div>
  );
}

export default App;
