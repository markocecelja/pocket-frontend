import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from 'reselect';

import Organization from "../organizations/organization/organization.component";
import JoinableOrganization from "../organizations/organization/joinable-organization.component";
import { getOrganization } from "../../redux/organization/organization.selectors";
import { selectCurrentUser } from "../../redux/user/user.selectors";
import { checkHasRole } from "../../utils/role-util";
import { Roles } from "../../enums/Role";

const OrganizationPage = ({ organization, currentUser }) => {

    return (
        <>
            {organization && (organization.currentUserMember || checkHasRole(currentUser, Roles.SYSTEM_ADMIN)) ? <Organization /> : <JoinableOrganization />}
        </>
    );
}

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser,
    organization: getOrganization
});

export default connect(mapStateToProps)(OrganizationPage);