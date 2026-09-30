/**
 * cliente HTTP centralizado para la API REST.
 * maneja cabeceras, serializacion JSON, verificacion de errores y cancelacion con abortcontroller.
 */
class ApiClient {
    constructor(baseUrl = '') {
        this.baseUrl = baseUrl;
    }

    /**
     * realiza una peticion HTTP generica.
     * @param {string} endpoint
     * @param {requestinit} options
     * @returns {promise<any>}
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json',
            ...(options.headers || {})
        };

        const config = {
            ...options,
            headers
        };

        try {
            const response = await fetch(url, config);
            const contentType = response.headers.get('content-type') || '';
            const isJson = contentType.includes('application/json');

            const payload = isJson ? await response.json() : await response.text();

            if (!response.ok) {
                const errorMessage = isJson && payload.error
                    ? payload.error
                    : (isJson && payload.message ? payload.message : `Error HTTP ${response.status}: ${response.statusText}`);
                
                const error = new Error(errorMessage);
                error.status = response.status;
                error.payload = payload;
                throw error;
            }

            return payload;
        } catch (err) {
            if (err.name === 'AbortError') {
                // peticion cancelada deliberadamente (debounce o cambio rapido)
                return { aborted: true };
            }
            throw err;
        }
    }

    get(endpoint, signal = null) {
        return this.request(endpoint, { method: 'GET', signal });
    }

    post(endpoint, body = {}, signal = null) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
            signal
        });
    }

    put(endpoint, body = {}, signal = null) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body),
            signal
        });
    }

    delete(endpoint, signal = null) {
        return this.request(endpoint, { method: 'DELETE', signal });
    }
}

export const api = new ApiClient();
