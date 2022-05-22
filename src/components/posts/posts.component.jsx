import React from "react";

import ListItem from "../list-view/list-item/list-item.component";
import SelectSearch, { fuzzySearch } from 'react-select-search';
import { ReactComponent as EventIcon } from "../../assets/event.svg"
import ListView from "../list-view/list-view.component";
import { selectPosts } from "../../redux/post/post.selectors";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import CustomButton from "../custom-button/custom-button.component";

import './posts.styles.scss'
import FormInput from "../form-input/form-input.component";
import { selectCategories } from "../../redux/category/category.selectors";
import { getOrganization } from "../../redux/organization/organization.selectors";
import { setPosts } from "../../redux/post/post.actions";
import { performRequest } from "../../utils/rest-util";
import { withRouter } from "react-router-dom";

class Posts extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            description: '',
            organization: null,
            category: null
        }
    }

    handleChange = event => {
        const { value, name } = event.target;
        this.setState({ [name]: value })
    }

    handleSelectChange = categoryId => {
        this.setState({ ["category"]: { id: categoryId } })
    }

    resetState = () => {

        this.setState({
            title: '',
            description: '',
            category: null
        })
    }

    handleSubmit = async event => {

        event.preventDefault();

        let { id } = this.props.match.params;

        const { title, description, category } = this.state;
        const { organization } = this.props;
        const { setPosts } = this.props;

        const body = {
            title: title,
            description: description,
            category: category,
            organization: organization
        }

        await performRequest(`/api/posts`, 'post', body);

        const postResponse = await performRequest(`/api/posts?organizationId=${id}&size=4`, 'get', null);
        setPosts(postResponse ? postResponse.payload : null);
    }

    handlePageClick = async event => {

        const { setPosts } = this.props;

        let { id } = this.props.match.params;

        const postResponse = await performRequest(`/api/posts?organizationId=${id}&page=${event.selected}&size=4`, 'get', null);
        setPosts(postResponse ? postResponse.payload : null);
    }

    render() {

        const { posts, categories } = this.props;

        const options = categories.content.map(category => {
            return { name: category.name, value: category.id }
        });

        return (
            <div className="posts">
                <div className="modal fade" id="newPost" tabIndex="-1" aria-labelledby="newPostLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="newPostLabel">Nova objava</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <form onSubmit={this.handleSubmit}>
                                <div className="modal-body">
                                    <FormInput name="title" type="text" value={this.state.title} handleChange={this.handleChange} required label="Naziv" />
                                    <FormInput name="description" type="text" value={this.state.description} handleChange={this.handleChange} required label="Opis" />
                                    <SelectSearch required={true} onChange={this.handleSelectChange} value={this.state.category ? this.state.category.id : ""}
                                        options={options} filterOptions={fuzzySearch} search emptyMessage="Kategorija ne postoji"
                                        placeholder="Pretražite kategoriju" />
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={this.resetState}>Zatvori</button>
                                    <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Spremi</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <CustomButton className="new-post" data-bs-toggle="modal" data-bs-target="#newPost">Nova</CustomButton>
                <ListView pageCount={posts.totalPages} handlePageChanged={this.handlePageClick}>
                    {posts.content.map(post =>
                        <ListItem clickable={true} cover={<EventIcon />}>
                            <h5>{post.title}</h5>
                            <span className="badge bg-info text-dark">{post.category.name}</span>
                            <span className={`badge ${post.active ? "bg-success" : "bg-danger"}`}>{post.active ? "Aktivna" : "Neaktivna"}</span>
                        </ListItem>
                    )}
                </ListView>
            </div>
        );
    }
}

const mapStateToProps = createStructuredSelector({
    posts: selectPosts,
    categories: selectCategories,
    organization: getOrganization
});

const mapDispatchToProps = dispatch => ({
    setPosts: posts => dispatch(setPosts(posts))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Posts));