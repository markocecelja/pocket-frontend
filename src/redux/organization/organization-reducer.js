import { OrganizationActionTypes } from "./organization.types";

const INITIAL_STATE = {
    organizations: {
        content: []
    },
    organization: null
}

const organizationReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case OrganizationActionTypes.SET_ORGANIZATIONS:
            return {
                ...state,
                organizations: action.payload
            }
            case OrganizationActionTypes.SET_ORGANIZATION:
            return {
                ...state,
                organization: action.payload
            }
        default:
            return state;
    }
}

export default organizationReducer;