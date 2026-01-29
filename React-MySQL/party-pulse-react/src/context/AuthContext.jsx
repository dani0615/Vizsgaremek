import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import { apiClient } from '../services/apiConfig';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Check for existing token on mount
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            try {
                const decoded = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                if (decoded.exp < currentTime) {
                    // Token expired
                    logout();
                } else {
                    // Token valid
                    setUser(JSON.parse(storedUser));
                }
            } catch (err) {
                logout();
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.post('/Auth/login', { email, password });

            const { token, username, role } = response.data;

            if (token) {
                localStorage.setItem('token', token);
                const userData = { username, role };
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                return { success: true };
            } else {
                setError('Nem érkezett token a szervertől.');
                return { success: false, error: 'Nem érkezett token.' };
            }
        } catch (err) {
            const errorMessage = err.response?.data || 'Hiba a bejelentkezés során.';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const register = async (username, email, password) => {
        setLoading(true);
        setError(null);
        try {
            await apiClient.post('/api/Registry', { username, email, password });
            // Sikeres regisztráció után automatikusan bejelentkeztethetnénk,
            // de most csak visszaadjuk a sikert.
            return { success: true };
        } catch (err) {
            const errorMessage = err.response?.data || 'Hiba a regisztráció során.';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setError(null);
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
