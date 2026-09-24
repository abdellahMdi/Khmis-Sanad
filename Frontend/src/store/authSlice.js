import { createSlice } from '@reduxjs/toolkit';
import { api } from '../api/api';
import { resetCsrf } from '../api/client';

const initialState = {
    user: null,
    role: null,
    status: 'loading',
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials(state, action) {
            state.user = action.payload;
            state.role = action.payload?.role ?? null;
            state.status = action.payload ? 'authenticated' : 'idle';
        },
        clearCredentials(state) {
            state.user = null;
            state.role = null;
            state.status = 'idle';
        },
        setAuthLoading(state) {
            state.status = 'loading';
        },
        setAuthError(state) {
            state.user = null;
            state.role = null;
            state.status = 'error';
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(api.endpoints.getUser.matchPending, (state) => {
                if (!state.user) {
                    state.status = 'loading';
                }
            })
            .addMatcher(api.endpoints.getUser.matchFulfilled, (state, { payload }) => {
                state.user = payload;
                state.role = payload?.role ?? null;
                state.status = 'authenticated';
            })
            .addMatcher(api.endpoints.getUser.matchRejected, (state) => {
                state.user = null;
                state.role = null;
                state.status = 'idle';
            })
            .addMatcher(api.endpoints.login.matchFulfilled, (state, { payload }) => {
                state.user = payload;
                state.role = payload?.role ?? null;
                state.status = 'authenticated';
            })
            .addMatcher(api.endpoints.register.matchFulfilled, (state, { payload }) => {
                state.user = payload;
                state.role = payload?.role ?? null;
                state.status = 'authenticated';
            })
            .addMatcher(api.endpoints.logout.matchFulfilled, (state) => {
                state.user = null;
                state.role = null;
                state.status = 'idle';
                resetCsrf();
            });
    },
});

export const { setCredentials, clearCredentials, setAuthLoading, setAuthError } =
    authSlice.actions;

export const selectAuth = (state) => state.auth;
export const selectRole = (state) => state.auth.role;
export const selectUser = (state) => state.auth.user;

export default authSlice.reducer;
