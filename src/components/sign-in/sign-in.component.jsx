import React from "react";

import Cookies from 'universal-cookie';
import { connect } from 'react-redux';

import FormInput from "../form-input/form-input.component";
import CustomButton from "../custom-button/custom-button.component";
import { setCurrentUser } from '../../redux/user/user.actions';

import './sign-in.styles.scss';
import { performRequest } from "../../rest/rest-util";

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

        if(!jwt) {
            return;
        }

        const cookies = new Cookies();
        cookies.set('jwt', jwt, { path: '/' });

        const getUserResponse = await performRequest('/api/users/current', 'get', null);

        setCurrentUser(response ? getUserResponse.payload : null);
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