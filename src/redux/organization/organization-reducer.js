import { OrganizationActionTypes } from "./organization.types";

const INITIAL_STATE = {
    organizations: {
        content: []
    },
    organization: null,
    organizationMembers: {
        content: []
    }
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
        case OrganizationActionTypes.SET_ORGANIZATION_MEMBERS:
            return {
                ...state,
                organizationMembers: action.payload
            }
        default:
            return state;
    }
}

export default organizationReducer;