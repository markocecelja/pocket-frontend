import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from 'reselect';
import { withRouter } from "react-router-dom";

import FormInput from "../../form-input/form-input.component";

import { setOrganization, setOrganizationMembers } from "../../../redux/organization/organization.actions";
import { getOrganization } from "../../../redux/organization/organization.selectors";
import { setPosts } from "../../../redux/post/post.actions";

import './organization.styles.scss';
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import { performRequest } from "../../../utils/rest-util";
import Posts from "../../posts/posts.component"
import OrganizationMembers from "../../organization-members/organization-members.component"
import Card from "../../card/card.component";
import { ReactComponent as OrganizationIcon } from "../../../assets/organization.svg"
import { selectCurrentUser } from "../../../redux/user/user.selectors";
import { checkHasRole } from "../../../utils/role-util";
import { Roles } from "../../../enums/Role";
import { setCategories } from "../../../redux/category/category.actions";

class Organization extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: '',
            name: '',
            description: '',
            active: false
        }
    }

    handleChange = event => {
        const { value, name } = event.target;

        this.setState({ [name]: value })
    }

    handleSubmit = async event => {

        event.preventDefault();

        const { id, name, description, active } = this.state;
        const { setOrganization, setPosts } = this.props;

        const body = {
            id: id,
            name: name,
            description: description,
            active: active,
        }

        const response = await performRequest(`/api/organizations/${id}`, 'put', body);
        setOrganization(response ? response.payload : null);

        const posts = await performRequest(`/api/posts?organizationId=${id}&size=4`, 'get', null);
        setPosts(posts ? posts.payload : { content: [] });
    }

    async componentDidMount() {
        const { setOrganization, setOrganizationMembers, setPosts, setCategories } = this.props;

        let { id } = this.props.match.params;

        const organizationResponse = await performRequest(`/api/organizations/${id}`, 'get', null);
        const organization = organizationResponse ? organizationResponse.payload : null;
        setOrganization(organization);

        this.setState(organization)

        const membersResponse = await performRequest(`/api/organizations/${id}/members?size=4`, 'get', null);
        setOrganizationMembers(membersResponse ? membersResponse.payload : { content: [] });

        const posts = await performRequest(`/api/posts?organizationId=${id}&size=4`, 'get', null);
        setPosts(posts ? posts.payload : { content: [] });

        const categoriesResponse = await performRequest('/api/categories?active=true', 'get', null);
        setCategories(categoriesResponse ? categoriesResponse.payload : { content: [] });
    }

    verifyOrganization = async event => {

        event.preventDefault();

        const { setOrganization, organization } = this.props;

        const body = {
            id: organization.id,
            name: organization.name,
            description: organization.description,
            active: organization.active,
            verified: true
        }

        const response = await performRequest(`/api/organizations/${organization.id}`, 'put', body);
        setOrganization(response ? response.payload : null);
    }

    render() {

        const { organization, currentUser } = this.props;

        return (
            <>
                {organization &&
                    <div className="organization">
                        <div className="modal fade" id="updateOrganization" tabIndex="-1" aria-labelledby="updateOrganizationLabel" aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="updateOrganizationLabel">Uređivanje organizacije</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <form onSubmit={this.handleSubmit}>
                                        <div className="modal-body">
                                            <FormInput name="name" type="text" value={this.state.name} handleChange={this.handleChange} required label="Naziv" />
                                            <FormInput name="description" type="text" value={this.state.description} handleChange={this.handleChange} required label="Opis" />
                                            {checkHasRole(currentUser, Roles.SYSTEM_ADMIN) &&
                                                < BootstrapSwitchButton
                                                    checked={this.state.active}
                                                    onlabel='Aktivna'
                                                    offlabel='Neaktivna'
                                                    onChange={(checked) => {
                                                        this.setState({ active: checked })
                                                    }}
                                                    width={150}
                                                />
                                            }
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={this.resetState}>Zatvori</button>
                                            <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Spremi</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <Card>
                            <OrganizationIcon />
                            <h1>{organization && organization.name}</h1>
                            <div className="large-text">{organization && organization.description}</div>
                            {organization.currentUserMember && organization.currentUserMember.role.id == 1 &&
                                <div className="large-text">Kod za pridruživanje: {organization.organizationCode.value}</div>
                            }
                            < button type="button" data-bs-toggle="modal" data-bs-target="#updateOrganization">
                                Uredi
                            </button>
                            {checkHasRole(currentUser, Roles.SYSTEM_ADMIN) && !organization.verified &&
                                < button type="button" onClick={this.verifyOrganization}>
                                    Odobri
                                </button>
                            }
                        </Card>
                        <div className="organization-tab">
                            <nav>
                                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                    <button className="nav-link active" id="nav-posts-tab" data-bs-toggle="tab" data-bs-target="#nav-posts" type="button" role="tab" aria-controls="nav-posts" aria-selected="true">Objave</button>
                                    <button className="nav-link" id="nav-members-tab" data-bs-toggle="tab" data-bs-target="#nav-members" type="button" role="tab" aria-controls="nav-members" aria-selected="false">Članovi</button>
                                </div>
                            </nav>
                            <div className="tab-content" id="nav-tabContent">
                                <div className="tab-pane fade show active" id="nav-posts" role="tabpanel" aria-labelledby="nav-posts-tab">
                                    <Posts />
                                </div>
                                <div className="tab-pane fade" id="nav-members" role="tabpanel" aria-labelledby="nav-members-tab">
                                    <OrganizationMembers />
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
    currentUser: selectCurrentUser,
    organization: getOrganization
});

const mapDispatchToProps = dispatch => ({
    setOrganization: organization => dispatch(setOrganization(organization)),
    setOrganizationMembers: organizationMembers => dispatch(setOrganizationMembers(organizationMembers)),
    setPosts: posts => dispatch(setPosts(posts)),
    setCategories: categories => dispatch(setCategories(categories))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Organization));