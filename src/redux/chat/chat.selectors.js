import { createSelector } from 'reselect';

const selectChat = state => state.chat;

export const getChats = createSelector(
    [selectChat],
    (chat) => chat.chats
);

export const getChat = createSelector(
    [selectChat],
    (chat) => chat.chat
);