import { useState, useCallback } from 'react';
import { apiClient } from '../services/apiConfig';

export const useRanking = () => {
    const [ranking, setRanking] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchRanking = useCallback(async (type = 'all_time', count = 20) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.get(`/api/Ranking/TopList`, {
                params: { type, count }
            });

            const formattedRanking = response.data.map(user => ({
                rank: user.rank,
                username: user.userName,
                events: user.partyCount,
                points: user.score
            }));

            setRanking(formattedRanking);
        } catch (err) {
            console.error('Error fetching ranking:', err);
            setError(err.response?.data || 'Nem sikerült betölteni a ranglistát.');
        } finally {
            setLoading(false);
        }
    }, []);

    return { ranking, loading, error, fetchRanking };
};
