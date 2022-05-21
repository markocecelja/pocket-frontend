import { createSelector } from 'reselect';

const selectPost = state => state.post;

export const selectPosts = createSelector(
    [selectPost],
    (post) => post.posts
);