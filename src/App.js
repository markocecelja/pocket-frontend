import React from 'react';

import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Cookies from 'universal-cookie';
import axios from 'axios';

import { setCurrentUser } from './redux/user/user.actions';
import { selectCurrentUser } from './redux/user/user.selectors';
import { Environments } from './enums/Environment';

import SignIn from './components/sign-in/sign-in.component';
import HomePage from './components/homepage/homepage.component';
import Header from './components/header/header.component';

import './App.css';
import Organizations from './components/organizations/organizations.component';
import Organization from './components/organizations/organization.component';

class App extends React.Component {

  async componentDidMount() {
    const { setCurrentUser } = this.props;

    const cookies = new Cookies();
    const jwt = cookies.get("jwt");

    if (jwt) {
      const response =
        await axios.get(
          `${Environments.LOCAL}/api/users/current`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${jwt}`
            }
          }
        );

      setCurrentUser(response.data.payload);
    } else {
      setCurrentUser(null);
    }
  }

  render() {

    const { currentUser } = this.props;

    return (
      <div className="App">
        {currentUser && <Header />}
        <Switch>
          <Route exact path='/' render={() => !currentUser ? (<Redirect to='/signIn'></Redirect>) : <HomePage></HomePage>}></Route>
          <Route exact path='/organizations' render={() => !currentUser ? (<Redirect to='/signIn'></Redirect>) : <Organizations></Organizations>}></Route>
          <Route exact path='/organizations/:id' render={() => !currentUser ? (<Redirect to='/signIn'></Redirect>) : <Organization></Organization>}></Route>
          <Route exact path='/signIn' render={() => currentUser ? (<Redirect to='/'></Redirect>) : <SignIn></SignIn>}></Route>
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser
});

const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
