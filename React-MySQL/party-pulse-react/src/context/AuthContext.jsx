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
                    const userData = JSON.parse(storedUser);
                    
                    // Mindig a tokenből vesszük a kritikus adatokat, 
                    // így hiába írják át a localStorage-ben a role-t, 
                    // az alkalmazás indulásakor a token szerinti valós értékkel írjuk felül.
                    const actualRole = decoded["role"] || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
                    const actualUserId = decoded["nameid"] || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/nameidentifier"] || decoded["sub"];
                    const actualUsername = decoded["unique_name"] || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/name"] || decoded["name"];

                    if (actualRole) userData.role = actualRole;
                    if (actualUserId) userData.userId = parseInt(actualUserId);
                    if (actualUsername) userData.username = actualUsername;

                    localStorage.setItem('user', JSON.stringify(userData));
                    setUser(userData);
                }
            } catch (err) {
                logout();
            }
        }
        setLoading(false);
    }, []);

    const login = async (identifier, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.post('/Auth/login', { identifier, password });

            const { token, userId, username, role, displayName, profilePictureBase64 } = response.data;

            if (token) {
                localStorage.setItem('token', token);
                
                const profileData = { 
                    userId: parseInt(userId), 
                    username, 
                    role,
                    name: displayName || username,
                    profilePictureBase64: profilePictureBase64
                };
                
                localStorage.setItem('user', JSON.stringify(profileData));
                setUser(profileData);
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

    const register = async (username, email, password, gender, birthDate, lookingFor, displayName) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.post('/api/Registry', {
                username,
                email,
                password,
                gender,
                birthDate,
                lookingFor,
                displayName
            });
            // Visszaadjuk a valós válaszüzenetet (response.data)
            return { success: true, data: response.data };
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
        window.location.reload();
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
