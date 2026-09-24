import { configureStore } from '@reduxjs/toolkit';
import { api } from '../api/api';
import authReducer from './authSlice';

export function setupStore(preloadedState) {
    return configureStore({
        reducer: {
            auth: authReducer,
            [api.reducerPath]: api.reducer,
        },
        middleware: (getDefault) => getDefault().concat(api.middleware),
        preloadedState,
    });
}

export const store = setupStore();
