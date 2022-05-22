export const checkHasRole = (user, role) => {

    return user.roles.some(userRole => userRole.id === role);
}