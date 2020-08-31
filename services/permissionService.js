class PermissionService {
    /**
     * Check if User has required permissions. Flat routePermissions array indicates all are required, array of arrays indicate at least one set of permissions must be satisfied.
     * 
     * @param {string[]} userPermissions - Permissions the user possesses 
     * @param {string[]|string[][]} routePermissions - List of Cumulative required permissions or List of Possible required permission sets
     */
    userHasRequiredPermissions(userPermissions, routePermissions) {
        if (typeof routePermissions[0] === 'object') {
            //* list of multiple lists of permisison
            //* Example: [[permA, permB], [permC]]
            //* means permA & permB are required, OR permC is required

            const hasPerm = !!routePermissions.find(permList => permList.every(val => userPermissions.includes(val)))
            return hasPerm;
        }
        return routePermissions.every(val => userPermissions.includes(val));
    }

    /**
     * Check if User is Super Admin based off of Reperio Core Permissions
     * 
     * @param {string[]} userPermissions - Core permissions the user possesses 
     */
    userIsSuperAdmin(userPermissions) {
        return this.userHasRequiredPermissions(userPermissions, ['UpdateOrganizations']);
    }
}

const permissionService = new PermissionService();

module.exports = permissionService;