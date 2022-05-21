import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import userReducer from "./user/user-reducer";
import organizationReducer from "./organization/organization-reducer";
import categoryReducer from "./category/category-reducer";
import postReducer from "./post/post-reducer";

const persistConfig = {
    key: 'root',
    storage,
    whitelist: []
}

const rootReducer = combineReducers({
    user: userReducer,
    organization: organizationReducer,
    category: categoryReducer,
    post: postReducer
});

export default persistReducer(persistConfig, rootReducer);