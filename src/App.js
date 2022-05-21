import React from 'react';

import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { setCurrentUser } from './redux/user/user.actions';
import { selectCurrentUser } from './redux/user/user.selectors';

import SignIn from './components/sign-in/sign-in.component';
import HomePage from './components/homepage/homepage.component';
import Header from './components/header/header.component';

import './App.css';
import Organizations from './components/organizations/organizations.component';
import Organization from './components/organizations/organization.component';
import AdministrationPage from './components/administration/administration-page-component';
import { performRequest } from './utils/rest-util';
import { Toaster } from 'react-hot-toast';

class App extends React.Component {

  async componentDidMount() {
    const { setCurrentUser } = this.props;

    const response = await performRequest('/api/users/current', 'get', null);

    setCurrentUser(response ? response.payload : null);
  }

  render() {

    const { currentUser } = this.props;

    return (
      <div className="App">
        <div><Toaster /></div>
        {currentUser && <Header />}
        <Switch>
          <Route exact path='/' render={() => !currentUser ? (<Redirect to='/signIn'></Redirect>) : <HomePage></HomePage>}></Route>
          <Route exact path='/organizations' render={() => !currentUser ? (<Redirect to='/signIn'></Redirect>) : <Organizations></Organizations>}></Route>
          <Route exact path='/organizations/:id' render={() => !currentUser ? (<Redirect to='/signIn'></Redirect>) : <Organization></Organization>}></Route>
          <Route exact path='/administration' render={() => !currentUser || !currentUser.roles.some(role => role.id === "1") ? (<Redirect to='/'></Redirect>) : <AdministrationPage></AdministrationPage>}></Route>
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
