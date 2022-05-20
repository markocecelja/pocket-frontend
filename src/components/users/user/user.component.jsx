import React from "react";

import './user.styles.scss';

const User = ({organizationMember}) => (
    <div className="user">
        <div className="row">
            <div className="col-md-2 col-sm-2">
                <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="user" className="profile-photo-lg" />
            </div>
            <div className="col-md-7 col-sm-7">
                <h5>{organizationMember.user.firstName + " " + organizationMember.user.lastName}</h5>
                <p>{organizationMember.role.id === "1" ? "ADMIN" : "ČLAN"}</p>
            </div>
        </div>
    </div>
)

export default User;