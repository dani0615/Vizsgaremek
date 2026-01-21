import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import EventCard from '../components/EventCard';
import { events } from '../data/events';

const Events = () => {
    const [searchParams] = useSearchParams();
    const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
    const [city, setCity] = useState('');
    const [date, setDate] = useState('');
    const [type, setType] = useState('');
    const [filteredEvents, setFilteredEvents] = useState([]);

    useEffect(() => {
        const applyFilters = () => {
            const filtered = events.filter(event => {
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
    }, [keyword, city, date, type]);

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

                <div id="map-placeholder" className="map-placeholder">
                    <p><i className="fas fa-map-marked-alt"></i> Térkép betöltése (BAZ Megye)...</p>
                </div>

                <div className="event-grid" id="all-events-list">
                    {filteredEvents.length > 0 ? (
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