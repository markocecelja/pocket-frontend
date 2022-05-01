import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from 'reselect';
import Cookies from 'universal-cookie';

import { selectCurrentUser } from "../../redux/user/user.selectors";
import { Link } from "react-router-dom";
import { setCurrentUser } from '../../redux/user/user.actions';

import './header.styles.scss';

function logOut(setCurrentUser) {
    setCurrentUser(null);
    const cookies = new Cookies();
    cookies.remove('jwt');
}

const Header = ({ currentUser, setCurrentUser }) => (
    <div className="header">
        <nav className="navbar navbar-expand-md">
            <button className="navbar-toggler navbar-dark" type="button" data-toggle="collapse" data-target="#main-navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="main-navigation">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link className="nav-link" to="/organizations">ORGANIZACIJE</Link>
                    </li>
                    {
                        currentUser && <li className="nav-item">
                            <Link className="nav-link" onClick={() => logOut(setCurrentUser)} to="/signIn">ODJAVI SE</Link>
                        </li>
                    }
                </ul>
            </div>
        </nav>
    </div>
)

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser
});

const mapDispatchToProps = dispatch => ({
    setCurrentUser: user => dispatch(setCurrentUser(user))
})

export default connect(mapStateToProps, mapDispatchToProps)(Header);