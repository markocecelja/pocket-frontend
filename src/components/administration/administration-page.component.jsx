import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from 'reselect';

import { setCategories } from "../../redux/category/category.actions";
import { selectCategories } from "../../redux/category/category.selectors";

import Category from "../category/category-component";
import CustomButton from "../custom-button/custom-button.component";
import FormInput from "../form-input/form-input.component";
import { performRequest } from "../../utils/rest-util";

import Organizations from "../organizations/organizations.component";

import './administration-page.styles.scss'
import { setOrganizations } from "../../redux/organization/organization.actions";

class AdministrationPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
        }
    }

    handleChange = event => {
        const { value, name } = event.target;

        this.setState({ [name]: value })
    }

    handleSubmit = async event => {

        event.preventDefault();

        const { name } = this.state;
        const { setCategories } = this.props;

        const body = {
            name: name
        }

        await performRequest('/api/categories', 'post', body);

        const response = await performRequest('/api/categories', 'get', null);

        setCategories(response ? response.payload : { content: [] });
        this.setState({ name: '' })
    }

    async componentDidMount() {
        const { setCategories, setOrganizations } = this.props;

        const response = await performRequest('/api/categories', 'get', null);
        setCategories(response ? response.payload : { content: [] });

        const organizationsResponse = await performRequest('/api/organizations?verified=false&size=4', 'get', null);
        setOrganizations(organizationsResponse ? organizationsResponse.payload : { content: [] });
    }

    handleOrganizationPageClick = async event => {

        const { setOrganizations } = this.props;

        const organizationsResponse = await performRequest(`/api/organizations?verified=false&page=${event.selected}&size=4`, 'get', null);
        setOrganizations(organizationsResponse ? organizationsResponse.payload : { content: [] });
    }

    render() {

        const { categories } = this.props;

        return (
            <div className="administration">
                <div className="modal fade" id="createCategory" tabIndex="-1" aria-labelledby="createCategoryLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="createCategoryLabel">Nova kategorija</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <form onSubmit={this.handleSubmit}>
                                <div className="modal-body">
                                    <FormInput name="name" type="text" value={this.state.name} handleChange={this.handleChange} required label="Naziv" />
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Zatvori</button>
                                    <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Spremi</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <nav>
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                        <button className="nav-link active" id="nav-category-tab" data-bs-toggle="tab" data-bs-target="#nav-category" type="button" role="tab" aria-controls="nav-category" aria-selected="true">Kategorije</button>
                        <button className="nav-link" id="nav-organization-tab" data-bs-toggle="tab" data-bs-target="#nav-organization" type="button" role="tab" aria-controls="nav-organization" aria-selected="true">Odobravanje organizacije</button>
                    </div>
                </nav>
                <div className="tab-content" id="nav-tabContent">
                    <div className="tab-pane fade show active" id="nav-category" role="tabpanel" aria-labelledby="nav-category-tab">
                        <div className="container table-responsive">
                            <CustomButton className="new-category" data-bs-toggle="modal" data-bs-target="#createCategory"> Nova </CustomButton>
                            <table className="table table-striped table-hover">
                                <thead className="thead-dark">
                                    <tr>
                                        <th>Naziv</th>
                                        <th>Aktivna</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.content.map(category =>
                                        <Category category={category}></Category>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="tab-pane fade" id="nav-organization" role="tabpanel" aria-labelledby="nav-organization-tab">
                        <Organizations clickable={true} handlePageChanged={this.handleOrganizationPageClick}/>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = createStructuredSelector({
    categories: selectCategories
});

const mapDispatchToProps = dispatch => ({
    setCategories: categories => dispatch(setCategories(categories)),
    setOrganizations: organizations => dispatch(setOrganizations(organizations))
})

export default connect(mapStateToProps, mapDispatchToProps)(AdministrationPage);