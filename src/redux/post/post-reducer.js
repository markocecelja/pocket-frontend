import { PostActionTypes } from "./post.types";

const INITIAL_STATE = {
    posts: {
        content: []
    },
    post: null
}

const postReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case PostActionTypes.SET_POSTS:
            return {
                ...state,
                posts: action.payload
            }
        case PostActionTypes.SET_POST:
            return {
                ...state,
                post: action.payload
            }
        default:
            return state;
    }
}

export default postReducer;