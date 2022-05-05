import { CategoryActionTypes } from "./category.types";

const INITIAL_STATE = {
    categories: {
        content: []
    }
}

const categoryReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CategoryActionTypes.SET_CATEGORIES:
            return {
                ...state,
                categories: action.payload
            }
        case CategoryActionTypes.SET_CATEGORY:

            const categories = state.categories;
            const content = categories.content.map((category) => category.id === action.payload.id ? action.payload : category);
        
            categories.content = content;

            return {
                ...state,
                categories: categories
            }
        default:
            return state;
    }
}

export default categoryReducer;