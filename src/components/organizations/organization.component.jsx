import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from 'reselect';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { Environments } from "../../enums/Environment";
import { withRouter } from "react-router-dom";

import { setOrganization } from "../../redux/organization/organization.actions";
import { getOrganization } from "../../redux/organization/organization.selectors";

import './organization.styles.scss';

class Organization extends React.Component {

    async componentDidMount() {
        const { setOrganization } = this.props;

        let { id } = this.props.match.params;

        const cookies = new Cookies();
        const jwt = cookies.get("jwt");

        if (jwt) {
            const response =
                await axios.get(
                    `${Environments.LOCAL}/api/organizations/${id}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${jwt}`
                        }
                    }
                );

            setOrganization(response.data.payload);
        }
    }

    render() {

        const { organization } = this.props;

        return (
            <div className="organization">
                <div className="card">
                    <img src="" alt="Slika" style={{ width: '100%' }} />
                    <h1>{organization && organization.name}</h1>
                    <p>{organization && organization.description}</p>
                    <div style={{ margin: "24px 0" }}>
                        <a href="#"><i className="fa fa-dribbble"></i></a>
                        <a href="#"><i className="fa fa-twitter"></i></a>
                        <a href="#"><i className="fa fa-linkedin"></i></a>
                        <a href="#"><i className="fa fa-facebook"></i></a>
                    </div>
                    <p><button>Ažuriraj</button></p>
                </div>
                <div className="organization-tab">
                    <nav>
                        <div className="nav nav-tabs" id="nav-tab" role="tablist">
                            <button className="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">Ponude</button>
                            <button className="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Članovi</button>
                        </div>
                    </nav>
                    <div className="tab-content" id="nav-tabContent">
                        <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">TO DO ponude</div>
                        <div className="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">TO DO članovi</div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = createStructuredSelector({
    organization: getOrganization
});

const mapDispatchToProps = dispatch => ({
    setOrganization: organization => dispatch(setOrganization(organization))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Organization));