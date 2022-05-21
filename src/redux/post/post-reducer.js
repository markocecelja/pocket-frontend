import { PostActionTypes } from "./post.types";

const INITIAL_STATE = {
    posts: {
        content: []
    }
}

const postReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case PostActionTypes.SET_POSTS:
            return {
                ...state,
                posts: action.payload
            }
        default:
            return state;
    }
}

export default postReducer;