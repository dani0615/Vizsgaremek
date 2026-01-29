import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import EventCard from '../components/EventCard';
import Map from '../components/Map';
import { useEvents } from '../hooks/useEvents';

const Events = () => {
    const [searchParams] = useSearchParams();
    const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
    const [city, setCity] = useState('');
    const [date, setDate] = useState('');
    const [type, setType] = useState('');
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [mapCenter, setMapCenter] = useState([20.7784, 48.1035]); // Default: Miskolc

    // Város koordináták
    const cityCoordinates = {
        'Miskolc': [20.7784, 48.1035],
        'Mezőkövesd': [20.5464, 47.8104],
        'Ózd': [20.2969, 48.2197],
        'Sárospatak': [21.5711, 48.3228],
        'Kazincbarcika': [20.6503, 48.2553]
    };

    // Use custom hook
    const { events: allEvents, loading, error, fetchEvents } = useEvents();

    // Események betöltése a backend-ről
    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    // Térkép középpont frissítése város kiválasztásakor
    useEffect(() => {
        if (city && cityCoordinates[city]) {
            setMapCenter(cityCoordinates[city]);
        } else {
            // Ha nincs város kiválasztva, vissza Miskolcra (alapértelmezett)
            setMapCenter([20.7784, 48.1035]);
        }
    }, [city]);

    // Szűrés alkalmazása
    useEffect(() => {
        const applyFilters = () => {
            const filtered = allEvents.filter(event => {
                return (
                    (event.name.toLowerCase().includes(keyword.toLowerCase()) ||
                        event.desc.toLowerCase().includes(keyword.toLowerCase())) &&
                    (city === '' || event.city === city) &&
                    (date === '' || event.date === date) &&
                    (type === '' || event.type === type)
                );
            });
            setFilteredEvents(filtered);
        };

        applyFilters();
    }, [keyword, city, date, type, allEvents]);

    return (
        <section id="events" className="page active">
            <div className="container">
                <h2 className="section-title">Bulik Keresése</h2>

                <div className="filters">
                    <input
                        type="text"
                        placeholder="Kulcsszó (pl. Techno)..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    <select value={city} onChange={(e) => setCity(e.target.value)}>
                        <option value="">Összes Város</option>
                        <option value="Miskolc">Miskolc</option>
                        <option value="Mezőkövesd">Mezőkövesd</option>
                        <option value="Ózd">Ózd</option>
                        <option value="Sárospatak">Sárospatak</option>
                        <option value="Kazincbarcika">Kazincbarcika</option>
                    </select>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="">Összes Típus</option>
                        <option value="Club Night">Club Night</option>
                        <option value="Fesztivál">Fesztivál</option>
                        <option value="Koncert">Koncert</option>
                    </select>
                </div>

                <Map
                    center={mapCenter}
                    zoom={12}
                    markers={[]}
                />

                <div className="event-grid" id="all-events-list">
                    {loading ? (
                        <p style={{ gridColumn: '1/-1', textAlign: 'center' }}>
                            <i className="fas fa-spinner fa-spin"></i> Események betöltése...
                        </p>
                    ) : error ? (
                        <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#ff4444' }}>
                            {error}
                        </p>
                    ) : filteredEvents.length > 0 ? (
                        filteredEvents.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))
                    ) : (
                        <p style={{ gridColumn: '1/-1', textAlign: 'center' }}>Nincs találat...</p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Events;
