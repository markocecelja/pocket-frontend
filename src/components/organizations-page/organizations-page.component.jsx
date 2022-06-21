import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { setOrganizations } from "../../redux/organization/organization.actions";

import { performRequest } from "../../utils/rest-util";
import CustomButton from "../custom-button/custom-button.component";
import FormInput from "../form-input/form-input.component";

import Organizations from "../organizations/organizations.component";
import { SearchBox } from "../search-box/search-box.component";

import './organizations-page.styles.scss'

class OrganizationsPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            description: ''
        }
    }

    handleChange = event => {
        const { value, name } = event.target;
        this.setState({ [name]: value })
    }

    resetState = () => {

        this.setState({
            name: '',
            description: ''
        })
    }

    handleSubmit = async event => {

        event.preventDefault();

        const { name, description } = this.state;
        const { setOrganizations } = this.props;

        const body = {
            name: name,
            description: description
        }

        await performRequest(`/api/organizations`, 'post', body);

        const organizationsResponse = await performRequest('/api/organizations?size=4', 'get', null);
        setOrganizations(organizationsResponse ? organizationsResponse.payload : { content: [] });
    }

    async componentDidMount() {
        const { setOrganizations } = this.props;

        const organizationsResponse = await performRequest('/api/organizations?size=4', 'get', null);
        setOrganizations(organizationsResponse ? organizationsResponse.payload : { content: [] });
    }

    handleOrganizationPageClick = async event => {

        const { setOrganizations } = this.props;

        const organizationsResponse = await performRequest(`/api/organizations?page=${event.selected}&size=4`, 'get', null);
        setOrganizations(organizationsResponse ? organizationsResponse.payload : { content: [] });
    }

    handleSearch = async event => {

        console.log(event.target)
        const { setOrganizations } = this.props;
        const { value } = event.target;

        const organizationsResponse = await performRequest(`/api/organizations?name=${value}&size=4`, 'get', null);
        setOrganizations(organizationsResponse ? organizationsResponse.payload : { content: [] });
    }

    render() {

        return (
            <div className="organizations-container">
                <div className="modal fade" id="newOrganization" tabIndex="-1" aria-labelledby="newOrganizationLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="newOrganizationLabel">Nova organizacija</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <form onSubmit={this.handleSubmit}>
                                <div className="modal-body">
                                    <FormInput name="name" type="text" value={this.state.name} handleChange={this.handleChange} required label="Naziv" />
                                    <FormInput name="description" type="text" value={this.state.description} handleChange={this.handleChange} required label="Opis" />
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={this.resetState}>Zatvori</button>
                                    <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Spremi</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="controlls">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-8">
                                <div class="input-icons">
                                    <i class="fa fa-search icon" />
                                    <SearchBox placeholder={"Upišite naziv organizacije za pretragu"} handleChange={this.handleSearch} />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <CustomButton className="new-organization" data-bs-toggle="modal" data-bs-target="#newOrganization"> Nova </CustomButton>
                            </div>
                        </div>
                    </div>
                </div>
                <Organizations clickable={true} handlePageChanged={this.handleOrganizationPageClick} />
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    setOrganizations: organizations => dispatch(setOrganizations(organizations))
})

export default withRouter(connect(null, mapDispatchToProps)(OrganizationsPage));