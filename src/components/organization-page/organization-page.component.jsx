import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from 'reselect';

import Organization from "../organizations/organization/organization.component";
import JoinableOrganization from "../organizations/organization/joinable-organization.component";
import { getOrganization } from "../../redux/organization/organization.selectors";

const OrganizationPage = ({ organization }) => {

    return (
        <>
            {organization && organization.currentUserMember ? <Organization /> : <JoinableOrganization />}
        </>
    );
}

const mapStateToProps = createStructuredSelector({
    organization: getOrganization
});

export default connect(mapStateToProps)(OrganizationPage);