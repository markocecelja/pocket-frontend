import React from "react";

import Cookies from 'universal-cookie';
import { connect } from 'react-redux';

import FormInput from "../form-input/form-input.component";
import { setCurrentUser } from '../../redux/user/user.actions';

import './authentication.styles.scss';
import { performRequest } from "../../utils/rest-util";
import Card from "../card/card.component";
import { Link } from "react-router-dom";

import { Roles } from "../../enums/Role";
import toast from "react-hot-toast";
import { checkHasRole } from "../../utils/role-util";

class SignIn extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: ''
        }
    }

    handleChange = event => {
        const { value, name } = event.target;

        this.setState({ [name]: value })
    }

    handleSubmit = async event => {

        event.preventDefault();

        const { username, password } = this.state;
        const { setCurrentUser } = this.props;

        const body = {
            username: username,
            password: password
        }

        const response = await performRequest('/api/public/authentication/login', 'post', body);

        const jwt = response ? response.payload.jwt : null

        if (!jwt) {
            return;
        }

        const cookies = new Cookies();
        cookies.set('jwt', jwt, { path: '/' });

        const userResponse = await performRequest('/api/users/current', 'get', null);

        const user = userResponse ? userResponse.payload : null;

        if (user && !checkHasRole(user, Roles.STUDENT)) {
            setCurrentUser(userResponse ? userResponse.payload : null);
        } else {
            cookies.remove('jwt');
            toast.error("Ova aplikacija namijenjena je pripadnicima organizacije!");
        }
    }

    render() {
        return (
            <div className='authentication'>
                <Card>
                    <h2>Prijava</h2>
                    <span>Upišite svoje korisničko ime i lozinku</span>

                    <form onSubmit={this.handleSubmit}>
                        <FormInput name="username" type="text" value={this.state.username} handleChange={this.handleChange} required label="Korisničko ime" />
                        <FormInput name="password" type="password" value={this.state.password} handleChange={this.handleChange} required label="Lozinka" />
                        <button type="submit"> Prijavi se </button>
                    </form>
                    <Link to={"/registration"} className="authentication-link">Nemate korisnički račun? Registrirajte se</Link>
                </Card>
            </div >
        )
    }
}

const mapDispatchToProps = dispatch => ({
    setCurrentUser: user => dispatch(setCurrentUser(user))
})

export default connect(null, mapDispatchToProps)(SignIn);