import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from 'reselect';
import { withRouter } from "react-router-dom";

import FormInput from "../form-input/form-input.component";

import { setOrganization, setOrganizationMembers } from "../../redux/organization/organization.actions";
import { getOrganization } from "../../redux/organization/organization.selectors";

import './organization.styles.scss';
import Users from "../users/users.component";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import { performRequest } from "../../rest/rest-util";

class Organization extends React.Component {

    constructor(props) {
        super(props);

        const { organization } = this.props;

        this.state = {
            id: organization ? organization.id : '',
            name: organization ? organization.name : '',
            description: organization ? organization.description : '',
            active: organization ? organization.active : true
        }
    }

    handleChange = event => {
        const { value, name } = event.target;

        this.setState({ [name]: value })
    }

    handleSubmit = async event => {

        event.preventDefault();

        const { id, name, description, active } = this.state;
        const { setOrganization } = this.props;

        const body = {
            id: id,
            name: name,
            description: description,
            active: active,
        }

        const response = await performRequest(`/api/organizations/${id}`, 'put', body);

        setOrganization(response.payload);
    }

    async componentDidMount() {
        const { setOrganization, setOrganizationMembers } = this.props;

        let { id } = this.props.match.params;

        const response = await performRequest(`/api/organizations/${id}`, 'get', null);

        setOrganization(response.payload);
        this.setState(response.payload);

        const memberResponse = await performRequest(`/api/organizations/${id}/members`, 'get', null);

        setOrganizationMembers(memberResponse.payload);
    }

    render() {

        const { organization } = this.props;

        return (
            <div className="organization">
                <div className="modal fade" id="updateOrganization" tabIndex="-1" aria-labelledby="updateOrganizationLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="updateOrganizationLabel">Uređivanje organizacije</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <form onSubmit={this.handleSubmit}>
                                <div className="modal-body">
                                    <FormInput name="name" type="text" value={this.state.name} handleChange={this.handleChange} required label="Naziv" />
                                    <FormInput name="description" type="text" value={this.state.description} handleChange={this.handleChange} required label="Opis" />
                                    <BootstrapSwitchButton
                                        checked={this.state.active}
                                        onlabel='Aktivna'
                                        offlabel='Neaktivna'
                                        onChange={(checked) => {
                                            this.setState({ active: checked })
                                        }}
                                        width={150}
                                    />
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Zatvori</button>
                                    <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Spremi</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <img src="" alt="Slika" style={{ width: '100%' }} />
                    <h1>{organization && organization.name}</h1>
                    <p>{organization && organization.description}</p>
                    <p>
                        <button type="button" data-bs-toggle="modal" data-bs-target="#updateOrganization">
                            Uredi
                        </button>
                    </p>
                </div>
                <div className="organization-tab">
                    <nav>
                        <div className="nav nav-tabs" id="nav-tab" role="tablist">
                            <button className="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">Ponude</button>
                            <button className="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Članovi</button>
                        </div>
                    </nav>
                    <div className="tab-content" id="nav-tabContent">
                        <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">TO DO ponude</div>
                        <div className="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
                            <Users></Users>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = createStructuredSelector({
    organization: getOrganization
});

const mapDispatchToProps = dispatch => ({
    setOrganization: organization => dispatch(setOrganization(organization)),
    setOrganizationMembers: organizationMembers => dispatch(setOrganizationMembers(organizationMembers)),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Organization));