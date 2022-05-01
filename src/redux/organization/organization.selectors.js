import { createSelector } from 'reselect';

const selectOrganization = state => state.organization;

export const selectOrganizations = createSelector(
    [selectOrganization],
    (organization) => organization.organizations
);

export const getOrganization = createSelector(
    [selectOrganization],
    (organization) => organization.organization
);