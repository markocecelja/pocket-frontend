import { PostActionTypes } from "./post.types"

export const setPosts = posts => ({
    type: PostActionTypes.SET_POSTS,
    payload: posts
})