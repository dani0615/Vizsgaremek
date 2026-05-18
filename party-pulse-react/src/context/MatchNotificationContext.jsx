import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { apiClient } from '../services/apiConfig';
import { useAuth } from './AuthContext';

const MatchNotificationContext = createContext(null);

export const useMatchNotifications = () => useContext(MatchNotificationContext);


export const MatchNotificationProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();

    // Queue of brand-new match objects to toast
    const [toastQueue, setToastQueue] = useState([]);
    // Total unseen match count (for navbar badge)
    const [unseenCount, setUnseenCount] = useState(0);
    // Full list of new matches (for buddies page banner)
    const [newMatches, setNewMatches] = useState([]);

    const intervalRef = useRef(null);
    // Mirror newMatches in a ref so markAllSeen never needs it as a dep
    const newMatchesRef = useRef([]);
    useEffect(() => { newMatchesRef.current = newMatches; }, [newMatches]);

    const checkForNewMatches = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            const res = await apiClient.get('/Matching/Matches');
            const allMatches = res.data;
            const fresh = allMatches.filter(m => m.isSeen === false);

            if (fresh.length > 0) {
                setNewMatches(fresh);
                setUnseenCount(fresh.length);
                // Push each into toast queue (show one-by-one with 4s gap)
                fresh.forEach((m, i) => {
                    setTimeout(() => {
                        setToastQueue(q => [...q, { ...m, toastId: `${m.matchID}-${Date.now()}` }]);
                    }, i * 4200);
                });
            }
        } catch {
            // Silently fail – don't bother the user
        }
    }, [isAuthenticated]);

    // Start polling when authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            clearInterval(intervalRef.current);
            setUnseenCount(0);
            setNewMatches([]);
            setToastQueue([]);
            return;
        }
        // Run immediately, then every 60s
        checkForNewMatches();
        intervalRef.current = setInterval(checkForNewMatches, 60_000);
        return () => clearInterval(intervalRef.current);
    }, [isAuthenticated, checkForNewMatches]);

    /** Call this when user navigates to /buddies or dismisses the banner.
     *  Reads from the ref so this function is always stable (no re-creation). */
    const markAllSeen = useCallback(async () => {
        if (newMatchesRef.current.length === 0) return;
        try {
            await apiClient.post('/Matching/MarkSeen');
        } catch (err) {
            console.error('Failed to mark matches as seen:', err);
        }
        setNewMatches([]);
        setUnseenCount(0);
    }, []);

    /** Dismiss a single toast */
    const dismissToast = useCallback((toastId) => {
        setToastQueue(q => q.filter(t => t.toastId !== toastId));
    }, []);

    return (
        <MatchNotificationContext.Provider value={{ unseenCount, newMatches, toastQueue, markAllSeen, dismissToast }}>
            {children}
        </MatchNotificationContext.Provider>
    );
};
