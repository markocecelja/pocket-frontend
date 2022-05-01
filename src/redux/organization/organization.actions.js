import { OrganizationActionTypes } from "./organization.types"

export const setOrganizations = organizations => ({
    type: OrganizationActionTypes.SET_ORGANIZATIONS,
    payload: organizations
})

export const setOrganization = organization => ({
    type: OrganizationActionTypes.SET_ORGANIZATION,
    payload: organization
})