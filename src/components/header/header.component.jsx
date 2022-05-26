import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from 'reselect';
import Cookies from 'universal-cookie';

import { selectCurrentUser } from "../../redux/user/user.selectors";
import { Link } from "react-router-dom";
import { setCurrentUser } from '../../redux/user/user.actions';

import './header.styles.scss';
import { checkHasRole } from "../../utils/role-util";
import { Roles } from '../../enums/Role';

function logOut(setCurrentUser) {
    setCurrentUser(null);
    const cookies = new Cookies();
    cookies.remove('jwt');
}

const Header = ({ currentUser, setCurrentUser }) => (
    <div className="header">
        <nav class="navbar navbar-expand-lg navbar-dark">
            <div class="container-fluid">
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">POČETNA</Link>
                        </li>
                        {
                            currentUser && !checkHasRole(currentUser, Roles.STUDENT) &&
                            <li className="nav-item">
                                <Link className="nav-link" to="/organizations">ORGANIZACIJE</Link>
                            </li>
                        }
                        {
                            currentUser && checkHasRole(currentUser, Roles.SYSTEM_ADMIN) &&
                            <li className="nav-item">
                                <Link className="nav-link" to="/administration">ADMINISTRACIJA</Link>
                            </li>
                        }
                        {
                            currentUser && <li className="nav-item">
                                <Link className="nav-link" onClick={() => logOut(setCurrentUser)} to="/signIn">ODJAVI SE</Link>
                            </li>
                        }
                    </ul>
                </div>
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