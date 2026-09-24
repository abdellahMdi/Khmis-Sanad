export function formatMad(value) {
    const amount = Number(value || 0);
    return `${amount.toFixed(2)} MAD`;
}

export function whatsappLink(number, text) {
    if (!number) {
        return null;
    }
    const digits = String(number).replace(/\D+/g, '');
    if (!digits) {
        return null;
    }
    const message = text ? `?text=${encodeURIComponent(text)}` : '';
    return `https://wa.me/${digits}${message}`;
}

export function groupByShop(items, getProduct = (item) => item.product) {
    const groups = new Map();
    items.forEach((item) => {
        const product = getProduct(item);
        const shop = product?.shop;
        const key = shop?.id ?? 'unknown';
        if (!groups.has(key)) {
            groups.set(key, {
                shop,
                items: [],
            });
        }
        groups.get(key).items.push(item);
    });
    return Array.from(groups.values());
}

export function apiErrorMessage(error, fallback = 'Une erreur est survenue.') {
    if (!error) {
        return fallback;
    }
    const data = error.data;
    if (typeof data === 'string') {
        return data;
    }
    if (data?.message) {
        return data.message;
    }
    if (data?.errors) {
        return Object.values(data.errors).flat().join(' ');
    }
    return fallback;
}

export function unwrapList(response) {
    if (!response) {
        return { items: [], meta: null };
    }
    if (Array.isArray(response.data)) {
        return { items: response.data, meta: response.meta || null };
    }
    if (Array.isArray(response)) {
        return { items: response, meta: null };
    }
    return { items: [], meta: null };
}
