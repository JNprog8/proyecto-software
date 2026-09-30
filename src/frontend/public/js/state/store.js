/**
 * store reactivo de estado centralizado para el frontend.
 * maneja el estado global de la aplicacion (usuario activo, padron de usuarios, roles, paginacion y filtros).
 */
class Store {
    constructor() {
        this.state = {
            currentUser: null,
            roles: [],
            rolesMap: new Map(),
            users: [],
            pagination: {
                page: 1,
                limit: 10,
                total: 0,
                total_pages: 1
            },
            filters: {
                search: '',
                rolId: null
            },
            isLoading: false,
            activeDeleteUser: null
        };
        this.subscribers = new Set();
    }

    getState() {
        return this.state;
    }

    /**
     * suscribe una funcion observadora que sera invocada tras cada mutacion del estado.
     * @param {function} callback
     * @returns {function} funcion para cancelar la suscripcion
     */
    subscribe(callback) {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }

    notify() {
        for (const cb of this.subscribers) {
            try {
                cb(this.state);
            } catch (err) {
                console.error('Error en suscriptor del store:', err);
            }
        }
    }

    setState(patch) {
        this.state = { ...this.state, ...patch };
        this.notify();
    }

    setCurrentUser(user) {
        this.setState({ currentUser: user });
    }

    setRoles(rolesList) {
        const map = new Map();
        for (const r of rolesList) {
            map.set(Number(r.id), r);
        }
        this.setState({ roles: rolesList, rolesMap: map });
    }

    setUsers(users, pagination = null) {
        this.setState({
            users,
            pagination: pagination ? { ...this.state.pagination, ...pagination } : this.state.pagination,
            isLoading: false
        });
    }

    setLoading(isLoading) {
        this.setState({ isLoading });
    }

    setFilters(filtersPatch) {
        this.setState({
            filters: { ...this.state.filters, ...filtersPatch },
            pagination: { ...this.state.pagination, page: 1 } // Resetear a página 1 al filtrar
        });
    }

    setPage(page) {
        this.setState({
            pagination: { ...this.state.pagination, page }
        });
    }

    setActiveDeleteUser(user) {
        this.setState({ activeDeleteUser: user });
    }
}

export const store = new Store();
