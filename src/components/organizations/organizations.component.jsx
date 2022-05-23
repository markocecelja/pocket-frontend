import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from 'reselect';
import { withRouter } from "react-router-dom";

import { setOrganizations } from "../../redux/organization/organization.actions";
import { setCategories } from "../../redux/category/category.actions";
import { selectOrganizations } from "../../redux/organization/organization.selectors";

import './organizations.styles.scss';

import ListItem from "../list-view/list-item/list-item.component";
import { ReactComponent as OrganizationIcon } from "../../assets/organization.svg"
import ListView from "../list-view/list-view.component";

const Organizations = ({ organizations, ...props }) => {

    return (
        <ListView pageCount={organizations.totalPages} {...props}>
            {organizations.content.map(organization =>
                <ListItem onClick={() => props.history.push(`/organizations/${organization.id}`)} clickable={true} cover={<OrganizationIcon />}>
                    <h5>{organization.name}</h5>
                    <div>{organization.description}</div>
                    <span className={`badge ${organization.active ? "bg-success" : "bg-danger"}`}>{organization.active ? "Aktivna" : "Neaktivna"}</span>
                </ListItem>
            )}
        </ListView>
    );
}

const mapStateToProps = createStructuredSelector({
    organizations: selectOrganizations
});

const mapDispatchToProps = dispatch => ({
    setOrganizations: organizations => dispatch(setOrganizations(organizations)),
    setCategories: categories => dispatch(setCategories(categories))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Organizations));