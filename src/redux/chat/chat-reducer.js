import { ChatActionTypes } from "./chat.types";


const INITIAL_STATE = {
    chats: {
        content: []
    },
    chat: {
        messages: {
            content: []
        }
    }
}

const chatReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ChatActionTypes.SET_CHATS:
            return {
                ...state,
                chats: action.payload
            }
        case ChatActionTypes.SET_CHAT:
            return {
                ...state,
                chat: action.payload
            }
        case ChatActionTypes.SET_CHAT_MESSAGES:
            return {
                ...state,
                chat: {
                    ...state.chat,
                    messages: action.payload
                }
            }
        default:
            return state;
    }
}

export default chatReducer;