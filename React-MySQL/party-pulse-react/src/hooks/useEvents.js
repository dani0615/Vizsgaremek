import { useState, useCallback } from 'react';
import { apiClient } from '../services/apiConfig';

export const useEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.get('/Event/AllEvents');

            const formattedEvents = response.data.map((event, index) => ({
                id: index + 1, // Vagy event.id ha van
                eventId: event.id, // Eredeti ID megőrzése
                name: event.title,
                desc: event.description,
                date: formatDate(event.eventDateTime),
                place: event.locationName,
                city: extractCityFromAddress(event.address),
                address: event.address,
                img: getPlaceholderImage(index),
                type: 'Club Night'
            }));

            setEvents(formattedEvents);
        } catch (err) {
            console.error('Error fetching events:', err);
            setError(err.response?.data || 'Nem sikerült betölteni az eseményeket.');
        } finally {
            setLoading(false);
        }
    }, []);

    return { events, loading, error, fetchEvents };
};

// Utils (lokálisan, vagy később külön utils fájlba szervezhető)
const extractCityFromAddress = (address) => {
    if (!address) return 'Ismeretlen';
    const parts = address.split(',');
    return parts[0].trim();
};

const formatDate = (dateTime) => {
    if (!dateTime) return '';
    try {
        const date = new Date(dateTime);
        return date.toISOString().split('T')[0];
    } catch (e) {
        return dateTime;
    }
};

const getPlaceholderImage = (index) => {
    const images = [
        'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600',
        'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600',
        'https://images.unsplash.com/photo-1459749411177-042180ce673c?w=600',
        'https://images.unsplash.com/photo-1514525253361-bee8718a7439?w=600',
        'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600',
        'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=600',
        'https://images.unsplash.com/photo-1574391884720-bbe3740e53d9?w=600',
        'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600',
        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600',
        'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=600'
    ];
    return images[index % images.length];
};
