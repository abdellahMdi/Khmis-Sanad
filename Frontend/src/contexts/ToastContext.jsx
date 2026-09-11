// frontend/src/contexts/ToastContext.jsx
import React, { createContext, useContext } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context for showing toast notifications
const ToastContext = createContext();

// Custom hook for using toast context
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

// Default configuration for toasts
const defaultToastOptions = {
    position: 'bottom-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
};

// Provider for toast notification context
export const ToastProvider = ({ children }) => {
    // Show success toast
    const showSuccess = (message) => {
        toast.success(message, defaultToastOptions);
    };

    // Show error toast
    const showError = (message) => {
        toast.error(message, {
            ...defaultToastOptions,
            autoClose: 4000,
        });
    };

    // Show info toast
    const showInfo = (message) => {
        toast.info(message, defaultToastOptions);
    };

    // Show warning toast
    const showWarning = (message) => {
        toast.warning(message, defaultToastOptions);
    };

    // Show loading toast
    const showLoading = (message = 'Chargement en cours...') => {
        return toast.loading(message, {
            position: 'bottom-right',
        });
    };

    // Update existing loading toast
    const updateToast = (toastId, message, type) => {
        toast.update(toastId, {
            render: message,
            type: type,
            isLoading: false,
            ...defaultToastOptions,
        });
    };

    return (
        <ToastContext.Provider
            value={{
                showSuccess,
                showError,
                showInfo,
                showWarning,
                showLoading,
                updateToast,
            }}
        >
            {children}
            {/* Global toast container included so toasts display automatically */}
            <ToastContainer />
        </ToastContext.Provider>
    );
};