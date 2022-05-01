import React from "react";

import Cookies from 'universal-cookie';
import { connect } from 'react-redux';
import axios from 'axios';

import FormInput from "../form-input/form-input.component";
import CustomButton from "../custom-button/custom-button.component";
import { Environments } from "../../enums/Environment";
import { setCurrentUser } from '../../redux/user/user.actions';

import './sign-in.styles.scss';

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

        const response =
            await axios.post(
                `${Environments.LOCAL}/api/authentication/login`,
                {
                    username: username,
                    password: password
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

        const jwt = response.data.payload.jwt;

        const cookies = new Cookies();
        cookies.set('jwt', jwt, { path: '/' });

        const getUserResponse =
            await axios.get(
                `${Environments.LOCAL}/api/users/current`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${jwt}`
                    }
                }
            );

        setCurrentUser(getUserResponse.data.payload);
    }

    render() {
        return (
            <div className='sign-in'>
                <h2>I already have an account</h2>
                <span>Sign in with your email and password</span>

                <form onSubmit={this.handleSubmit}>
                    <FormInput name="username" type="text" value={this.state.username} handleChange={this.handleChange} required label="Username" />
                    <FormInput name="password" type="password" value={this.state.password} handleChange={this.handleChange} required label="Password" />

                    <div className="buttons">
                        <CustomButton type="submit"> Sign in </CustomButton>
                    </div>
                </form>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    setCurrentUser: user => dispatch(setCurrentUser(user))
})

export default connect(null, mapDispatchToProps)(SignIn);