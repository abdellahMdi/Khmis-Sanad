import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    useCallback,
} from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));
    const [loading, setLoading] = useState(true);

    const setAuthToken = (newToken) => {
        setToken(newToken);
        if (newToken) {
            localStorage.setItem('ACCESS_TOKEN', newToken);
        } else {
            localStorage.removeItem('ACCESS_TOKEN');
        }
    };

    const fetchUser = useCallback(async () => {
        if (token) {
            try {
                const response = await axiosClient.get('/user');
                // Handles direct user object or wrapped API response ({ data: { ... } })
                setUser(response.data.data || response.data);
            } catch (error) {
                console.error('Session expirée ou jeton invalide :', error);
                setAuthToken(null);
                setUser(null);
            }
        } else {
            setUser(null);
        }
        setLoading(false);
    }, [token]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const login = async (credentials) => {
        const response = await axiosClient.post('/login', credentials);
        const authToken = response.data.token || response.data.access_token;
        const userData = response.data.user || response.data.data;

        setUser(userData);
        setAuthToken(authToken);
        return response;
    };

    const register = async (userData) => {
        const response = await axiosClient.post('/register', userData);
        
        // Auto-login if registration response contains token, otherwise perform login call
        const authToken = response.data.token || response.data.access_token;
        if (authToken) {
            const userObj = response.data.user || response.data.data;
            setUser(userObj);
            setAuthToken(authToken);
        } else {
            await login({ email: userData.email, password: userData.password });
        }
        
        return response;
    };

    const logout = async () => {
        try {
            await axiosClient.post('/logout');
        } catch (error) {
            console.error('Échec de la déconnexion du serveur :', error);
        } finally {
            setUser(null);
            setAuthToken(null);
        }
    };

    const value = { user, token, loading, login, register, logout, fetchUser };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAF5EF]">
                <div className="w-12 h-12 border-4 border-[#E8DCCF] border-t-[#C2591A] rounded-full animate-spin mb-4" />
                <p className="text-[#785D4E] font-medium text-sm">
                    Vérification de la session...
                </p>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}