import { useState, useCallback } from 'react';
import { apiClient, API_BASE_URL } from '../services/apiConfig';

export const useEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // AllEventsWithStatus returns attendeeCount + isAttending + isFavorite
            // per event in a single request — eliminates N×3 per-card API calls
            const response = await apiClient.get('/Event/AllEventsWithStatus');
            const baseUrl = API_BASE_URL;

            const formattedEvents = response.data.map((event, index) => {
                const eID = event.eventID ?? event.eventId ?? event.EventID ?? event.id ?? (index + 1);
                const eTitle = event.title ?? event.Title ?? event.name ?? 'Névtelen esemény';
                const eDesc = event.description ?? event.Description ?? event.desc ?? 'Nincs leírás.';
                const eAddr = event.address ?? event.Address ?? '';
                const eDate = event.eventDateTime ?? event.EventDateTime ?? event.date ?? '';
                const eImageUrl = event.imageUrl ?? event.ImageUrl ?? event.imageFileName ?? '';
                const eLat = event.latitude ?? event.Latitude ?? null;
                const eLon = event.longitude ?? event.Longitude ?? null;
                const eMusicStyle = event.musicStyle ?? event.MusicStyle ?? 'other';
                const eLocationName = event.locationName ?? event.LocationName ?? 'Helyszín hamarosan';

                const isDummyImage = eImageUrl && (
                    eImageUrl.toLowerCase().includes('rocknight') ||
                    eImageUrl.toLowerCase().includes('jazz.jpg') ||
                    eImageUrl.toLowerCase().includes('techno') ||
                    eImageUrl.toLowerCase().includes('placeholder')
                );

                return {
                    id: eID,
                    eventId: eID,
                    name: eTitle,
                    desc: eDesc,
                    date: eDate ? eDate.split('T')[0] : '',
                    rawDate: eDate,
                    displayDate: formatDate(eDate),
                    place: eLocationName,
                    city: extractCityFromAddress(eAddr),
                    address: eAddr,
                    lat: eLat,
                    lon: eLon,
                    img: (eImageUrl && !isDummyImage) ? (eImageUrl.startsWith('http') ? eImageUrl : `${baseUrl}${eImageUrl}`) : getPlaceholderImage(index),
                    type: eMusicStyle,
                    ticketPrice: event.ticketPrice ?? event.TicketPrice ?? '',
                    maxAttendees: event.maxAttendees ?? event.MaxAttendees ?? '',
                    isPublic: event.isPublic ?? event.IsPublic ?? true,
                    // Status fields from the batch endpoint
                    attendeeCount: event.attendeeCount ?? event.AttendeeCount ?? 0,
                    isAttending: event.isAttending ?? event.IsAttending ?? false,
                    isFavorite: event.isFavorite ?? event.IsFavorite ?? false,
                    hasEnded: event.hasEnded ?? event.HasEnded ?? false,
                    isReviewed: event.isReviewed ?? event.IsReviewed ?? false,
                    isFeatured: event.isFeatured ?? event.IsFeatured ?? false,
                };
            });

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

// Utils 
const extractCityFromAddress = (address) => {
    if (!address) return 'Borsod';
    const addrLower = address.toLowerCase();

    if (addrLower.includes('miskolc')) return 'Miskolc';
    if (addrLower.includes('mezőkövesd')) return 'Mezőkövesd';
    if (addrLower.includes('ózd')) return 'Ózd';
    if (addrLower.includes('sárospatak')) return 'Sárospatak';
    if (addrLower.includes('budapest')) return 'Budapest';

    const parts = address.split(',');
    return parts[0].trim();
};

const formatDate = (dateTime) => {
    if (!dateTime) return 'Hamarosan';
    try {
        const date = new Date(dateTime);
        if (isNaN(date.getTime())) return dateTime;
        return date.toLocaleDateString('hu-HU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
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
