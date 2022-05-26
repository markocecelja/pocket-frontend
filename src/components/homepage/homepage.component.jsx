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

import { checkHasRole } from "../../utils/role-util";
import { Roles } from '../../enums/Role';

import { ReactComponent as Avatar } from "../../assets/avatar.svg"
import Chats from "../chat/chats.component";
import { setChats } from "../../redux/chat/chat.actions";

class HomePage extends React.Component {

    async componentDidMount() {
        const { setOrganizations, currentUser, setChats } = this.props;

        const organizationsResponse = await performRequest(`/api/organizations?memberId=${currentUser.id}&size=4`, 'get', null);
        setOrganizations(organizationsResponse ? organizationsResponse.payload : { content: [] });

        const chatsResponse = await performRequest(`/api/chats`, 'get', null);
        setChats(chatsResponse ? chatsResponse.payload : { content: [] });
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
                                    <button className="nav-link active" id="nav-chats-tab" data-bs-toggle="tab" data-bs-target="#nav-chats" type="button" role="tab" aria-controls="nav-chats" aria-selected="true">Moje razgovori</button>
                                    {currentUser && !checkHasRole(currentUser, Roles.STUDENT) &&
                                        <button className="nav-link" id="nav-organizations-tab" data-bs-toggle="tab" data-bs-target="#nav-organizations" type="button" role="tab" aria-controls="nav-organizations" aria-selected="false">Moje organizacije</button>
                                    }
                                </div>
                            </nav>
                            <div className="tab-content" id="nav-tabContent">
                                <div className="tab-pane fade show active" id="nav-chats" role="tabpanel" aria-labelledby="chats">
                                    <Chats handlePageChanged={this.handleOrganizationPageClick} />
                                </div>
                                {currentUser && !checkHasRole(currentUser, Roles.STUDENT) &&
                                    <div className="tab-pane fade" id="nav-organizations" role="tabpanel" aria-labelledby="organizations">
                                        <Organizations handlePageChanged={this.handleOrganizationPageClick} />
                                    </div>
                                }
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
    setOrganizations: organizations => dispatch(setOrganizations(organizations)),
    setChats: chats => dispatch(setChats(chats))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomePage));