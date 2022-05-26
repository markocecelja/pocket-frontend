import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { setOrganizations } from "../../redux/organization/organization.actions";

import { performRequest } from "../../utils/rest-util";

import Organizations from "../organizations/organizations.component";

import './organizations-page.styles.scss'

class OrganizationsPage extends React.Component {

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

    render() {

        return (
            <div className="organizations-container">
                <Organizations handlePageChanged={this.handleOrganizationPageClick} />
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    setOrganizations: organizations => dispatch(setOrganizations(organizations))
})

export default withRouter(connect(null, mapDispatchToProps)(OrganizationsPage));