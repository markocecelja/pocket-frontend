import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from 'reselect';
import { withRouter } from "react-router-dom";

import './homepage.styles.scss';
import { setOrganizations } from "../../redux/organization/organization.actions";
import { selectOrganizations } from "../../redux/organization/organization.selectors";
import { selectCurrentUser } from "../../redux/user/user.selectors";
import Card from "../card/card.component";
import Organizations from "../organizations/organizations.component";
import { performRequest } from "../../utils/rest-util";

import { ReactComponent as Avatar } from "../../assets/avatar.svg"

class HomePage extends React.Component {

    async componentDidMount() {
        const { setOrganizations, currentUser } = this.props;

        const organizationsResponse = await performRequest(`/api/organizations?memberId=${currentUser.id}&size=4`, 'get', null);
        setOrganizations(organizationsResponse ? organizationsResponse.payload : { content: [] });
    }

    handleOrganizationPageClick = async event => {

        const { setOrganizations, currentUser } = this.props;

        const organizationsResponse = await performRequest(`/api/organizations?memberId=${currentUser.id}&page=${event.selected}&size=4`, 'get', null);
        setOrganizations(organizationsResponse ? organizationsResponse.payload : { content: [] });
    }

    render() {

        const { currentUser } = this.props;

        return (
            <>
                {currentUser &&
                    <div className="organization">
                        <Card>
                            <Avatar />
                            <h1>{`${currentUser.firstName} ${currentUser.lastName}`}</h1>
                        </Card>
                        <div className="hoempage-tab">
                            <nav>
                                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                    <button className="nav-link active" id="nav-organizations-tab" data-bs-toggle="tab" data-bs-target="#nav-organizations" type="button" role="tab" aria-controls="nav-organizations" aria-selected="true">Moje organizacije</button>
                                </div>
                            </nav>
                            <div className="tab-content" id="nav-tabContent">
                                <div className="tab-pane fade show active" id="nav-organizations" role="tabpanel" aria-labelledby="organizations">
                                    <Organizations handlePageChanged={this.handleOrganizationPageClick}/>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </>
        );
    }
}

const mapStateToProps = createStructuredSelector({
    organizations: selectOrganizations,
    currentUser: selectCurrentUser
});

const mapDispatchToProps = dispatch => ({
    setOrganizations: organizations => dispatch(setOrganizations(organizations))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomePage));