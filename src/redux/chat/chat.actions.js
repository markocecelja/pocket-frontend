import { ChatActionTypes } from "./chat.types"

export const setChats = chats => ({
    type: ChatActionTypes.SET_CHATS,
    payload: chats
})

export const setChat = chat => ({
    type: ChatActionTypes.SET_CHAT,
    payload: chat
})

export const setChatMessages = messages => ({
    type: ChatActionTypes.SET_CHAT_MESSAGES,
    payload: messages
})