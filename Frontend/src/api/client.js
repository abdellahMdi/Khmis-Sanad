import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const client = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    withXSRFToken: true,
    timeout: 10000,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
});

let csrfReady = false;

export async function ensureCsrfCookie() {
    if (csrfReady) {
        return;
    }
    await client.get('/sanctum/csrf-cookie');
    csrfReady = true;
}

export function resetCsrf() {
    csrfReady = false;
}

client.interceptors.request.use(async (config) => {
    const method = (config.method || 'get').toLowerCase();
    if (['post', 'put', 'patch', 'delete'].includes(method)) {
        await ensureCsrfCookie();
    }
    if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
        config.timeout = 30000;
        if (config.headers) {
            if (typeof config.headers.delete === 'function') {
                config.headers.delete('Content-Type');
            } else {
                delete config.headers['Content-Type'];
            }
        }
    }
    return config;
});

client.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error.config;

        if (error.response?.status === 419 && config && !config._csrfRetry) {
            config._csrfRetry = true;
            resetCsrf();
            await ensureCsrfCookie();

            return client(config);
        }

        return Promise.reject(error);
    }
);
