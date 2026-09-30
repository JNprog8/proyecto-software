/**
 * manejo de estado central (store)
 * unica fuente de la verdad para los datos cargados en memoria.
 */

export const state = {
    currentAuthUser: null,
    rolesMap: new Map(),
    cachedUsers: [],
    currentDeleteUserId: null,

    setAuthUser(user) {
        this.currentAuthUser = user;
    },
    getAuthUser() {
        return this.currentAuthUser;
    },
    
    setRoles(rolesArray) {
        this.rolesMap.clear();
        rolesArray.forEach(role => this.rolesMap.set(Number(role.id), role));
    },
    getRoles() {
        return Array.from(this.rolesMap.values());
    },
    getRole(id) {
        return this.rolesMap.get(Number(id));
    },

    setUsers(usersArray) {
        this.cachedUsers = usersArray;
    },
    getUsers() {
        return this.cachedUsers;
    },

    setDeleteTarget(userId) {
        this.currentDeleteUserId = userId;
    },
    getDeleteTarget() {
        return this.currentDeleteUserId;
    }
};
