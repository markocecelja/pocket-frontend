import React from "react";

import Cookies from 'universal-cookie';
import { connect } from 'react-redux';

import FormInput from "../form-input/form-input.component";
import { setCurrentUser } from '../../redux/user/user.actions';

import './authentication.styles.scss';
import { performRequest } from "../../utils/rest-util";
import Card from "../card/card.component";
import { Link } from "react-router-dom";

class Registration extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            firstName: '',
            lastName: '',
            username: '',
            password: '',
            confirmationPassword: ''
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

        const response = await performRequest('/api/public/authentication/registration', 'post', this.state);

        if (response != null) {

            const body = {
                username: username,
                password: password
            }

            const loginResponse = await performRequest('/api/public/authentication/login', 'post', body);

            const jwt = loginResponse ? loginResponse.payload.jwt : null

            if (!jwt) {
                return;
            }

            const cookies = new Cookies();
            cookies.set('jwt', jwt, { path: '/' });

            const userResponse = await performRequest('/api/users/current', 'get', null);

            setCurrentUser(userResponse ? userResponse.payload : null);
        }
    }

    render() {
        return (
            <div className='authentication'>
                <Card>
                    <h2>Registracija</h2>
                    <span>Ispunite podatke za registraciju</span>

                    <form onSubmit={this.handleSubmit}>
                        <FormInput name="firstName" type="text" value={this.state.firstName} handleChange={this.handleChange} required label="Ime" />
                        <FormInput name="lastName" type="text" value={this.state.lastName} handleChange={this.handleChange} required label="Prezime" />
                        <FormInput name="username" type="text" value={this.state.username} handleChange={this.handleChange} required label="Korisničko ime" />
                        <FormInput name="password" type="password" value={this.state.password} handleChange={this.handleChange} required label="Lozinka" />
                        <FormInput name="confirmationPassword" type="password" value={this.state.confirmationPassword} handleChange={this.handleChange} required label="Ponovite lozinku" />
                        <button type="submit"> Registrirajte se </button>
                    </form>
                    <Link to={"/signIn"} className="authentication-link">Već imate korisnički račun? Prijavite se</Link>
                </Card>
            </div >
        )
    }
}

const mapDispatchToProps = dispatch => ({
    setCurrentUser: user => dispatch(setCurrentUser(user))
})

export default connect(null, mapDispatchToProps)(Registration);