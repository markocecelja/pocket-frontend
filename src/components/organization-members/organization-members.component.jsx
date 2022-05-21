import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { getOrganizationMembers } from "../../redux/organization/organization.selectors";

import ListItem from "../list-view/list-item/list-item.component";
import ListView from "../list-view/list-view.component";

const OrganizationMembers = ({ organizationMembers }) => {
    return (
        <ListView>
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

export default connect(mapStateToProps)(OrganizationMembers);