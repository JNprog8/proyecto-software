/**
 * API client (servicio de red)
 * aisla toda la logica de fetch, cabeceras HTTP y parseo JSON.
 */

export function resolveApiUrl(endpoint) {
    if (typeof endpoint !== 'string') return endpoint;
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) return endpoint;
    const base = (window.APP_BASE_URL || '').replace(/\/+$/, '');
    const clean = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
    return base + clean;
}

export const api = {
    async get(endpoint) {
        const response = await fetch(resolveApiUrl(endpoint));
        const result = await response.json();
        if (!response.ok || !result.success) {
            throw new Error(result.error || `Error GET ${endpoint}`);
        }
        return result;
    },

    async post(endpoint, data) {
        const response = await fetch(resolveApiUrl(endpoint), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
            throw new Error(result.error || `Error POST ${endpoint}`);
        }
        return result;
    },

    async put(endpoint, data) {
        const response = await fetch(resolveApiUrl(endpoint), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
            throw new Error(result.error || `Error PUT ${endpoint}`);
        }
        return result;
    },

    async del(endpoint) {
        const response = await fetch(resolveApiUrl(endpoint), {
            method: 'DELETE'
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
            throw new Error(result.error || `Error DELETE ${endpoint}`);
        }
        return result;
    }
};
