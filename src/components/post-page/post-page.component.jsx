import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from 'reselect';
import { withRouter } from "react-router-dom";

import Card from "../card/card.component";
import { performRequest } from "../../utils/rest-util";

import { ReactComponent as Event } from "../../assets/event.svg"
import { getPost } from "../../redux/post/post.selectors";
import { setPost } from "../../redux/post/post.actions";

import './post-page.styles.scss'
import SelectSearch, { fuzzySearch } from "react-select-search";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import FormInput from "../form-input/form-input.component";
import { selectCategories } from "../../redux/category/category.selectors";
import { getOrganization } from "../../redux/organization/organization.selectors";
import { setCategories } from "../../redux/category/category.actions";
import { setChats } from "../../redux/chat/chat.actions";
import Chats from "../chat/chats.component";

class PostPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            title: '',
            description: '',
            organization: null,
            category: null,
            active: false,
            message: {}
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

        const { post } = this.props;
        this.setState(post)
    }

    handleSubmit = async event => {

        event.preventDefault();

        let { id } = this.props.match.params;

        const { title, description, category, active } = this.state;
        const { organization } = this.props;
        const { setPost } = this.props;

        const body = {
            title: title,
            description: description,
            category: category,
            organization: organization,
            active: active
        }

        await performRequest(`/api/posts/${id}`, 'put', body);

        const postResponse = await performRequest(`/api/posts/${id}`, 'get', null);
        setPost(postResponse ? postResponse.payload : null);
    }

    async componentDidMount() {
        const { setPost, setCategories, setChats } = this.props;

        let { id } = this.props.match.params;

        const postResponse = await performRequest(`/api/posts/${id}`, 'get', null);

        const post = postResponse ? postResponse.payload : null;

        setPost(post);
        this.setState(post);

        const categoriesResponse = await performRequest('/api/categories?active=true', 'get', null);
        setCategories(categoriesResponse ? categoriesResponse.payload : { content: [] });

        const chatsResponse = await performRequest(`/api/chats?postId=${id}`, 'get', null);
        setChats(chatsResponse ? chatsResponse.payload : { content: [] });
    }

    render() {
        
        const { post, categories } = this.props;

        const options = categories.content.map(category => {
            return { name: category.name, value: category.id }
        });

        return (
            <>
                {post &&
                    <div className="post">
                        <div className="modal fade" id="updatePost" tabIndex="-1" aria-labelledby="updatePostLabel" aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="updatePostLabel">Uređivanje objave</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <form onSubmit={this.handleSubmit}>
                                        <div className="modal-body">
                                            <FormInput maxLength="255" name="title" type="text" value={this.state.title} handleChange={this.handleChange} required label="Naziv" />
                                            <FormInput name="description" type="text" value={this.state.description} handleChange={this.handleChange} required label="Opis" />
                                            <SelectSearch required={true} onChange={this.handleSelectChange} value={this.state.category ? this.state.category.id : ""}
                                                options={options} filterOptions={fuzzySearch} search emptyMessage="Kategorija ne postoji"
                                                placeholder="Pretražite kategoriju" />
                                            <div className="post-active">
                                                < BootstrapSwitchButton
                                                    className="post-active"
                                                    checked={this.state.active}
                                                    onlabel='Aktivna'
                                                    offlabel='Neaktivna'
                                                    onChange={(checked) => {
                                                        this.setState({ active: checked })
                                                    }}
                                                    width={150}
                                                />
                                            </div>
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
                            <Event />
                            <h1>{post.title}</h1>
                            <div className="badges">
                                <span className="badge bg-info text-dark">{post.category.name}</span>
                                <span className={`badge ${post.active ? "bg-success" : "bg-danger"}`}>{post.active ? "Aktivna" : "Neaktivna"}</span>
                            </div>
                            <div className="description">
                                {post.description}
                            </div>
                            < button type="button" data-bs-toggle="modal" data-bs-target="#updatePost">
                                Uredi
                            </button>
                        </Card>
                        <div className="post-tab">
                            <nav>
                                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                    <button className="nav-link active" id="nav-chats-tab" data-bs-toggle="tab" data-bs-target="#nav-chats" type="button" role="tab" aria-controls="nav-chats" aria-selected="true">Razgovori</button>
                                </div>
                            </nav>
                            <div className="tab-content" id="nav-tabContent">
                                <div className="tab-pane fade show active" id="nav-chats" role="tabpanel" aria-labelledby="nav-chats-tab">
                                    <Chats />
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
    post: getPost,
    categories: selectCategories,
    organization: getOrganization
});

const mapDispatchToProps = dispatch => ({
    setPost: post => dispatch(setPost(post)),
    setCategories: categories => dispatch(setCategories(categories)),
    setChats: chats => dispatch(setChats(chats))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PostPage));