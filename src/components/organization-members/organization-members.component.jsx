import React, { useCallback } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import { setOrganizationMembers } from "../../redux/organization/organization.actions";
import { getOrganizationMembers } from "../../redux/organization/organization.selectors";
import { performRequest } from "../../utils/rest-util";

import ListItem from "../list-view/list-item/list-item.component";
import ListView from "../list-view/list-view.component";

const OrganizationMembers = ({ organizationMembers, setOrganizationMembers, ...props }) => {

    const handlePageClick = async event => {
        let { id } = props.match.params;

        const membersResponse = await performRequest(`/api/organizations/${id}/members?page=${event.selected}&size=4`, 'get', null);
        setOrganizationMembers(membersResponse ? membersResponse.payload : null);
    };

    return (
        <ListView pageCount={organizationMembers.totalPages} handlePageChanged={handlePageClick}>
            {organizationMembers.content.map(organizationMember =>
                <ListItem cover={<img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="image" className="profile-photo-lg" />}>
                    <h5>{organizationMember.user.firstName + " " + organizationMember.user.lastName}</h5>
                    <p>{organizationMember.role.id === "1" ? "ADMIN" : "ČLAN"}</p>
                </ListItem>
            )}
        </ListView>
    );
}

const mapStateToProps = createStructuredSelector({
    organizationMembers: getOrganizationMembers
});

const mapDispatchToProps = dispatch => ({
    setOrganizationMembers: organizationMembers => dispatch(setOrganizationMembers(organizationMembers)),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OrganizationMembers));