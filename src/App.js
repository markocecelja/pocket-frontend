import React from 'react';

import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { setCurrentUser } from './redux/user/user.actions';
import { selectCurrentUser } from './redux/user/user.selectors';

import SignIn from './components/authentication/sign-in.component';
import HomePage from './components/homepage/homepage.component';
import Header from './components/header/header.component';

import './App.css';
import AdministrationPage from './components/administration/administration-page.component';
import { performRequest } from './utils/rest-util';
import { Toaster } from 'react-hot-toast';
import OrganizationPage from './components/organization-page/organization-page.component';
import { checkHasRole } from './utils/role-util';
import { Roles } from './enums/Role';
import OrganizationsPage from './components/organizations-page/organizations-page.component';
import PostPage from './components/post-page/post-page.component';
import ChatPage from './components/chat-page/chat-page.component';
import Registration from './components/authentication/registration.component';

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
          <Route exact path='/signIn' render={() => currentUser ? (<Redirect to='/'></Redirect>) : <SignIn />} />
          <Route exact path='/registration' render={() => currentUser ? (<Redirect to='/'></Redirect>) : <Registration />} />
          {currentUser &&
            <>
              <Route exact path='/' component={HomePage} />
              <Route exact path='/organizations' component={OrganizationsPage} />
              <Route exact path='/organizations/:id' component={OrganizationPage} />
              <Route exact path='/posts/:id' component={PostPage} />
              <Route exact path='/chats/:id' component={ChatPage} />
              <Route exact path='/administration' render={() => !checkHasRole(currentUser, Roles.SYSTEM_ADMIN) ? (<Redirect to='/'></Redirect>) : <AdministrationPage />} />
            </>
          }
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
