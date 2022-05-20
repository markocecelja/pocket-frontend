import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from 'reselect';
import { withRouter } from "react-router-dom";

import { setOrganizations } from "../../redux/organization/organization.actions";
import { selectOrganizations } from "../../redux/organization/organization.selectors";

import './organizations.styles.scss';
import { performRequest } from "../../rest/rest-util";

class Organizations extends React.Component {

    async componentDidMount() {
        const { setOrganizations } = this.props;

        const response = await performRequest('/api/organizations', 'get', null);

        setOrganizations(response ? response.payload : { content: [] });
    }

    render() {

        const { organizations } = this.props;

        return (
            <div className="container table-responsive">
                <table className="table table-striped table-hover">
                    <thead className="thead-dark">
                        <tr>
                            <th>Naziv</th>
                            <th>Opis</th>
                            <th>Aktivna</th>
                        </tr>
                    </thead>
                    <tbody>
                        {organizations.content.map(organization =>
                            <tr key={'organization-' + organization.id} className="clickable" onClick={() => this.props.history.push(`/organizations/${organization.id}`)}>
                                <td>
                                    <div>{organization.name}</div>
                                </td>
                                <td>
                                    <div>{organization.description}</div>
                                </td>
                                <td>
                                    <div>{organization.active ? "DA" : "NE"}</div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    }
}

const mapStateToProps = createStructuredSelector({
    organizations: selectOrganizations
});

const mapDispatchToProps = dispatch => ({
    setOrganizations: organizations => dispatch(setOrganizations(organizations))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Organizations));