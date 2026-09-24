import { createApi } from '@reduxjs/toolkit/query/react';
import { client } from './client';

const axiosBaseQuery =
    () =>
    async ({ url, method = 'GET', data, params }) => {
        try {
            const result = await client({ url, method, data, params });
            return { data: result.data };
        } catch (axiosError) {
            return {
                error: {
                    status: axiosError.response?.status,
                    data: axiosError.response?.data || axiosError.message,
                },
            };
        }
    };

export const api = createApi({
    reducerPath: 'api',
    baseQuery: axiosBaseQuery(),
    tagTypes: [
        'User',
        'Cart',
        'Products',
        'Product',
        'Categories',
        'Orders',
        'Order',
        'Shop',
        'ShopProducts',
        'ShopOrders',
        'AdminShops',
        'AdminUsers',
        'AdminReviews',
    ],
    endpoints: (builder) => ({
        getUser: builder.query({
            query: () => ({ url: '/api/user' }),
            transformResponse: (res) => res.data,
            providesTags: ['User'],
        }),
        login: builder.mutation({
            query: (body) => ({ url: '/api/login', method: 'POST', data: body }),
            transformResponse: (res) => res.data,
            invalidatesTags: ['User', 'Cart'],
        }),
        register: builder.mutation({
            query: (body) => ({
                url: '/api/register',
                method: 'POST',
                data: body,
            }),
            transformResponse: (res) => res.data,
            invalidatesTags: ['User'],
        }),
        logout: builder.mutation({
            query: () => ({ url: '/api/logout', method: 'POST' }),
            invalidatesTags: ['User', 'Cart', 'Orders'],
        }),
        getCategories: builder.query({
            query: () => ({ url: '/api/categories' }),
            transformResponse: (res) => res.data || res,
            providesTags: ['Categories'],
        }),
        getProducts: builder.query({
            query: (params) => ({ url: '/api/products', params }),
            providesTags: ['Products'],
        }),
        getProduct: builder.query({
            query: (slug) => ({ url: `/api/products/${slug}` }),
            transformResponse: (res) => ({
                ...(res.data || {}),
                viewer: res.meta?.viewer ?? {
                    has_purchased: false,
                    has_reviewed: false,
                    can_review: false,
                },
            }),
            providesTags: (result, error, slug) => [
                'Product',
                { type: 'Product', id: slug },
                ...(result?.id ? [{ type: 'Product', id: result.id }] : []),
            ],
        }),
        createReview: builder.mutation({
            query: (body) => ({
                url: '/api/reviews',
                method: 'POST',
                data: body,
            }),
            invalidatesTags: ['Product', 'Products', 'AdminReviews'],
        }),
        getCart: builder.query({
            query: () => ({ url: '/api/cart' }),
            transformResponse: (res) => res.data,
            providesTags: ['Cart'],
        }),
        addCartItem: builder.mutation({
            query: (body) => ({
                url: '/api/cart/items',
                method: 'POST',
                data: body,
            }),
            invalidatesTags: ['Cart'],
        }),
        updateCartItem: builder.mutation({
            query: ({ id, quantite }) => ({
                url: `/api/cart/items/${id}`,
                method: 'PATCH',
                data: { quantite },
            }),
            invalidatesTags: ['Cart'],
        }),
        deleteCartItem: builder.mutation({
            query: (id) => ({
                url: `/api/cart/items/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Cart'],
        }),
        getOrders: builder.query({
            query: (page = 1) => ({ url: '/api/orders', params: { page } }),
            providesTags: ['Orders'],
        }),
        getOrder: builder.query({
            query: (id) => ({ url: `/api/orders/${id}` }),
            transformResponse: (res) => res.data,
            providesTags: (result, error, id) => [{ type: 'Order', id }],
        }),
        createOrder: builder.mutation({
            query: (body) => ({
                url: '/api/orders',
                method: 'POST',
                data: body,
            }),
            invalidatesTags: ['Orders', 'Cart', 'Products'],
        }),
        getShop: builder.query({
            query: () => ({ url: '/api/shop' }),
            transformResponse: (res) => res.data,
            providesTags: ['Shop'],
        }),
        updateShop: builder.mutation({
            query: (body) => ({ url: '/api/shop', method: 'PUT', data: body }),
            transformResponse: (res) => res.data,
            invalidatesTags: ['Shop'],
        }),
        getShopProducts: builder.query({
            query: (page = 1) => ({
                url: '/api/shop/products',
                params: { page },
            }),
            providesTags: ['ShopProducts'],
        }),
        getShopProduct: builder.query({
            query: (id) => ({ url: `/api/shop/products/${id}` }),
            transformResponse: (res) => res.data,
            providesTags: (result, error, id) => [{ type: 'Product', id }],
        }),
        createShopProduct: builder.mutation({
            query: (body) => ({
                url: '/api/shop/products',
                method: 'POST',
                data: body,
            }),
            invalidatesTags: ['ShopProducts', 'Products'],
        }),
        updateShopProduct: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/api/shop/products/${id}`,
                method: 'PUT',
                data: body,
            }),
            invalidatesTags: ['ShopProducts', 'Products', 'Product'],
        }),
        uploadShopProof: builder.mutation({
            query: (file) => {
                const data = new FormData();
                data.append('proof', file);
                return { url: '/api/shop/proof', method: 'POST', data };
            },
            transformResponse: (res) => res.data,
            invalidatesTags: ['Shop', 'User', 'AdminUsers'],
        }),
        deleteShopProduct: builder.mutation({
            query: (id) => ({
                url: `/api/shop/products/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['ShopProducts', 'Products'],
        }),
        getShopOrders: builder.query({
            query: (page = 1) => ({
                url: '/api/shop/orders',
                params: { page },
            }),
            providesTags: ['ShopOrders'],
        }),
        getAdminUsers: builder.query({
            query: (page = 1) => ({
                url: '/api/admin/users',
                params: { page },
            }),
            providesTags: ['AdminUsers'],
        }),
        getAdminShops: builder.query({
            query: (page = 1) => ({
                url: '/api/admin/shops',
                params: { page },
            }),
            providesTags: ['AdminShops'],
        }),
        approveShop: builder.mutation({
            query: (id) => ({
                url: `/api/admin/shops/${id}/approve`,
                method: 'PATCH',
            }),
            invalidatesTags: ['AdminShops', 'AdminUsers', 'Products'],
        }),
        blockShop: builder.mutation({
            query: (id) => ({
                url: `/api/admin/shops/${id}/block`,
                method: 'PATCH',
            }),
            invalidatesTags: ['AdminShops', 'AdminUsers', 'Products'],
        }),
        getPendingReviews: builder.query({
            query: (page = 1) => ({
                url: '/api/admin/reviews/pending',
                params: { page },
            }),
            providesTags: ['AdminReviews'],
        }),
        approveReview: builder.mutation({
            query: (id) => ({
                url: `/api/admin/reviews/${id}/approve`,
                method: 'PATCH',
            }),
            invalidatesTags: ['AdminReviews', 'Product', 'Products'],
        }),
        deleteReview: builder.mutation({
            query: (id) => ({
                url: `/api/admin/reviews/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['AdminReviews', 'Product', 'Products'],
        }),
    }),
});

export const {
    useGetUserQuery,
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useGetCategoriesQuery,
    useGetProductsQuery,
    useGetProductQuery,
    useCreateReviewMutation,
    useGetCartQuery,
    useAddCartItemMutation,
    useUpdateCartItemMutation,
    useDeleteCartItemMutation,
    useGetOrdersQuery,
    useGetOrderQuery,
    useCreateOrderMutation,
    useGetShopQuery,
    useUpdateShopMutation,
    useUploadShopProofMutation,
    useGetShopProductsQuery,
    useGetShopProductQuery,
    useCreateShopProductMutation,
    useUpdateShopProductMutation,
    useDeleteShopProductMutation,
    useGetShopOrdersQuery,
    useGetAdminUsersQuery,
    useGetAdminShopsQuery,
    useApproveShopMutation,
    useBlockShopMutation,
    useGetPendingReviewsQuery,
    useApproveReviewMutation,
    useDeleteReviewMutation,
} = api;
