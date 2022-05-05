import React from "react";
import { connect } from "react-redux";

import { ReactComponent as EditIcon } from "../../assets/edit.svg"
import FormInput from "../form-input/form-input.component";

import { setCategories } from "../../redux/category/category.actions";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import { performRequest } from "../../rest/rest-util";

class CategoryComponent extends React.Component {

    constructor(props) {
        super(props);

        const { category } = this.props;

        this.state = category;
    }

    handleChange = event => {
        const { value, name } = event.target;

        this.setState({ [name]: value })
    }

    resetState = () => {
        const { category } = this.props;
        this.setState(category)
    }

    handleSubmit = async event => {

        event.preventDefault();

        const { id, name, active } = this.state;
        const { setCategories } = this.props;

        const body = {
            id: id,
            name: name,
            active: active,
        }

        await performRequest(`/api/categories/${id}`, 'put', body);

        const response = await performRequest('/api/categories', 'get', null);

        setCategories(response.payload);
    }


    render() {

        const { category } = this.props;


        return (
            <tr key={'category-' + category.id}>
                <td>
                    <div>{category.name}</div>
                </td>
                <td>
                    <div>{category.active ? "DA" : "NE"}</div>
                </td>
                <td>
                    <div className="modal fade" id={"updateCategory-" + category.id} tabIndex="-1" aria-labelledby={"updateCategoryLabel-" + category.id} aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id={"updateCategoryLabel-" + category.id}>Uređivanje kategorije</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <form onSubmit={this.handleSubmit}>
                                    <div className="modal-body">
                                        <FormInput name="name" type="text" value={this.state.name} handleChange={this.handleChange} required label="Naziv" />
                                        <BootstrapSwitchButton
                                            checked={this.state.active}
                                            onlabel='Aktivna'
                                            offlabel='Neaktivna'
                                            onChange={(checked) => {
                                                this.setState({ active: checked })
                                            }}
                                            width={150}
                                        />
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" onClick={this.resetState} className="btn btn-secondary" data-bs-dismiss="modal">Zatvori</button>
                                        <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Spremi</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <EditIcon data-bs-toggle="modal" data-bs-target={"#updateCategory-" + category.id}></EditIcon>
                </td>
            </tr>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    setCategories: categories => dispatch(setCategories(categories))
})

export default connect(null, mapDispatchToProps)(CategoryComponent);