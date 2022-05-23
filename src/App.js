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
import AdministrationPage from './components/administration/administration-page.component';
import { performRequest } from './utils/rest-util';
import { Toaster } from 'react-hot-toast';
import OrganizationPage from './components/organization-page/organization-page.component';
import { checkHasRole } from './utils/role-util';
import { Roles } from './enums/Role';
import OrganizationsPage from './components/organizations-page/organizations-page.component';

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
          {currentUser &&
            <>
              <Route exact path='/' component={HomePage} />
              <Route exact path='/organizations' component={OrganizationsPage} />
              <Route exact path='/organizations/:id' component={OrganizationPage} />
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
