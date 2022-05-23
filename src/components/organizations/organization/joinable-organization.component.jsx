import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from 'reselect';
import { withRouter } from "react-router-dom";

import FormInput from "../../form-input/form-input.component";

import { setOrganization } from "../../../redux/organization/organization.actions";
import { getOrganization } from "../../../redux/organization/organization.selectors";

import './organization.styles.scss';
import { performRequest } from "../../../utils/rest-util";

import { ReactComponent as OrganizationIcon } from "../../../assets/organization.svg"

class JoinableOrganization extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            code: ''
        }
    }

    handleChange = event => {
        const { value, name } = event.target;

        this.setState({ [name]: value })
    }

    handleSubmit = async event => {

        event.preventDefault();

        const { code } = this.state;
        const { setOrganization, organization } = this.props;

        const body = {
            value: code
        }

        const response = await performRequest(`/api/organizations/join`, 'post', body);
        setOrganization(response ? response.payload : organization);
    }

    async componentDidMount() {
        const { setOrganization } = this.props;

        let { id } = this.props.match.params;

        const organizationResponse = await performRequest(`/api/organizations/${id}`, 'get', null);
        const organization = organizationResponse ? organizationResponse.payload : null;
        setOrganization(organization);
    }

    render() {

        const { organization } = this.props;

        return (
            <>
                {
                    organization &&
                    <div className="organization">
                        <div className="modal fade" id="joinOrganization" tabIndex="-1" aria-labelledby="joinOrganizationLabel" aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="joinOrganizationLabel">Pridružite se organizaciji</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <form onSubmit={this.handleSubmit}>
                                        <div className="modal-body">
                                            <FormInput name="code" type="text" value={this.state.code} handleChange={this.handleChange} required label="Kod za pridruživanje" />
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Zatvori</button>
                                            <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Pridruži se</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <OrganizationIcon />
                            <h1>{organization && organization.name}</h1>
                            <p>{organization && organization.description}</p>
                            < button type="button" data-bs-toggle="modal" data-bs-target="#joinOrganization">
                                Pridruži se
                            </button>
                        </div>
                    </div>
                }
            </>
        );
    }
}

const mapStateToProps = createStructuredSelector({
    organization: getOrganization
});

const mapDispatchToProps = dispatch => ({
    setOrganization: organization => dispatch(setOrganization(organization)),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(JoinableOrganization));