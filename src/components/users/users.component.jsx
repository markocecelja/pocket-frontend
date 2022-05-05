import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from 'reselect';
import { getOrganizationMembers } from "../../redux/organization/organization.selectors";
import User from "./user/user.component";

import './users.styles.scss';

const Users = ({ organizationMembers }) => {

    return (

        <div className="container">
            <div className="row">
                <div className="col-md-8">
                    <div className="people">
                        {organizationMembers.content.map(organizationMember =>
                            <User organizationMember={organizationMember}></User>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = createStructuredSelector({
    organizationMembers: getOrganizationMembers
});

export default connect(mapStateToProps)(Users);